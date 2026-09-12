# Seeding ข้อมูลตัวอย่าง

เอกสารนี้อธิบายวิธีใส่ข้อมูลตัวอย่างลง database แบบทีละขั้น สำหรับผู้เริ่มต้น

สิ่งที่จะได้หลังทำครบ:

| ตาราง | จำนวน row |
| --- | --- |
| `users` | 1 (`dev@pea.co.th`) |
| `recipes` | 50 |
| `recipe_ingredients` | 368 |
| `recipe_instructions` | 232 |

## Seed คืออะไร ทำไมต้องมี

`migration` คือการสร้าง **โครงสร้าง** (ตาราง, คอลัมน์, ความสัมพันธ์)
`seed` คือการใส่ **ข้อมูล** ตัวอย่างเข้าไปในโครงสร้างนั้น

database ที่เพิ่งสร้างใหม่จะมีตารางครบแต่ไม่มีข้อมูลเลย เปิดเว็บขึ้นมาก็เห็นหน้าว่าง
ทดสอบหน้า list / หน้า detail / การแบ่งหน้าไม่ได้ seed จึงช่วยให้มีข้อมูลให้เล่นได้ทันที

ในโปรเจกต์นี้ seed เป็นโปรแกรม Go แยกตัวหนึ่ง อยู่ที่ `cmd/seed/`

```
api/cmd/seed/main.go       โปรแกรม seed
api/cmd/seed/recipes.json  ข้อมูล 50 เมนู
```

> **ทำไม seed ไม่อยู่ใน `migrations/`**
> integration test (`internal/recipe/repository_integration_test.go`) อ่านไฟล์
> `migrations/*.sql` **ทุกไฟล์** ไปรันใน testcontainer ถ้าเอาข้อมูลตัวอย่างไปไว้ใน
> `migrations/` ข้อมูล 50 เมนูจะโผล่ไปอยู่ใน database ของ test ด้วย
> ทำให้ test ที่นับจำนวน row หรือเช็คค่าเฉลี่ย rating พังทันที

## สิ่งที่ต้องมีก่อน

1. Docker (สำหรับรัน postgres)
2. Go (เวอร์ชันตาม `mise.toml` คือ 1.26 ขึ้นไป) ตรวจด้วย `go version`
3. `goose` CLI สำหรับรัน migration ติดตั้งครั้งเดียว:

```sh
go install github.com/pressly/goose/v3/cmd/goose@latest
```

ถ้าพิมพ์ `goose` แล้วไม่เจอคำสั่ง ให้เพิ่ม `$(go env GOPATH)/bin` เข้า `PATH`

## ขั้นตอน

### ขั้นที่ 1 — เปิด database

รันที่ **root ของ repo** (โฟลเดอร์ที่มี `compose.yml`)

```sh
docker compose up -d postgres
```

ตรวจว่าขึ้นแล้ว:

```sh
docker compose ps postgres
```

### ขั้นที่ 2 — เข้าโฟลเดอร์ api

คำสั่งตั้งแต่นี้ไปต้องรันใน `api/` เพราะโปรแกรมอ่านค่าเชื่อมต่อ database จากไฟล์
`api/.env` (โหลดอัตโนมัติผ่าน `godotenv/autoload` ใน `internal/config`)
ถ้ารันจากที่อื่นจะหาไฟล์ `.env` ไม่เจอแล้ว error

```sh
cd api
```

### ขั้นที่ 3 — ดูค่าเชื่อมต่อ database

```sh
grep POSTGRES_DSN .env
```

จะเห็นประมาณนี้:

```
POSTGRES_DSN=postgres://postgres:Pe%40devp00l@localhost:5532/wongnok?sslmode=disable
```

สังเกตว่า port คือ **5532** ไม่ใช่ 5432 เพราะ `compose.yml` map port ออกมาเป็น `5532:5432`
กันชนกับ postgres ตัวอื่นที่อาจติดตั้งอยู่ในเครื่อง

### ขั้นที่ 4 — สร้างตารางด้วย migration

ต้องทำก่อน seed เสมอ เพราะต้องมีตารางก่อนจะใส่ข้อมูลได้

```sh
goose status
```

database ใหม่จะเห็นทุกบรรทัดเป็น `Pending` จากนั้นสั่งรัน:

```sh
goose up
goose status
```

ครั้งนี้ควรเป็น `Applied` ทั้งหมด

