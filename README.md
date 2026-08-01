# Git Gud

Aplikasi mobile referensi cepat (*cheat sheet*) perintah Git berbahasa
Indonesia. Perintah dikelompokkan per kategori, dapat dicari, dan dapat disalin
langsung ke papan klip.

**Pemegang Hak Cipta:** Universitas Insan Mahardika
**Identitas aplikasi (Android):** `ac.id.mahardika.gitgud`
**Versi:** 1.0.0

## Fitur

- Basis data perintah Git yang dikelompokkan per kategori, antara lain
  inisialisasi & konfigurasi, *staging* & *commit*, percabangan, dan sinkronisasi
  dengan repositori remote.
- Pencarian langsung yang menyaring perintah maupun deskripsinya sambil mengetik.
- Daftar bersekat (`SectionList`) dengan judul kategori yang menempel saat digulir.
- Jendela detail untuk setiap perintah beserta penjelasan penggunaannya.
- Salin perintah ke papan klip satu ketuk.
- Antarmuka mode gelap.

## Teknologi

- React Native 0.85 dengan Expo SDK 56
- `expo-clipboard` untuk operasi papan klip
- Antarmuka dibangun murni dengan `StyleSheet` dan komponen bawaan React Native

## Menjalankan Proyek

```bash
npm install          # pasang dependensi
npm start            # jalankan Metro bundler (Expo)
npm run android      # bangun & jalankan di perangkat/emulator Android
```

## Struktur

| Berkas | Keterangan |
| --- | --- |
| `App.js` | Data perintah Git, logika pencarian, antarmuka, dan gaya |
| `index.js` | Titik masuk aplikasi (`registerRootComponent`) |
| `app.json` | Konfigurasi Expo: nama, ikon, splash, paket Android |
| `assets/` | Ikon aplikasi dan gambar splash |

## Lisensi

Hak Cipta © 2026 Universitas Insan Mahardika. Seluruh hak dilindungi
undang-undang. Lihat berkas [LICENSE](LICENSE).
