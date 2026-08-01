# Git Gud

Aplikasi mobile referensi cepat (*cheat sheet*) perintah Git berbahasa
Indonesia. Perintah dikelompokkan per kategori, dapat dicari, dan dapat disalin
langsung ke papan klip.

**Pemegang Hak Cipta:** Universitas Insan Mahardika
**Identitas aplikasi (Android):** `ac.id.mahardika.gitgud`
**Versi:** 1.0.0

> **Cara pemakaian aplikasi ada di [PANDUAN.md](PANDUAN.md)** — mencakup
> penjelasan tiap layar, cara mencari dan menyalin perintah, daftar lengkap
> 33 perintah, serta pemecahan masalah.

## Fitur

### Basis data perintah

- **33 perintah Git** dalam **enam kategori**: inisialisasi & konfigurasi,
  *staging* & *commit*, *branch* & penggabungan, remote & sinkronisasi, riwayat
  & pembatalan, serta *stash* & inspeksi.
- Setiap perintah memiliki deskripsi singkat **dan** catatan penggunaan berisi
  tips praktis, peringatan, atau variasi perintah.

### Pencarian dan penyaringan

- Pencarian langsung yang menyaring **perintah maupun deskripsinya** sambil
  mengetik — mencari kata Indonesia seperti `hapus` atau `batal` tetap
  menemukan perintah yang relevan.
- Riwayat enam kata kunci terakhir sebagai *chip*, dapat diketuk untuk
  mengulang, dihapus satu per satu, atau dikosongkan sekaligus.
- Saringan kategori berbentuk *chip* yang dapat digulir mendatar, masing-masing
  dengan warna penanda sendiri; dapat digabungkan dengan kata kunci pencarian.
- Penghitung hasil (`8 dari 33 perintah`) dan kondisi kosong yang menyediakan
  tombol **Bersihkan saringan**.

### Daftar dan detail

- Daftar bersekat (`SectionList`) dengan judul kategori yang **menempel saat
  digulir**, lengkap dengan jumlah perintah per kategori.
- Kartu perintah bergaris warna kategori di sisi kiri.
- Lembar detail (*bottom sheet*) beranimasi untuk setiap perintah: lencana
  kategori, blok perintah yang dapat diseleksi, deskripsi, dan catatan.
- Posisi gulir daftar otomatis kembali ke atas setiap kali saringan berubah.

### Menyalin ke papan klip

- **Satu ketuk** lewat tombol **Salin** pada kartu.
- **Tekan lama** pada kartu perintah.
- Tombol **Salin perintah** di dalam lembar detail.
- Notifikasi melayang beranimasi sebagai umpan balik, lengkap dengan penanganan
  kegagalan penyalinan.

### Tab Panduan

- Alur kerja Git harian dalam **lima langkah berurutan**; perintah pada tiap
  langkah dapat langsung disalin dengan satu ketukan.
- Empat kartu tips singkat: menelusuri posisi di repository, membatalkan
  perubahan dengan aman, merapikan branch lama, dan menghindari berkas rahasia
  ikut ter-*commit*.

### Antarmuka

- Mode gelap berlapis dengan aksen warna resmi kampus.
- Seluruh data perintah tertanam di dalam aplikasi — berjalan luring dan tidak
  mengirim data ke mana pun.
- Menghormati *inset* aman perangkat berponi dan bernavigasi gestur.

## Perbaikan pada Revisi Ini

Revisi ini merombak seluruh antarmuka dan memperbaiki fungsi yang sebelumnya
belum berjalan sebagaimana didokumentasikan.

### Fungsi yang diperbaiki

