//const db = require('./config/db');
// Panggil Firebase Firestore 
const express = require('express');
const app = express();
const dotenv = require('dotenv');

const { db } = require("./config/firebaseConfig"); 
const { collection, getDocs } = require("firebase/firestore");

dotenv.config();
dotenv.config();

// Set View Engine ke EJS
app.set('view engine', 'ejs');

// Middleware untuk handle form input & statis
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==========================================
// ROUTE HALAMAN UTAMA (DASHBOARD + STATISTIK + FILTER)
// ==========================================
app.get('/', async (req, res) => {
    try {
        const { search, ruangan } = req.query;

        // 1. Ambil semua data kunjungan dari Firebase Cloud
        const colRef = collection(db, "kunjungan_pasien");
        const snapshot = await getDocs(colRef);
        
        // Kita petakan datanya menjadi array objek JavaScript biasa
        let allData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // 2. HITUNG STATISTIK (Untuk Card di atas dashboard)
        // Kita hitung langsung dari data Firebase yang ditarik bro
        const statTotal = allData.length;
        const statBpjs = allData.filter(p => p.cara_bayar === 'BPJS').length;
        const statUmum = allData.filter(p => p.cara_bayar === 'UMUM').length;
        const statDilayani = allData.filter(p => p.status === 'DILAYANI').length;

        // 3. AMBIL LIST RUANGAN (Untuk Dropdown Filter)
        // Mengambil nama ruangan yang unik (tidak duplikat) dari data yang ada
        const semuaRuangan = allData.map(p => p.ruangan).filter(Boolean);
        const ruanganUnik = [...new Set(semuaRuangan)];
        const ruanganList = ruanganUnik.map(nama => ({ nama_ruangan: nama }));

        // 4. PROSES FILTER PENCARIAN & RUANGAN
        let rows = [...allData];

        if (search) {
            const keyword = search.toLowerCase();
            rows = rows.filter(pasien => 
                (pasien.nama_pasien && pasien.nama_pasien.toLowerCase().includes(keyword)) ||
                (pasien.no_registrasi && pasien.no_registrasi.toLowerCase().includes(keyword)) ||
                (pasien.norm && pasien.norm.toLowerCase().includes(keyword))
            );
        }

        if (ruangan) {
            rows = rows.filter(pasien => pasien.ruangan === ruangan);
        }

        // 5. URUTKAN BERDASARKAN TANGGAL TERBARU
        rows.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

        // Kirim semua data ke template EJS kamu bro
        res.render('index', { 
            kunjungan: rows,
            ruanganList: ruanganList,
            stats: {
                total: statTotal,
                bpjs: statBpjs,
                umum: statUmum,
                dilayani: statDilayani
            },
            query: req.query
        });

    } catch (error) {
        console.error("Error di route utama:", error);
        res.status(500).send("Gagal memuat database cloud.");
    }
});

// ==========================================
// ROUTE API DETAIL PASIEN (DIAGNOSA, TINDAKAN, RESEP) VIA AJAX
// ==========================================
app.get('/detail/:no_registrasi', async (req, res) => {
    try {
        const noReg = req.params.no_registrasi;

        // Karena data dummy kita satukan dalam satu dokumen di koleksi 'kunjungan_pasien',
        // Kita cari data pasien yang no_registrasi-nya cocok
        const colRef = collection(db, "kunjungan_pasien");
        const snapshot = await getDocs(colRef);
        
        const semuaPasien = snapshot.docs.map(doc => doc.data());
        const pasienTerpilih = semuaPasien.find(p => p.no_registrasi === noReg);

        // Jika data pasien tidak ditemukan
        if (!pasienTerpilih) {
            return res.json({ diagnosa: [], tindakan: [], resep: [] });
        }

        // Kita kembalikan formatnya dalam bentuk array biar pop-up AJAX di frontend tidak error
        const diagnosa = pasienTerpilih.diagnosa ? [pasienTerpilih.diagnosa] : [];
        const tindakan = pasienTerpilih.tindakan ? [pasienTerpilih.tindakan] : [];
        const resep = pasienTerpilih.resep ? [pasienTerpilih.resep] : [];

        res.json({ diagnosa, tindakan, resep });
    } catch (error) {
        console.error("Error di route detail:", error);
        res.status(500).json({ error: "Gagal mengambil detail data pasien dari cloud" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server SIMRS jalan di http://localhost:${PORT}`);
});