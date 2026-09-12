// Command seed ใส่ข้อมูลตัวอย่าง (recipes + ingredients + instructions) ลง database
// สำหรับใช้งานตอน develop เท่านั้น ไม่ได้ถูก build เข้า image (Dockerfile build แค่ ./cmd/api)
//
// วิธีรัน (ต้องอยู่ใน directory api/ เพราะ internal/config โหลด .env ผ่าน godotenv/autoload):
//
//	go run ./cmd/seed
//
// รายละเอียดแบบ step by step ดูที่ docs/SEEDING.md
package main

import (
	"context"
	_ "embed"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"os"
	"strings"
	"wongnok/internal/config"
	"wongnok/internal/platform/database"
	"wongnok/internal/recipe"
	"wongnok/internal/user"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// embed ไฟล์ข้อมูลไว้ใน binary เพื่อให้ไม่ต้องหา path ของไฟล์ตอน runtime
//
//go:embed recipes.json
var recipesJSON []byte

// เจ้าของ recipe ทั้งหมดคือ user เดียวกัน
// seedUserUID ต้องเท่ากับ "sub" ของ dev@pea.co.th ใน Keycloak realm "pea"
// (ดู keycloak/import/pea-realm.json) เพื่อให้ล็อกอินแล้วเห็นว่าเป็น recipe ของตัวเอง
const (
	seedUserUID      = "723154bb-d7af-485f-baaf-0425a0a79ea0"
	seedUserEmail    = "dev@pea.co.th"
	seedUserName     = "Developer Pea"
	seedUserUsername = "dev@pea.co.th"
)

// difficulties / durations ถูก seed ไว้แล้วโดย migration ที่สร้างตาราง
// ค่าที่ใช้ที่นี่จึงต้องตรงกับ id ในตารางเท่านั้น ไม่งั้นจะติด foreign key
var difficultyIDs = map[string]string{
	"EASY":   "easy",
	"MEDIUM": "medium",
	"HARD":   "hard",
}

var durationIDs = map[string]struct{}{
	"10m":  {},
	"30m":  {},
	"60m":  {},
	"long": {},
}

// seedRecipe คือรูปร่างของข้อมูลใน recipes.json
// หมายเหตุ rating.ratingCount ไม่ได้ถูกใช้ เพราะตาราง recipe_ratings มี primary key
// เป็น (user_id, recipe_id) หนึ่ง user จึงให้คะแนนได้แค่ครั้งเดียว
// การจะให้ ratingCount เป็น 1240 ต้องมี user 1240 คน ซึ่งเกินขอบเขตของ seed นี้
// เราเก็บแค่ค่าเฉลี่ยลง recipes.average_rating
type seedRecipe struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Duration    string   `json:"duration"`
	ImageURL    string   `json:"imageUrl"`
	Level       string   `json:"level"`
	Ingredients []string `json:"ingredients"`
	Instruction []string `json:"instruction"`
	Rating      struct {
		Rating float64 `json:"rating"`
	} `json:"rating"`
}

func main() {
	if err := run(); err != nil {
		slog.Error("seed failed", "error", err)
		os.Exit(1)
	}
}

func run() error {
	slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	})).With("service", "wongnok-seed"))

	// Load configuration (อ่าน .env ให้อัตโนมัติเพราะ internal/config import godotenv/autoload)
	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("load configuration:\n%s", config.Humanize(err))
	}

	ctx := context.Background()

	// .env ตั้ง LOG_LEVEL=DEBUG ไว้ ซึ่งทำให้ GORM log SQL ทุก statement (หลายร้อยบรรทัด)
	// seed insert เป็นพันแถว ถ้าปล่อยไว้จะมองไม่เห็นผลลัพธ์สรุป จึงลดระดับเป็น WARN
	// (ยังเห็น error และ slow query อยู่)
	dbLogging := cfg.Logging
	if strings.EqualFold(dbLogging.Level, "DEBUG") {
		dbLogging.Level = "WARN"
	}

	// Database connection (seed ไม่ต้องใช้ redis หรือ keycloak)
	db, sqldb, err := database.Open(ctx, cfg.Database.PostgresDSN, dbLogging)
	if err != nil {
		return fmt.Errorf("database connection: %w", err)
	}
	defer sqldb.Close()

	// ตรวจข้อมูลให้ครบก่อนแตะ database เพื่อไม่ให้เหลือข้อมูลค้างครึ่ง ๆ กลาง ๆ
	seeds, err := parseSeeds(recipesJSON)
	if err != nil {
		return err
	}

	var ingredientCount, instructionCount int

	// ทำทั้งหมดใน transaction เดียว ถ้าพังกลางทางจะ rollback ทั้งก้อน
	if err := db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		creator, err := ensureCreator(tx)
		if err != nil {
			return fmt.Errorf("ensure creator: %w", err)
		}

		if err := truncateRecipes(tx); err != nil {
			return fmt.Errorf("truncate recipes: %w", err)
		}

		for _, seed := range seeds {
			created, err := createRecipe(tx, seed, creator.ID)
			if err != nil {
				return fmt.Errorf("create recipe %q: %w", seed.Name, err)
			}

			ingredientCount += len(created.Ingredients)
			instructionCount += len(created.Instructions)
		}

		slog.Info("seeding", "creator", creator.Email, "creatorId", creator.ID)

		return nil
	}); err != nil {
		return err
	}

	slog.Info("seed completed",
		"recipes", len(seeds),
		"ingredients", ingredientCount,
		"instructions", instructionCount,
	)

	return nil
}

