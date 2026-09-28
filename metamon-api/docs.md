# Metamon — Backend Documentation

> **WAJIB DIBACA SEBELUM MEMULAI PEKERJAAN APAPUN.**
> Dokumen ini adalah sumber kebenaran tunggal untuk seluruh implementasi backend Metamon. Jangan menulis satu baris kode pun sebelum memahami seluruh isi dokumen ini.

---

## 1. Gambaran Umum Proyek

**Metamon** adalah sistem telemetri dan mitigasi gas metana untuk TPA (Tempat Pembuangan Akhir) Bantar Gebang. Frontend dibangun dengan **Nuxt 4 + Vue 3** dan saat ini menggunakan data statis hardcoded. Tugas backend adalah menyediakan REST API yang **menggantikan semua data statis tersebut** tanpa mengubah UI sedikit pun.

### Stack Backend

| Komponen | Teknologi |
|---|---|
| Framework | **NestJS** (TypeScript) |
| Database | **PostgreSQL** |
| ORM | **TypeORM** |
| Auth | **JWT** (access token + refresh token) |
| Validasi | **class-validator + class-transformer** |
| Dokumentasi API | **Swagger (@nestjs/swagger)** |

### Port Default
- Backend: `http://localhost:3001`
- Frontend Nuxt: `http://localhost:3000`

---

## 2. Struktur Proyek NestJS

```
metamon-api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   │
│   ├── auth/                    # Modul autentikasi petugas
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── guards/
│   │       └── jwt-auth.guard.ts
│   │
│   ├── officers/                # Modul profil petugas
│   │   ├── officers.module.ts
│   │   ├── officers.controller.ts
│   │   ├── officers.service.ts
│   │   └── entities/
│   │       └── officer.entity.ts
│   │
│   ├── sensors/                 # Modul node sensor & telemetri
│   │   ├── sensors.module.ts
│   │   ├── sensors.controller.ts
│   │   ├── sensors.service.ts
│   │   └── entities/
│   │       └── sensor-node.entity.ts
│   │
│   ├── readings/                # Modul pembacaan sensor (time-series)
│   │   ├── readings.module.ts
│   │   ├── readings.controller.ts
│   │   ├── readings.service.ts
│   │   └── entities/
│   │       └── sensor-reading.entity.ts
│   │
│   ├── sectors/                 # Modul status sektor TPA
│   │   ├── sectors.module.ts
│   │   ├── sectors.controller.ts
│   │   ├── sectors.service.ts
│   │   └── entities/
│   │       └── sector.entity.ts
│   │
│   ├── trucks/                  # Modul armada & pengalihan rute
│   │   ├── trucks.module.ts
│   │   ├── trucks.controller.ts
│   │   ├── trucks.service.ts
│   │   └── entities/
│   │       └── truck.entity.ts
│   │
│   ├── sop/                     # Modul protokol SOP & log insiden
│   │   ├── sop.module.ts
│   │   ├── sop.controller.ts
│   │   ├── sop.service.ts
│   │   └── entities/
│   │       ├── sop-task.entity.ts
│   │       └── incident-log.entity.ts
│   │
│   └── common/
│       ├── dto/                 # Shared DTOs
│       └── decorators/          # Custom decorators
│
├── .env
├── .env.example
└── package.json
```

---

## 3. Database Schema

### Aturan Umum
- Semua tabel menggunakan kolom `id` (UUID, primary key).
- Semua tabel memiliki kolom `created_at` dan `updated_at` (auto-managed TypeORM).
- Gunakan `snake_case` untuk nama kolom di database, `camelCase` di entitas TypeScript.

---

### 3.1 Tabel `officers` — Profil Petugas

