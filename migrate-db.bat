@echo off
echo ===================================================
echo Memulai Ekspor Database Lokal ke Server
echo ===================================================
echo.
echo [1/3] Mengekspor data dari database lokal (porto_db)...
mysqldump -u root porto_db > porto_db_backup.sql
if %errorlevel% neq 0 (
    echo Gagal mengekspor database. Pastikan MySQL menyala dan mysqldump bisa diakses.
    echo Jika Anda pakai XAMPP, jalankan script ini di dalam C:\xampp\mysql\bin
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Mengirim file backup ke server (Password: shn1234)
scp porto_db_backup.sql root@192.168.50.52:/root/
if %errorlevel% neq 0 (
    echo Gagal mengirim file.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Memasukkan data ke MySQL Server (Password: shn1234)
ssh root@192.168.50.52 "mysql -u root -e 'CREATE DATABASE IF NOT EXISTS porto_db;' && mysql -u root porto_db < /root/porto_db_backup.sql && echo 'DATABASE BERHASIL DIMIGRASIKAN!'"

echo.
echo ===================================================
echo Selesai! Semua data portofolio, jurnal, dan tautan sudah pindah ke server.
echo ===================================================
pause