// parseSeeds แปลง recipes.json เป็น struct และตรวจว่า level/duration ใช้ได้จริง
// รวมปัญหาทั้งหมดแล้วรายงานทีเดียว เพื่อให้แก้ไฟล์ข้อมูลได้ครบในรอบเดียว
func parseSeeds(data []byte) ([]seedRecipe, error) {
	var seeds []seedRecipe
	if err := json.Unmarshal(data, &seeds); err != nil {
		return nil, fmt.Errorf("parse recipes.json: %w", err)
	}

	if len(seeds) == 0 {
		return nil, errors.New("recipes.json: no recipe to seed")
	}

	var problems []string
	for index, seed := range seeds {
		if strings.TrimSpace(seed.Name) == "" {
			problems = append(problems, fmt.Sprintf("recipes[%d]: name is empty", index))
		}

		if _, ok := difficultyIDs[seed.Level]; !ok {
			problems = append(problems, fmt.Sprintf("recipes[%d] (%s): unknown level %q", index, seed.Name, seed.Level))
		}

		if _, ok := durationIDs[seed.Duration]; !ok {
			problems = append(problems, fmt.Sprintf("recipes[%d] (%s): unknown duration %q", index, seed.Name, seed.Duration))
		}
	}

	if len(problems) > 0 {
		return nil, fmt.Errorf("invalid seed data:\n  %s", strings.Join(problems, "\n  "))
	}

	return seeds, nil
}

// ensureCreator หา user จาก uid ถ้ายังไม่มีก็สร้างใหม่
// ต้องหาด้วย uid ไม่ใช่ id เพราะถ้า dev@pea.co.th เคยล็อกอินมาแล้ว
// user.service.UpsertFromKeycloak จะสร้าง row ไว้ด้วย uuid ที่สุ่มมา เราต้องใช้ id เดิมนั้น
func ensureCreator(tx *gorm.DB) (*user.User, error) {
	var creator user.User

	err := tx.Where("uid = ?", seedUserUID).First(&creator).Error
	if err == nil {
		return &creator, nil
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	name := seedUserName
	username := seedUserUsername

	// users.id ไม่มี default ใน database (ต่างจาก tag ของ gorm) จึงต้องกำหนด uuid เอง
	creator = user.User{
		ID:                uuid.New(),
		Email:             seedUserEmail,
		Name:              &name,
		UID:               seedUserUID,
		PreferredUsername: &username,
	}

	if err := tx.Create(&creator).Error; err != nil {
		return nil, err
	}

	return &creator, nil
}

// truncateRecipes ล้างข้อมูลเก่าก่อน seed ใหม่ เพื่อให้รันซ้ำกี่ครั้งก็ได้ผลเหมือนกัน
//
// ใช้ TRUNCATE ไม่ใช่ gorm Delete เพราะ model มี gorm.DeletedAt (soft delete)
// ถ้าใช้ Delete ข้อมูลเก่าจะยังอยู่ในตารางและ id จะวิ่งขึ้นเรื่อย ๆ
// RESTART IDENTITY ทำให้ recipes.id เริ่มนับ 1 ใหม่ทุกครั้ง
//
// ตาราง users ไม่ถูกล้าง เพราะเป็นข้อมูลที่ผูกกับ Keycloak
func truncateRecipes(tx *gorm.DB) error {
	return tx.Exec(
		"TRUNCATE recipe_ingredients, recipe_instructions, user_favorites, recipe_ratings, recipes RESTART IDENTITY CASCADE",
	).Error
}

// createRecipe insert recipe หนึ่งรายการพร้อมลูกของมัน
// ใช้วิธีเดียวกับ internal/recipe/repository.go (Create) คือ insert แม่ก่อน
// แล้วเอา id ที่ได้ไปเติมใน ingredients/instructions ก่อน bulk insert
func createRecipe(tx *gorm.DB, seed seedRecipe, creatorID uuid.UUID) (*recipe.Recipe, error) {
	imageURL := seed.ImageURL

	model := recipe.Recipe{
		Name:          seed.Name,
		Description:   seed.Description,
		ImageURL:      &imageURL,
		DifficultyID:  difficultyIDs[seed.Level],
		DurationID:    seed.Duration,
		AverageRating: seed.Rating.Rating,
		CreatorID:     creatorID,
	}

	if err := tx.Omit(clause.Associations).Create(&model).Error; err != nil {
		return nil, err
	}

	// ตาราง recipe_ingredients / recipe_instructions ไม่มีคอลัมน์ลำดับ
	// ลำดับจึงอ้างอิงจาก id ที่ insert เข้าไป ต้อง insert ตามลำดับใน array
	for _, description := range seed.Ingredients {
		model.Ingredients = append(model.Ingredients, recipe.RecipeIngredient{
			RecipeID:    model.ID,
			Description: description,
		})
	}

	if len(model.Ingredients) > 0 {
		if err := tx.Omit(clause.Associations).Create(&model.Ingredients).Error; err != nil {
			return nil, err
		}
	}

	for _, description := range seed.Instruction {
		model.Instructions = append(model.Instructions, recipe.RecipeInstruction{
			RecipeID:    model.ID,
			Description: description,
		})
	}

	if len(model.Instructions) > 0 {
		if err := tx.Omit(clause.Associations).Create(&model.Instructions).Error; err != nil {
			return nil, err
		}
	}

	return &model, nil
}