> migration ที่สร้างตาราง `difficulties` กับ `durations` จะ `INSERT` ข้อมูลหลัก
> (master data) ให้เลย ได้แก่ `easy` / `medium` / `hard` และ `10m` / `30m` / `60m` / `long`
> ข้อมูลชุดนี้ต้องมีอยู่ก่อน ไม่งั้น seed จะ insert recipe ไม่ได้เพราะติด foreign key

### ขั้นที่ 5 — รัน seed

```sh
go run ./cmd/seed
```

ถ้าสำเร็จจะเห็น log ปิดท้ายว่า:

```
level=INFO msg="seed completed" service=wongnok-seed recipes=50 ingredients=368 instructions=232
```

### ขั้นที่ 6 — ตรวจผลด้วยการนับจำนวน

กลับไปที่ root ของ repo (`cd ..`) แล้วสั่ง

```sh
docker compose exec postgres psql -U postgres -d wongnok -c \
  "SELECT (SELECT count(*) FROM users) users,
          (SELECT count(*) FROM recipes) recipes,
          (SELECT count(*) FROM recipe_ingredients) ingredients,
          (SELECT count(*) FROM recipe_instructions) instructions;"
```

> ใช้ `docker compose exec` เพราะเครื่องเราไม่จำเป็นต้องมี `psql` ติดตั้งไว้
> เราไปใช้ `psql` ที่อยู่ใน container ของ postgres แทน

### ขั้นที่ 7 — ตรวจว่าข้อมูลเชื่อมกันถูก

```sh
docker compose exec postgres psql -U postgres -d wongnok -c \
  "SELECT r.id, r.name, r.difficulty_id, r.duration_id, r.average_rating, u.email
     FROM recipes r JOIN users u ON u.id = r.creator_id
    ORDER BY r.id LIMIT 3;"
```

ทุก recipe ต้องมี `email` เป็น `dev@pea.co.th` แปลว่า `creator_id` ชี้ไปที่ user ถูกตัว

ดูส่วนผสมกับขั้นตอนของ recipe ใด recipe หนึ่ง:

```sh
docker compose exec postgres psql -U postgres -d wongnok -c \
  "SELECT description FROM recipe_instructions WHERE recipe_id = 1 ORDER BY id;"
```

> ตาราง `recipe_ingredients` และ `recipe_instructions` **ไม่มีคอลัมน์ลำดับ**
> ลำดับจึงอ้างอิงจาก `id` ที่ insert เข้าไป เวลา query ต้อง `ORDER BY id` เสมอ
> โปรแกรม seed จึง insert ตามลำดับใน array ของ `recipes.json`

### ขั้นที่ 8 — ลองรันซ้ำ

```sh
cd api && go run ./cmd/seed
```

นับจำนวนใหม่จะได้เท่าเดิม และ `recipes.id` กลับไปเริ่มที่ 1
เพราะ seed จะล้างข้อมูลเก่าก่อนใส่ใหม่ทุกครั้ง (รันกี่รอบก็ได้ผลเหมือนกัน)

## โปรแกรม seed ทำอะไรบ้าง

อ่านโค้ดใน `cmd/seed/main.go` ประกอบ ลำดับการทำงานคือ

1. **โหลด config** จาก `.env` → ได้ DSN ของ database
2. **เชื่อมต่อ database** (ไม่ต้องใช้ redis หรือ keycloak)
3. **ตรวจข้อมูลใน `recipes.json` ให้ครบก่อน** ว่า `level` กับ `duration` ใช้ค่าที่มีจริง
   ถ้าผิดจะ error ออกมาทั้งหมดพร้อมกันโดยยัง **ไม่แตะ** database เลย
   (ดีกว่าปล่อยให้ insert ไปครึ่งทางแล้วพัง)
4. เปิด **transaction เดียว** ครอบทุกอย่าง ถ้าพังกลางทางจะ rollback ทั้งก้อน
   ไม่เหลือข้อมูลค้าง
   1. **หา/สร้าง user เจ้าของ** — ค้นด้วย `uid` ไม่ใช่ `id` เพราะถ้า `dev@pea.co.th`
      เคยล็อกอินผ่านเว็บมาแล้ว ระบบจะสร้าง row ไว้ด้วย `uuid` ที่สุ่มมา
      เราต้องใช้ row เดิมนั้น ไม่ใช่สร้างใหม่ให้ซ้ำ
   2. **ล้างข้อมูลเก่า** ด้วย `TRUNCATE ... RESTART IDENTITY CASCADE`
   3. **insert recipe ทีละรายการ** แล้วเอา `id` ที่ได้ไปใส่ใน ingredients / instructions
      ก่อน insert แบบ bulk (วิธีเดียวกับ `internal/recipe/repository.go`)
