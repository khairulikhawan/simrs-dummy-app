# Aplikasi Dashboard SIMRS Dummy

Aplikasi Dashboard Sistem Informasi Manajemen Rumah Sakit (SIMRS) berbasis web yang dibuat menggunakan Node.js (Express), MySQL, dan Bootstrap 5.

## Fitur Utama
- **Statistik Dashboard Live:** Menampilkan ringkasan total pasien, jumlah pasien BPJS/UMUM, dan pasien yang sedang dilayani secara langsung dari database.
- **Auto-Filter Ruangan:** Menyaring daftar pasien secara instan (Auto-submit) saat memilih opsi ruangan (IGD, Laboratorium, Poli, dll).
- **Pencarian Pasien:** Fitur pencarian dinamis berdasarkan nama pasien, no. rekam medis, atau no. registrasi.
- **Detail Klinis Pasien (Modal Pop-up):** Menampilkan detail diagnosa (ICD-10), tindakan medis, dan resep obat menggunakan AJAX Fetching tanpa reload halaman.

## Cara Menjalankan Proyek Secara Lokal

1. **Clone Repositori ini:**
   ```bash
  git clone (https://github.com/khairulikhwan/simrs-dummy-app.git)