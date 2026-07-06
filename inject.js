const { db } = require("./config/firebaseConfig");
const { collection, doc, setDoc } = require("firebase/firestore");

const dataPasien = [
  { no_registrasi: "REG202607001", norm: "00000001", nama_pasien: "Ahmad Fauzi", tanggal: "2026-07-01 08:10:00", ruangan: "Poli Penyakit Dalam", dokter: "dr. Andi Pratama, Sp.PD", cara_bayar: "BPJS", status: "SELESAI" },
  { no_registrasi: "REG202607002", norm: "00000002", nama_pasien: "Siti Aminah", tanggal: "2026-07-01 08:20:00", ruangan: "Poli Bedah Onkologi", dokter: "dr. Rina Kusuma, Sp.B.Onk", cara_bayar: "BPJS", status: "SELESAI" },
  { no_registrasi: "REG202607003", norm: "00000003", nama_pasien: "Budi Santoso", tanggal: "2026-07-01 09:05:00", ruangan: "Poli Radioterapi", dokter: "dr. Bagus Hidayat, Sp.Onk.Rad", cara_bayar: "UMUM", status: "DILAYANI" },
  { no_registrasi: "REG202607004", norm: "00000004", nama_pasien: "Maya Lestari", tanggal: "2026-07-02 10:15:00", ruangan: "Instalasi Gawat Darurat", dokter: "dr. Clara Wibowo", cara_bayar: "UMUM", status: "SELESAI" },
  { no_registrasi: "REG202607005", norm: "00000005", nama_pasien: "Rizal Maulana", tanggal: "2026-07-02 11:30:00", ruangan: "Poli Penyakit Dalam", dokter: "dr. Dimas Arya, Sp.PD-KHOM", cara_bayar: "ASURANSI", status: "BATAL" },
  { no_registrasi: "REG202607006", norm: "00000006", nama_pasien: "Herlina Putri", tanggal: "2026-07-03 08:45:00", ruangan: "Poli Bedah Onkologi", dokter: "dr. Rina Kusuma, Sp.B.Onk", cara_bayar: "BPJS", status: "SELESAI" },
  { no_registrasi: "REG202607007", norm: "00000007", nama_pasien: "Joko Prasetyo", tanggal: "2026-07-03 09:30:00", ruangan: "Poli Penyakit Dalam", dokter: "dr. Andi Pratama, Sp.PD", cara_bayar: "BPJS", status: "DAFTAR" },
  { no_registrasi: "REG202607008", norm: "00000008", nama_pasien: "Dewi Anggraini", tanggal: "2026-07-04 10:00:00", ruangan: "Poli Radioterapi", dokter: "dr. Bagus Hidayat, Sp.Onk.Rad", cara_bayar: "UMUM", status: "DILAYANI" },
  { no_registrasi: "REG202607009", norm: "00000009", nama_pasien: "Fajar Ramadhan", tanggal: "2026-07-04 13:20:00", ruangan: "Instalasi Gawat Darurat", dokter: "dr. Clara Wibowo", cara_bayar: "BPJS", status: "SELESAI" },
  { no_registrasi: "REG202607010", norm: "00000010", nama_pasien: "Nur Aisyah", tanggal: "2026-07-05 08:00:00", ruangan: "Poli Bedah Onkologi", dokter: "dr. Rina Kusuma, Sp.B.Onk", cara_bayar: "BPJS", status: "SELESAI" },
  { no_registrasi: "REG202607011", norm: "00000011", nama_pasien: "Hendra Wijaya", tanggal: "2026-07-05 09:10:00", ruangan: "Poli Penyakit Dalam", dokter: "dr. Dimas Arya, Sp.PD-KHOM", cara_bayar: "UMUM", status: "SELESAI" },
  { no_registrasi: "REG202607012", norm: "00000012", nama_pasien: "Lina Marlina", tanggal: "2026-07-06 08:25:00", ruangan: "Poli Radioterapi", dokter: "dr. Bagus Hidayat, Sp.Onk.Rad", cara_bayar: "ASURANSI", status: "DAFTAR" },
  { no_registrasi: "REG202607013", norm: "00000001", nama_pasien: "Ahmad Fauzi", tanggal: "2026-07-06 10:05:00", ruangan: "Laboratorium", dokter: "-", cara_bayar: "BPJS", status: "SELESAI" },
  { no_registrasi: "REG202607014", norm: "00000002", nama_pasien: "Siti Aminah", tanggal: "2026-07-06 10:30:00", ruangan: "Farmasi", dokter: "-", cara_bayar: "BPJS", status: "DILAYANI" }
];

async function injectData() {
  try {
    console.log("Memulai injeksi data yang bersih...");
    
    for (const pasien of dataPasien) {
      // Menggunakan no_registrasi sebagai ID dokumen (biar unik!)
      const docRef = doc(db, "kunjungan_pasien", pasien.no_registrasi);
      await setDoc(docRef, pasien); 
      console.log(`Berhasil sync: ${pasien.nama_pasien}`);
    }
    
    console.log("Selesai! Semua data sudah bersih.");
  } catch (error) {
    console.error("Error:", error);
  }
}
injectData();