Berdasarkan: `ProfilePage.vue`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | - |
| `name` | VARCHAR(100) | Nama lengkap petugas |
| `credentials` | VARCHAR(50) | Gelar akademik (S.T., M.Ling.) |
| `nip` | VARCHAR(30) UNIQUE | Nomor Induk Pegawai |
| `role` | TEXT | Jabatan & tanggung jawab |
| `avatar_url` | VARCHAR(255) | Path/URL foto profil |
| `password_hash` | VARCHAR(255) | Bcrypt hash password |
| `pin_hash` | VARCHAR(255) NULLABLE | Hash PIN 6 digit |
| `methane_alert_notif` | BOOLEAN DEFAULT true | Preferensi notif peringatan metana |
| `daily_report_notif` | BOOLEAN DEFAULT true | Preferensi notif laporan harian |
| `created_at` | TIMESTAMP | - |
| `updated_at` | TIMESTAMP | - |

---

### 3.2 Tabel `sectors` — Sektor TPA

Berdasarkan: `SectorStatus.vue`, `ReroutePage.vue`, `SpatialMap.vue`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | - |
| `sector_code` | VARCHAR(1) UNIQUE | 'A', 'B', 'C', 'D' |
| `name` | VARCHAR(50) | Nama tampilan (misal: "Sektor A") |
| `capacity_percent` | INTEGER | Persentase kapasitas buang terpakai (0–100) |
| `status` | ENUM('normal','warning','danger','locked') | Status sektor saat ini |
| `is_accepting_trucks` | BOOLEAN DEFAULT true | Apakah bisa menerima truk baru |
| `created_at` | TIMESTAMP | - |
| `updated_at` | TIMESTAMP | - |

**Catatan mapping status → label UI:**
- `normal` → "Beban Normal" / "Status: Aman"
- `warning` → "Beban Sedang" / "Status: Waspada"
- `danger` / `locked` → "Beban Penuh" / "Status: Terkunci"

---

### 3.3 Tabel `sensor_nodes` — Node Sensor Fisik

Berdasarkan: `SensorLogPage.vue`, `SensorLogModal.vue`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | - |
| `node_code` | VARCHAR(10) UNIQUE | Kode node (misal: "B-07", "C-07") |
| `sector_id` | UUID FK → sectors | Sektor tempat node dipasang |
| `battery_percent` | INTEGER | Level baterai saat ini (0–100) |
| `is_active` | BOOLEAN DEFAULT true | Apakah node aktif/terhubung |
| `last_seen_at` | TIMESTAMP | Waktu terakhir node mengirim data |
| `created_at` | TIMESTAMP | - |
| `updated_at` | TIMESTAMP | - |

**Total node:** 52 (target), 48 aktif, 4 dalam perawatan (data awal).

---

### 3.4 Tabel `sensor_readings` — Pembacaan Sensor (Time-Series)

Berdasarkan: `MethaneChart.vue`, `SensorLogPage.vue`, `SensorLogModal.vue`, `TelemetrySection.vue`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | - |
| `node_id` | UUID FK → sensor_nodes | Node yang membaca |
| `ch4_ppm` | DECIMAL(10,2) | Konsentrasi metana dalam ppm |
| `temperature_celsius` | DECIMAL(5,2) NULLABLE | Suhu permukaan |
| `recorded_at` | TIMESTAMP | Waktu pembacaan (bukan created_at) |
| `created_at` | TIMESTAMP | Waktu data masuk ke DB |

**Indeks:** Buat indeks pada `(node_id, recorded_at DESC)` untuk query time-series yang efisien.

**Ambang batas bahaya:** `ch4_ppm >= 1000` = Bahaya. `500 <= ch4_ppm < 1000` = Waspada. `< 500` = Normal.

---

### 3.5 Tabel `trucks` — Armada Truk

Berdasarkan: `ReroutePage.vue`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | - |
| `plate_number` | VARCHAR(20) UNIQUE | Nomor plat (misal: "B 9812 UOX") |
| `original_sector_id` | UUID FK → sectors | Sektor tujuan asal |
| `rerouted_sector_id` | UUID FK → sectors NULLABLE | Sektor tujuan baru (null = tidak dialihkan) |
| `is_rerouted` | BOOLEAN DEFAULT false | Status pengalihan |
| `created_at` | TIMESTAMP | - |
| `updated_at` | TIMESTAMP | - |

