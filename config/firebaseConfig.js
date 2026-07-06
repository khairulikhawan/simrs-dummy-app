const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

// Salin konfigurasi kamu dari Screenshot 2026-07-06 225520.png di sini bro
const firebaseConfig = {
  apiKey: "AIzaSyA-oAtgZnS7eoKWuXidTBzOM4JQS6gDWr0",
  authDomain: "simrs-demo-web-app.firebaseapp.com",
  projectId: "simrs-demo-web-app",
  storageBucket: "simrs-demo-web-app.firebasestorage.app",
  messagingSenderId: "837116553089",
  appId: "1:837116553089:web:2b1f2d4c91ee606ef4ea80",
  measurementId: "G-NMK3MYDHES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export db supaya bisa dipakai di file lain
module.exports = { db };