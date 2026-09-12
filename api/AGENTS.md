# Agent Instructions — Wongnok API

## Database migrations

ใช้ [goose](https://github.com/pressly/goose) จัดการ migration โดย config อ่านจาก `.env`
(`GOOSE_MIGRATION_DIR=./migrations`, `GOOSE_DRIVER=postgres`, `GOOSE_DBSTRING=...`)

สร้าง migration ใหม่ด้วยคำสั่ง:

```sh
goose create <ชื่อ_migration> sql
```

ตัวอย่าง:

```sh
goose create create_users sql
```

ไฟล์ที่สร้างจะอยู่ใน `migrations/` ในรูปแบบ `<timestamp>_<ชื่อ_migration>.sql`
พร้อม block `-- +goose Up` และ `-- +goose Down` ให้เติม SQL เอง

ดูโครงสร้างตาราง/ความสัมพันธ์ของ domain ได้ที่ [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
และดู API contract สำหรับ recipe/reference-data ได้ที่ [docs/API.md](docs/API.md)

## Seeding ข้อมูลตัวอย่าง

ใส่ข้อมูลตัวอย่าง (recipes + ingredients + instructions) ลง database ด้วยคำสั่ง:

```sh
go run ./cmd/seed
```

ข้อมูลอยู่ใน `cmd/seed/recipes.json` และ recipe ทั้งหมดมีเจ้าของเป็น user เดียวกัน
คือ `dev@pea.co.th` (uid ตรงกับ Keycloak realm `pea`)

ห้ามเอาข้อมูลตัวอย่างไปใส่ใน `migrations/` เพราะ integration test
(`internal/recipe/repository_integration_test.go`) อ่านไฟล์ `migrations/*.sql` ทุกไฟล์
ไปรันใน testcontainer ข้อมูล seed จะไปทำให้ test ที่นับจำนวน row พัง

ขั้นตอนแบบละเอียด (สำหรับสอน) ดูที่ [docs/SEEDING.md](docs/SEEDING.md)

## Testing

ก่อนเขียนหรือรัน test ให้ดูข้อกำหนดใน [docs/TESTING.md](docs/TESTING.md)