---

### 3.6 Tabel `sop_tasks` — Checklist Protokol Tanggap Darurat

Berdasarkan: `SopProtocolPage.vue`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | - |
| `title` | TEXT | Deskripsi tugas |
| `is_completed` | BOOLEAN DEFAULT false | Status penyelesaian |
| `completed_at` | TIMESTAMP NULLABLE | Waktu ditandai selesai |
| `completed_by_id` | UUID FK → officers NULLABLE | Petugas yang menyelesaikan |
| `order_index` | INTEGER | Urutan tampil di UI |
| `created_at` | TIMESTAMP | - |
| `updated_at` | TIMESTAMP | - |

---

### 3.7 Tabel `incident_logs` — Log & Riwayat Insiden

Berdasarkan: `SopProtocolPage.vue` (Log Penanganan & Riwayat Insiden)

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | - |
| `title` | VARCHAR(200) | Judul insiden |
| `description` | TEXT | Deskripsi insiden |
| `mitigation_notes` | TEXT NULLABLE | Catatan penanganan lapangan |
| `sector_id` | UUID FK → sectors NULLABLE | Sektor terdampak |
| `officer_id` | UUID FK → officers NULLABLE | Penanggung jawab |
| `status` | ENUM('open','resolved') DEFAULT 'open' | Status insiden |
| `resolved_at` | TIMESTAMP NULLABLE | Waktu insiden selesai ditangani |
| `created_at` | TIMESTAMP | - |
| `updated_at` | TIMESTAMP | - |

---

### 3.8 Tabel `audit_logs` — Riwayat Masuk & Audit

Berdasarkan: `ProfilePage.vue` (Modal "Riwayat Masuk & Audit")

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | - |
| `officer_id` | UUID FK → officers | Petugas yang login |
| `device_name` | VARCHAR(150) | Nama perangkat |
| `ip_address` | VARCHAR(45) | Alamat IP (IPv4/IPv6) |
| `location_note` | VARCHAR(200) NULLABLE | Keterangan lokasi |
| `is_active_session` | BOOLEAN DEFAULT false | Sesi sedang aktif |
| `created_at` | TIMESTAMP | Waktu login |

---

## 4. API Endpoints

### Konvensi Global
- Base URL: `/api/v1`
- Semua response JSON menggunakan wrapper:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "optional message"
  }
  ```
- Error response:
  ```json
  {
    "success": false,
    "error": "Error message",
    "statusCode": 400
  }
  ```
- Semua endpoint kecuali `POST /auth/login` memerlukan header `Authorization: Bearer <JWT>`.

---

### 4.1 Auth — `/api/v1/auth`

#### `POST /auth/login`
Login petugas.

**Body:**
```json
{
  "nip": "19880415 201201 2 004",
  "password": "string"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "officer": {
      "id": "uuid",
      "name": "Ratna Sari Dewi",
      "role": "Koordinator Keselamatan Lingkungan & K3 TPA",
      "avatarUrl": "/officer_ratna.jpg"
    }
  }
}
```

#### `POST /auth/logout`
Invalidasi sesi aktif. Tandai `is_active_session = false` pada audit log terkait.

#### `GET /auth/me`
Ambil data officer yang sedang login (dari JWT payload).

---

### 4.2 Officers — `/api/v1/officers`

#### `GET /officers/me`
Ambil profil lengkap petugas yang sedang login.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Ratna Sari Dewi",
    "credentials": "S.T., M.Ling.",
    "nip": "19880415 201201 2 004",
    "role": "Koordinator Keselamatan Lingkungan & K3 TPA",
    "avatarUrl": "/officer_ratna.jpg",
    "notifications": {
      "methaneAlert": true,
      "dailyReport": true
    }
  }
}
```

#### `PATCH /officers/me`
Update profil petugas yang sedang login.

