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

## Dokumentasi
Untuk panduan penggunaan dan dokumentasi lengkap, silakan kunjungi [Dokumentasi Backend](https://backend.tb-adbo-kel6.my.id/).
