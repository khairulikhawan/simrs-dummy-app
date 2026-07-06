const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

// Set View Engine ke EJS
app.set('view engine', 'ejs');

// Middleware untuk handle form input & statis
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route Halaman Utama (Dashboard + Statistik + Filter)
app.get('/', async (req, res) => {
    try {
        const { search, ruangan } = req.query;
        
        // 1. Ambil Data Kunjungan Pasien dengan Filter jika ada
        let queryStr = 'SELECT * FROM v_kunjungan_pasien';
        let queryParams = [];
        let conditions = [];

        if (search) {
            conditions.push('nama_pasien LIKE ? OR no_registrasi LIKE ? OR norm LIKE ?');
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        if (ruangan) {
            conditions.push('nama_ruangan = ?');
            queryParams.push(ruangan);
        }

        if (conditions.length > 0) {
            queryStr += ' WHERE ' + conditions.join(' AND ');
        }
        queryStr += ' ORDER BY tanggal_registrasi DESC';

        const [rows] = await db.query(queryStr, queryParams);

        // 2. Ambil List Ruangan untuk Dropdown Filter
        const [ruanganList] = await db.query('SELECT DISTINCT nama_ruangan FROM v_kunjungan_pasien');

        // 3. Hitung Statistik untuk Card di Atas
        const [statTotal] = await db.query('SELECT COUNT(*) as total FROM registrasi');
        const [statBpjs] = await db.query("SELECT COUNT(*) as total FROM registrasi WHERE cara_bayar = 'BPJS'");
        const [statUmum] = await db.query("SELECT COUNT(*) as total FROM registrasi WHERE cara_bayar = 'UMUM'");
        const [statDilayani] = await db.query("SELECT COUNT(*) as total FROM registrasi WHERE status_kunjungan = 'DILAYANI'");

        // Kirim semua data ke EJS
        res.render('index', { 
            kunjungan: rows,
            ruanganList: ruanganList,
            stats: {
                total: statTotal[0].total,
                bpjs: statBpjs[0].total,
                umum: statUmum[0].total,
                dilayani: statDilayani[0].total
            },
            query: req.query
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal memuat database.");
    }
});

// Route API untuk mengambil Detail Pasien (Diagnosa, Tindakan, Resep) via AJAX
app.get('/detail/:no_registrasi', async (req, res) => {
    try {
        const noReg = req.params.no_registrasi;

        // Ambil data Diagnosa
        const [diagnosa] = await db.query('SELECT * FROM  diagnosa WHERE no_registrasi = ?', [noReg]);
        // Ambil data Tindakan
        const [tindakan] = await db.query('SELECT * FROM tindakan WHERE no_registrasi = ?', [noReg]);
        // Ambil data Resep & Detailnya
        const [resep] = await db.query(`
            SELECT r.no_resep, rd.nama_obat, rd.qty, rd.aturan_pakai, r.status_resep 
            FROM resep r 
            JOIN resep_detail rd ON r.no_resep = rd.no_resep 
            WHERE r.no_registrasi = ?`, [noReg]);

        res.json({ diagnosa, tindakan, resep });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengambil detail data pasien" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server SIMRS jalan di http://localhost:${PORT}`);
});