**Body (semua field opsional):**
```json
{
  "name": "string",
  "credentials": "string",
  "nip": "string",
  "role": "string"
}
```

#### `PATCH /officers/me/notifications`
Update preferensi notifikasi.

**Body:**
```json
{
  "methaneAlert": true,
  "dailyReport": false
}
```

#### `PATCH /officers/me/password`
Ganti kata sandi dan/atau PIN.

**Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "newPin": "123456"
}
```

#### `GET /officers/me/audit-logs`
Ambil riwayat masuk untuk petugas yang sedang login.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "deviceName": "Ponsel Lapangan Rugged CAT S62",
      "ipAddress": "192.168.10.42",
      "locationNote": "Sektor B TPA (Zona Aktif)",
      "isActiveSession": true,
      "createdAt": "2026-09-27T08:15:00.000Z"
    }
  ]
}
```

---

### 4.3 Sectors — `/api/v1/sectors`

#### `GET /sectors`
Ambil semua sektor beserta status dan metrik terkini.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "sectorCode": "A",
      "name": "Sektor A",
      "capacityPercent": 42,
      "status": "normal",
      "statusLabel": "Beban Normal",
      "isAcceptingTrucks": true,
      "currentCh4Ppm": 190,
      "updatedAt": "2026-09-27T10:00:00.000Z"
    },
    {
      "id": "uuid",
      "sectorCode": "B",
      "name": "Sektor B",
      "capacityPercent": 100,
      "status": "locked",
      "statusLabel": "Beban Penuh",
      "isAcceptingTrucks": false,
      "currentCh4Ppm": 1490,
      "updatedAt": "2026-09-27T10:00:00.000Z"
    }
  ]
}
```

**Catatan:** `currentCh4Ppm` adalah nilai dari pembacaan sensor terbaru di sektor tersebut (query ke `sensor_readings` dengan JOIN ke `sensor_nodes`).

#### `GET /sectors/:id`
Ambil detail satu sektor.

#### `PATCH /sectors/:id`
Update status/kapasitas sektor (admin action — misal setelah eksekusi pengalihan).

**Body:**
```json
{
  "status": "warning",
  "capacityPercent": 71,
  "isAcceptingTrucks": true
}
```

---

### 4.4 Sensors — `/api/v1/sensors`

#### `GET /sensors`
Ambil daftar semua node sensor beserta pembacaan terkini.

**Query params:**
- `sector` — filter by sector code (A, B, C, D)
- `status` — filter by status (normal, warning, danger)
- `search` — filter by node_code (misal: "C-07")
- `page` — halaman (default: 1)
- `limit` — jumlah per halaman (default: 10)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "uuid",
        "nodeCode": "C-07",
        "sector": {
          "id": "uuid",
          "sectorCode": "C",
          "name": "Sektor C"
        },
        "batteryPercent": 88,
        "isActive": true,
        "lastSeenAt": "2026-09-27T10:00:00.000Z",
        "latestReading": {
          "ch4Ppm": 1428,
          "recordedAt": "2026-09-27T10:00:00.000Z"
        },
        "status": "danger"
      }
    ],
    "summary": {
      "totalNodes": 52,
      "activeNodes": 48,
      "peakCh4Ppm": 1428,
      "peakNodeCode": "B-07",
      "peakSectorName": "Sektor B TPA"
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 52,
      "totalPages": 6
    }
  }
}
```

**Logika kalkulasi `status` node:**
- `ch4_ppm >= 1000` → `"danger"`
- `500 <= ch4_ppm < 1000` → `"warning"`
- `ch4_ppm < 500` → `"normal"`

#### `GET /sensors/:id`
Detail satu node sensor.

#### `GET /sensors/:id/readings`
Ambil riwayat pembacaan satu node.

**Query params:**
- `from` — ISO timestamp awal (default: 24 jam lalu)
- `to` — ISO timestamp akhir (default: sekarang)
- `limit` — jumlah data (default: 100)

---

### 4.5 Readings — `/api/v1/readings`

