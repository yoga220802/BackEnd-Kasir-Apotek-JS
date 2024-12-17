# Backend Kasir Apotek

## Deskripsi
Backend ini adalah bagian dari sistem kasir apotek yang bertanggung jawab untuk mengelola autentikasi pengguna dan menyediakan API endpoint untuk operasi yang terkait dengan pengguna dan akses ke sistem. Sistem ini dibangun menggunakan Node.js dengan framework Express dan menggunakan JWT (JSON Web Token) untuk autentikasi.

## Teknologi yang Digunakan
- **Node.js**: Platform untuk membangun backend
- **Express.js**: Framework untuk pengembangan API
- **Sequelize**: ORM untuk manajemen database
- **PostgreSQL**: Database yang digunakan
- **bcrypt**: Untuk hashing dan verifikasi password
- **jsonwebtoken**: Untuk manajemen token JWT

## Fitur Utama
1. **Autentikasi Pengguna**:
   - Login pengguna dengan validasi password menggunakan bcrypt
   - Pembuatan token JWT dengan informasi pengguna
   - Validasi peran pengguna untuk role-based navigation di frontend

---

## Panduan Penggunaan

### Endpoint Login

#### URL: [https://back-end-kasir-apotek.vercel.app/](https://back-end-kasir-apotek.vercel.app/)
```
POST /auth/login
```

#### Header:
```json
{
  "Content-Type": "application/json"
}
```

#### Body:
Kirimkan data JSON dengan struktur berikut:
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### Response Sukses:
```json
{
  "message": "Login berhasil",
  "token": "<JWT_TOKEN>",
  "user": {
    "fullName": "Nama Pengguna",
    "roleID": "<ROLE_ID>"
  }
}
```

**Penjelasan Response:**
- `message`: Informasi keberhasilan login
- `token`: JWT token untuk autentikasi
- `user`: Informasi pengguna, termasuk:
  - `fullName`: Nama lengkap pengguna
  - `roleID`: ID peran pengguna untuk navigasi berbasis peran di frontend