5. log จำนวนที่ใส่สำเร็จ

### จุดที่มักเข้าใจผิด

**ทำไมใช้ `TRUNCATE` ไม่ใช้ `DELETE`**
model ทุกตัวมีฟิลด์ `gorm.DeletedAt` ซึ่งเป็น *soft delete* — สั่ง `Delete` ผ่าน GORM
จะเป็นการ `UPDATE` คอลัมน์ `deleted_at` ข้อมูลเก่ายังอยู่ในตารางจริง และ `id` จะวิ่งขึ้นเรื่อย ๆ
`TRUNCATE` ลบจริง และ `RESTART IDENTITY` สั่งให้ `id` (ชนิด `SERIAL`) เริ่มนับ 1 ใหม่

**ทำไมตาราง `users` ไม่ถูกล้าง**
`users` ผูกกับบัญชีใน Keycloak ถ้าล้างทิ้งจะกระทบการล็อกอิน
seed จึงล้างแค่ `recipes` และตารางที่อ้างถึง `recipes`

**ทำไมต้องกำหนด `uuid` ของ user เอง**
ตาราง `users` คอลัมน์ `id` **ไม่มี** `DEFAULT` ใน database (ต่างจากที่ tag ของ GORM เขียนไว้)
ถ้าไม่ใส่ค่าเองจะ insert ไม่ผ่าน โปรแกรมจึงเรียก `uuid.New()` ให้

**ทำไม `level` ใน JSON เป็น `EASY` แต่ใน database เป็น `easy`**
`difficulties.id` ที่ migration ใส่ไว้เป็นตัวพิมพ์เล็ก โปรแกรม seed มีตารางแปลงค่า
(`difficultyIDs`) ทำหน้าที่นี้ ส่วน `duration` ใช้ค่าตรงกันอยู่แล้วจึงไม่ต้องแปลง

**`ratingCount` ใน JSON หายไปไหน**
ตาราง `recipe_ratings` มี primary key เป็น `(user_id, recipe_id)` คือ 1 user ให้คะแนนได้ 1 ครั้ง
ต่อ 1 recipe การจะให้ `ratingCount` เป็น 1240 จริง ๆ ต้องมี user 1240 คน
seed นี้มี user คนเดียวจึงเก็บแค่ค่าเฉลี่ยลง `recipes.average_rating`
จำนวนคนให้คะแนนบนหน้าเว็บจะยังเป็น 0 จนมีคนมากดให้คะแนนจริง

## ปัญหาที่อาจเจอ

| อาการ | สาเหตุ / วิธีแก้ |
| --- | --- |
| `load configuration: ...` | รันไม่ได้อยู่ใน `api/` จึงหา `.env` ไม่เจอ → `cd api` ก่อน |
| `database connection: ... connection refused` | ยังไม่ได้เปิด postgres → `docker compose up -d postgres` |
| `relation "recipes" does not exist` | ยังไม่ได้รัน migration → `goose up` |
| `violates foreign key constraint ... difficulties` | ตาราง master data ว่าง → รัน `goose up` ให้ครบ |
| `unknown level "..."` / `unknown duration "..."` | ค่าใน `recipes.json` ไม่ตรงกับที่ระบบรู้จัก → แก้ JSON |
| seed ผ่านแต่หน้าเว็บหน้า 2 ขึ้นข้อมูลซ้ำหน้า 1 | **ไม่ใช่ปัญหาของ seed** เป็นบั๊กที่มีอยู่เดิมใน `internal/recipe/repository.go` ฟังก์ชัน `List` เรียก `Order(...)` ในตำแหน่งที่ควรเป็น `Offset(...)` |

## เพิ่ม / แก้ข้อมูลตัวอย่าง

แก้ไฟล์ `cmd/seed/recipes.json` แล้วรัน `go run ./cmd/seed` ใหม่
รูปร่างของแต่ละรายการ:

```json
{
  "name": "ชื่อเมนู",
  "description": "คำอธิบายสั้น ๆ",
  "duration": "10m | 30m | 60m | long",
  "imageUrl": "https://...",
  "level": "EASY | MEDIUM | HARD",
  "ingredients": ["ส่วนผสม 1", "ส่วนผสม 2"],
  "instruction": ["ขั้นตอน 1", "ขั้นตอน 2"],
  "rating": { "rating": 4.8, "ratingCount": 1240 }
}
```

`duration` และ `level` ต้องใช้ค่าตามที่ระบุเท่านั้น ถ้าใส่ค่าอื่นโปรแกรมจะฟ้องก่อนเริ่ม insert