#### `POST /readings`
Endpoint untuk node sensor mengirim pembacaan baru. Boleh tidak memerlukan JWT (gunakan API key terpisah di header `X-Sensor-Key`).

**Body:**
```json
{
  "nodeCode": "B-07",
  "ch4Ppm": 1490.5,
  "temperatureCelsius": 52.0,
  "recordedAt": "2026-09-27T10:00:00.000Z"
}
```

#### `GET /readings/ch4-series`
Data time-series CH4 untuk chart di `MethaneChart.vue`. Mengembalikan agregat per jam untuk hari ini.

**Query params:**
- `sectorCode` — filter sektor (opsional, default semua)
- `date` — tanggal (ISO date string, default: hari ini)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "currentCh4Ppm": 1428,
    "dangerThreshold": 1000,
    "series": [
      { "time": "02:00", "ch4Ppm": 190 },
      { "time": "05:00", "ch4Ppm": 210 },
      { "time": "08:00", "ch4Ppm": 740 },
      { "time": "11:00", "ch4Ppm": 1100 },
      { "time": "14:00", "ch4Ppm": 1428 }
    ]
  }
}
```

#### `GET /readings/stream`
(Opsional/phase 2) Server-Sent Events untuk push data real-time ke frontend.

---

### 4.6 Telemetry — `/api/v1/telemetry`

#### `GET /telemetry/dashboard`
Satu endpoint agregat untuk mengisi seluruh `TelemetrySection.vue` dan `QuickInfo.vue` sekaligus — mengurangi jumlah request saat load dashboard.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "riskLevel": "danger",
    "alertSector": "B",
    "alertMessage": "CH4 melampaui batas ambang",
    "avgCh4Ppm": 840,
    "ch4TrendPercent24h": 14,
    "activeNodes": 48,
    "totalNodes": 52,
    "activeNodePercent": 92.3,
    "reroutedTrucks": 4
  }
}
```

---

### 4.7 Trucks — `/api/v1/trucks`

#### `GET /trucks`
Ambil daftar armada truk.

**Query params:**
- `status` — `all` | `rerouted` | `normal`
- `search` — cari berdasarkan plate number
- `page`, `limit`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "trucks": [
      {
        "id": "uuid",
        "plateNumber": "B 9812 UOX",
        "isRerouted": true,
        "originalSector": { "id": "uuid", "sectorCode": "B", "name": "Sektor B" },
        "reroutedSector": { "id": "uuid", "sectorCode": "C", "name": "Sektor C" }
      }
    ],
    "summary": {
      "total": 4,
      "reroutedCount": 2,
      "normalCount": 2
    },
    "pagination": { "page": 1, "limit": 10, "total": 4, "totalPages": 1 }
  }
}
```

#### `PATCH /trucks/reroute-bulk`
Eksekusi pengalihan kuota — memindahkan semua truk yang semula menuju sektor tertentu ke sektor baru.

**Body:**
```json
{
  "fromSectorCode": "B",
  "toSectorCode": "C"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "reroutedCount": 2,
    "message": "Pengalihan Kuota Truk Berhasil Dieksekusi ke Sektor C"
  }
}
```

#### `PATCH /trucks/:id/reroute`
Ubah pengalihan untuk satu truk tertentu.

**Body:**
```json
{
  "toSectorCode": "A"
}
```

---

### 4.8 SOP — `/api/v1/sop`

#### `GET /sop/tasks`
Ambil daftar checklist tugas tanggap darurat, diurutkan by `order_index`.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "title": "Sterilisasi Perimeter Zona Merah (Radius 50m)",
        "isCompleted": true,
        "completedAt": "2026-09-27T10:14:00.000Z",
        "orderIndex": 1
      },
      {
        "id": "uuid",
        "title": "Pengalihan Lalu Lintas Truk ke Sektor C",
        "isCompleted": true,
        "completedAt": "2026-09-27T10:18:00.000Z",
        "orderIndex": 2
      },
      {
        "id": "uuid",
        "title": "Eksekusi Aerasi Sampah (Pengerukan Ekskavator)",
        "isCompleted": false,
        "completedAt": null,
        "orderIndex": 3
      },
      {
        "id": "uuid",
        "title": "Injeksi Air Pendingin ke Pipa Sensor",
        "isCompleted": false,
        "completedAt": null,
        "orderIndex": 4
      }
    ],
    "completedCount": 2,
    "totalCount": 4
  }
}
```