| Masalah | Perbaikan |
| --- | --- |
| Judul kategori tidak menempel saat digulir — `stickySectionHeadersEnabled` tidak pernah diaktifkan, dan nilai bawaannya pada Android adalah nonaktif. | Sifat menempel diaktifkan dan diverifikasi pada emulator Android. |
| Salin satu ketuk tidak tersedia; satu ketukan justru membuka jendela detail, sementara penyalinan hanya bisa lewat tekan lama. | Ditambahkan tombol **Salin** tersendiri pada setiap kartu. Tekan lama tetap berfungsi. |
| `setTimeout` notifikasi tidak pernah dibersihkan, sehingga penyalinan beruntun memotong durasi notifikasi dan state berpotensi diperbarui setelah komponen dilepas. | Timer disimpan pada `ref`, dibatalkan saat penyalinan baru, dan dibersihkan saat komponen dilepas. |
| Tampilan kedua memakai `View` biasa sehingga isinya terpotong dan tidak dapat digulir. | Diganti `ScrollView` dan diisi ulang menjadi tab **Panduan**. |
| Posisi gulir daftar tidak kembali ke atas saat kategori atau kata kunci berubah, sehingga hasil saringan terbuka di tengah daftar. | Daftar digulirkan ulang ke posisi teratas setiap kali saringan berubah. |
| `SafeAreaView` bawaan React Native sudah *deprecated* dan memunculkan peringatan runtime, serta tidak menangani *inset* bawah. | Diganti `react-native-safe-area-context`; log JavaScript kini bersih tanpa peringatan. |
| Saat papan ketik terbuka, ketukan pertama pada daftar hanya menutup papan ketik alih-alih menjalankan aksinya — nilai bawaan `keyboardShouldPersistTaps` adalah `never`. | Disetel ke `handled` pada daftar perintah dan baris kategori. |
| `expo-status-bar` terpasang sebagai dependensi tetapi tidak pernah dipakai. | Kini dipakai untuk mengatur gaya bilah status. |
| Kegagalan penyalinan tidak tertangani sama sekali. | `Clipboard.setStringAsync` dibungkus penanganan galat dengan notifikasi bernada peringatan. |

### Penambahan

- Basis data diperluas dari 24 menjadi **33 perintah**, dengan kategori baru
  *Stash & Inspeksi* serta tambahan `git diff`, `git stash`, `git stash pop`,
  `git blame`, `git clean -fd`, `git restore --staged`, `git switch`,
  `git config --list`, `git remote -v`, dan `git show`.
- Setiap perintah memperoleh **catatan penggunaan** yang tampil di lembar
  detail.
- `git checkout` diganti `git switch` sesuai perintah Git modern untuk
  berpindah branch.
- Penghitung hasil pencarian, kondisi kosong dengan tombol pembersih saringan,
  serta *chip* **Semua** untuk melepas saringan kategori.

### Perombakan antarmuka

- Spanduk "SYSTEM BOOTING / HACKER SHELL" diganti kepala aplikasi berisi logo,
  judul, dan penghitung jumlah perintah.
- Dua tombol pil diganti *segmented control*.
- Warna program studi kini berfungsi sebagai **penanda kategori** — muncul pada
  *chip*, titik judul seksi, garis kartu, dan lencana lembar detail — bukan
  sekadar hiasan.
- Jendela detail bergaya kotak dialog diganti *bottom sheet* beranimasi.
- Notifikasi penyalinan diberi animasi masuk dan keluar.

## Teknologi

- React Native 0.85 dengan Expo SDK 56
- `expo-clipboard` untuk operasi papan klip
- `expo-status-bar` untuk gaya bilah status
- `react-native-safe-area-context` untuk *inset* aman di perangkat berponi dan
  bernavigasi gestur
- Antarmuka dibangun murni dengan `StyleSheet`, `Animated`, dan komponen bawaan
  React Native — tanpa pustaka UI, ikon, atau navigasi tambahan

## Desain

Palet aplikasi mengikuti warna resmi Universitas Insan Mahardika. Kuning emas
Program Studi Informatika (`#F0B90B`) dipakai sebagai warna utama, sementara
warna program studi lain menjadi penanda tiap kategori perintah. Latar gelap
berlapis (`#08080C` → `#111119` → `#17171F`) memisahkan permukaan, dan teks
perintah memakai font monospace bawaan sistem (Menlo di iOS, monospace di
Android).

## Menjalankan Proyek

```bash
npm install          # pasang dependensi
npm start            # jalankan Metro bundler (Expo)
npm run android      # bangun & jalankan di perangkat/emulator Android
```

## Struktur

| Berkas | Keterangan |
| --- | --- |
| `App.js` | Token desain, data perintah Git, logika pencarian, antarmuka, dan gaya |
| `index.js` | Titik masuk aplikasi (`registerRootComponent`) |
| `app.json` | Konfigurasi Expo: nama, ikon, splash, paket Android |
| `assets/` | Ikon aplikasi dan gambar splash |
| `PANDUAN.md` | Panduan pengguna aplikasi |
| `README.md` | Dokumentasi proyek (berkas ini) |
| `LICENSE` | Ketentuan hak cipta |

## Lisensi

Hak Cipta © 2026 Universitas Insan Mahardika. Seluruh hak dilindungi
undang-undang. Lihat berkas [LICENSE](LICENSE).