#### `PATCH /sop/tasks/:id/toggle`
Toggle status selesai/belum satu tugas. Otomatis set `completed_at = NOW()` saat `isCompleted` jadi true, null saat jadi false.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "isCompleted": true,
    "completedAt": "2026-09-27T10:45:00.000Z"
  }
}
```

#### `GET /sop/incidents`
Ambil riwayat insiden yang telah terselesaikan.

**Query params:**
- `status` — `open` | `resolved` | `all` (default: `resolved`)
- `sectorCode` — filter sektor
- `page`, `limit`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "incidents": [
      {
        "id": "uuid",
        "title": "Tekanan Balik Pipa Lindi",
        "description": "Pembersihan sedimentasi kerak & flushing katup primer sektor B.",
        "sector": { "id": "uuid", "sectorCode": "B", "name": "Sektor B" },
        "status": "resolved",
        "resolvedAt": "2026-09-27T08:30:00.000Z",
        "createdAt": "2026-09-27T07:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 2, "totalPages": 1 }
  }
}
```

#### `POST /sop/incidents`
Buat log insiden baru (admin).

**Body:**
```json
{
  "title": "string",
  "description": "string",
  "sectorCode": "B",
  "officerId": "uuid"
}
```

#### `PATCH /sop/incidents/:id`
Update catatan penanganan atau status insiden.

**Body:**
```json
{
  "mitigationNotes": "Tim damkar standby di radius 100m...",
  "status": "resolved"
}
```

#### `POST /sop/alert-broadcast`
Kirim broadcast peringatan dini (tombol "🚨 Broadcast Peringatan Dini" di `SafetyProtocolModal.vue`). Pada phase 1, cukup log ke database. Phase 2 bisa integrasi push notification.

**Body:**
```json
{
  "message": "Peringatan Dini (Alert Broadcast) dikirimkan ke Tim Operasional TPA & Damkar.",
  "sectorCode": "B"
}
```

---

## 5. Autentikasi & Keamanan

### Flow JWT
1. `POST /auth/login` → terima `accessToken` (expire: 8 jam).
2. Semua request berikutnya kirim header: `Authorization: Bearer <accessToken>`.
3. Saat login berhasil, buat entri baru di tabel `audit_logs` dengan `is_active_session = true`.
4. Saat `POST /auth/logout`, set `is_active_session = false` pada entri audit log aktif milik officer tersebut.

### JWT Payload
```json
{
  "sub": "officer-uuid",
  "nip": "19880415 201201 2 004",
  "name": "Ratna Sari Dewi",
  "iat": 1234567890,
  "exp": 1234596090
}
```

### Password & PIN
- Password di-hash menggunakan `bcrypt` dengan salt rounds = 12.
- PIN 6 digit juga di-hash dengan bcrypt sebelum disimpan.
- Validasi PIN dipisah dari password — PIN untuk quick access, password untuk operasi sensitif.

---

## 6. Variabel Lingkungan (`.env`)

```env
# App
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=metamon_db

# JWT
JWT_SECRET=your_super_secret_key_minimum_32_chars
JWT_EXPIRES_IN=8h

# Sensor API Key (untuk endpoint POST /readings)
SENSOR_API_KEY=your_sensor_api_key

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

---

## 7. Seed Data Awal

Seed ini harus dijalankan sekali setelah migrasi database untuk mengisi data awal yang sesuai dengan state hardcoded di frontend.

### Sektor (4 record)
| Code | Status | Capacity | CH4 |
|---|---|---|---|
| A | normal | 42% | 190 ppm |
| B | locked | 100% | 1490 ppm |
| C | warning | 60% | 910 ppm |
| D | warning | 68% | 800 ppm |

### Node Sensor (minimal 5 record aktif)
| Code | Sektor | CH4 | Status |
|---|---|---|---|
| C-07 | C | 1428 ppm | danger |
| B-12 | B | 740 ppm | warning |
| B-07 | B | 1490 ppm | danger |
| A-04 | A | 190 ppm | normal |
| A-09 | A | 220 ppm | normal |
| D-02 | D | 115 ppm | normal |

### Petugas (1 record — yang aktif di UI)
- Name: `Ratna Sari Dewi`
- Credentials: `S.T., M.Ling.`
- NIP: `19880415 201201 2 004`
- Role: `Koordinator Keselamatan Lingkungan & K3 TPA`
- Avatar URL: `/officer_ratna.jpg`
- Password default: `admin123` (harus diganti setelah deploy)

### Armada Truk (4 record)
| Plate | Asal | Tujuan Baru | Dialihkan |
|---|---|---|---|
| B 9812 UOX | B | C | Ya |
| B 5729 UOX | B | C | Ya |
| B 3411 UOX | A | - | Tidak |
| B 9102 KAA | D | - | Tidak |

### SOP Tasks (4 record, urutan sesuai `order_index`)
1. Sterilisasi Perimeter Zona Merah (Radius 50m) — **completed**
2. Pengalihan Lalu Lintas Truk ke Sektor C — **completed**
3. Eksekusi Aerasi Sampah (Pengerukan Ekskavator) — belum
4. Injeksi Air Pendingin ke Pipa Sensor — belum

### Incident Logs (2 record resolved)
1. "Tekanan Balik Pipa Lindi" — Sektor B, resolved, resolved_at = kemarin 08:30
2. "Saturasi Gas Dekat Jalan Masuk" — Sektor B, resolved, resolved_at = 2 hari lalu 14:15

---

## 8. Aturan Kalkulasi & Business Logic

### Kalkulasi Status Sensor
```
ch4_ppm >= 1000  →  status = "danger"
ch4_ppm >= 500   →  status = "warning"
ch4_ppm < 500    →  status = "normal"
```

### Kalkulasi Status Sektor
Status sektor ditentukan dari **pembacaan tertinggi** seluruh node aktif di sektor tersebut:
```
max(ch4_ppm) >= 1000  →  status = "danger" atau "locked"
max(ch4_ppm) >= 500   →  status = "warning"
max(ch4_ppm) < 500    →  status = "normal"
```

Bedanya `danger` vs `locked`: `locked` diset manual (capacity = 100% dan `is_accepting_trucks = false`).

### Kalkulasi `riskLevel` Dashboard
```
Ada sektor dengan status "danger" atau "locked"  →  riskLevel = "danger"
Ada sektor dengan status "warning" (tanpa danger)  →  riskLevel = "warning"
Semua sektor "normal"  →  riskLevel = "normal"
```

### Kalkulasi `avgCh4Ppm`
Rata-rata `ch4_ppm` dari pembacaan **terbaru** setiap node aktif (bukan rata-rata historis).

### Kalkulasi `ch4TrendPercent24h`
```
avg_ch4_now = rata-rata ch4 terbaru semua node
avg_ch4_24h_ago = rata-rata ch4 dari 24 jam yang lalu
trend = ((avg_ch4_now - avg_ch4_24h_ago) / avg_ch4_24h_ago) * 100
```

---

## 9. CORS

Backend harus mengizinkan request dari origin frontend:
```typescript
// main.ts
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
});
```

---

## 10. Pemetaan Frontend → Backend

Tabel ini memetakan setiap komponen Vue ke endpoint yang harus dipanggil untuk menggantikan data statis.

| Komponen | Data yang Dibutuhkan | Endpoint |
|---|---|---|
| `QuickInfo.vue` | Alert sektor aktif, nama TPA | `GET /telemetry/dashboard` |
| `TelemetrySection.vue` | Risk level, avg CH4, sensor aktif, armada alih | `GET /telemetry/dashboard` |
| `SpatialMap.vue` | Status & CH4 semua sektor | `GET /sectors` |
| `SectorStatus.vue` | Status, kapasitas, CH4 semua sektor | `GET /sectors` |
| `MethaneChart.vue` | Time-series CH4 hari ini | `GET /readings/ch4-series` |
| `SensorLogPage.vue` | Daftar node + pembacaan terbaru, summary | `GET /sensors` |
| `SensorLogModal.vue` | Log stream 24 node | `GET /sensors` (limit terbaru) |
| `ReroutePage.vue` | Status sektor, daftar truk | `GET /sectors` + `GET /trucks` |
| `ReroutePage.vue` (eksekusi) | Pengalihan bulk truk | `PATCH /trucks/reroute-bulk` |
| `ReroutePage.vue` (pindah 1 truk) | Pindah ke sektor lain | `PATCH /trucks/:id/reroute` |
| `SopProtocolPage.vue` | Checklist, log insiden | `GET /sop/tasks` + `GET /sop/incidents` |
| `SopProtocolPage.vue` (toggle) | Toggle task selesai | `PATCH /sop/tasks/:id/toggle` |
| `SopProtocolPage.vue` (simpan catatan) | Simpan mitigation notes | `PATCH /sop/incidents/:id` |
| `SafetyProtocolModal.vue` (broadcast) | Kirim alert | `POST /sop/alert-broadcast` |
| `ProfilePage.vue` | Data profil, preferensi | `GET /officers/me` |
| `ProfilePage.vue` (edit) | Update profil | `PATCH /officers/me` |
| `ProfilePage.vue` (notif toggle) | Update preferensi notif | `PATCH /officers/me/notifications` |
| `ProfilePage.vue` (ganti sandi) | Update password/PIN | `PATCH /officers/me/password` |
| `ProfilePage.vue` (audit) | Riwayat login | `GET /officers/me/audit-logs` |
| `AppHeader.vue` + `SidebarMenu.vue` | Login/logout | `POST /auth/login` + `POST /auth/logout` |

---

## 11. Urutan Pengerjaan yang Disarankan

Kerjakan dalam urutan ini untuk menghindari dependency yang belum tersedia:

1. **Setup proyek NestJS** — init project, install dependencies, konfigurasi TypeORM, buat koneksi database, setup Swagger.
2. **Database migration** — buat semua entitas dan jalankan migrasi.
3. **Seed data** — isi data awal sesuai Bagian 7.
4. **Modul Auth** — implementasi login, JWT strategy, dan guard.
5. **Modul Officers** — CRUD profil, notifikasi, password, audit logs.
6. **Modul Sectors** — CRUD sektor dengan kalkulasi status dinamis.
7. **Modul Sensors & Readings** — node sensor, time-series, summary.
8. **Modul Telemetry** — dashboard aggregator endpoint.
9. **Modul Trucks** — daftar truk, reroute bulk, reroute individual.
10. **Modul SOP** — checklist tasks, incident logs, alert broadcast.
11. **Testing** — uji setiap endpoint dengan Swagger UI atau Postman.

---

## 12. Hal yang TIDAK Boleh Dilakukan

- **Jangan ubah file apapun di folder `metamon/app/`** — UI sudah final.
- **Jangan ubah `nuxt.config.ts` atau `package.json` frontend** tanpa persetujuan eksplisit.
- **Jangan simpan plaintext password** di database — selalu bcrypt.
- **Jangan skip validasi DTO** — gunakan `class-validator` di semua endpoint yang menerima body.
- **Jangan return password_hash atau pin_hash** di response API manapun.
- **Jangan buat endpoint tanpa guard JWT** kecuali `POST /auth/login` dan `POST /readings` (yang pakai API key).
