# Panduan Pengguna — Git Gud

Panduan lengkap cara memakai aplikasi **Git Gud**, referensi cepat (*cheat
sheet*) perintah Git berbahasa Indonesia.

> Dokumen ini untuk pengguna aplikasi. Untuk informasi teknis proyek, lihat
> [README.md](README.md).

---

## Daftar Isi

1. [Sekilas Aplikasi](#1-sekilas-aplikasi)
2. [Memasang dan Menjalankan](#2-memasang-dan-menjalankan)
3. [Mengenal Layar Utama](#3-mengenal-layar-utama)
4. [Tab Perintah](#4-tab-perintah)
5. [Menyalin Perintah](#5-menyalin-perintah)
6. [Lembar Detail Perintah](#6-lembar-detail-perintah)
7. [Tab Panduan](#7-tab-panduan)
8. [Membaca Notasi Perintah](#8-membaca-notasi-perintah)
9. [Skenario Pemakaian](#9-skenario-pemakaian)
10. [Daftar Lengkap Perintah](#10-daftar-lengkap-perintah)
11. [Perintah yang Perlu Kehati-hatian](#11-perintah-yang-perlu-kehati-hatian)
12. [Pemecahan Masalah](#12-pemecahan-masalah)

---

## 1. Sekilas Aplikasi

Git Gud memuat **33 perintah Git** yang paling sering dipakai, dikelompokkan ke
dalam **enam kategori**. Setiap perintah dilengkapi deskripsi singkat dan
catatan penggunaan, serta dapat disalin ke papan klip hanya dengan satu ketukan
supaya bisa langsung ditempel ke terminal.

Seluruh data perintah tertanam di dalam aplikasi, sehingga Git Gud berjalan
sepenuhnya luring (*offline*): tidak membutuhkan koneksi internet dan tidak
mengirim data ke mana pun.

---

## 2. Memasang dan Menjalankan

### Bagi pengguna

Pasang berkas APK Git Gud pada perangkat Android, lalu buka aplikasinya. Tidak
diperlukan pendaftaran akun, dan aplikasi tidak meminta izin apa pun saat
dijalankan.

### Bagi pengembang

```bash
npm install          # pasang dependensi
npm run android      # bangun & jalankan di perangkat/emulator Android
```

Perangkat minimum: Android 7.0 (API 24).

---

## 3. Mengenal Layar Utama

Bagian atas layar selalu tampil, apa pun tab yang sedang aktif:

| Elemen | Keterangan |
| --- | --- |
| Logo `$_` | Penanda aplikasi. |
| **Git Gud** | Nama aplikasi dan subjudul "Cheat sheet perintah Git". |
| **33 PERINTAH** | Jumlah total perintah di dalam basis data aplikasi. |
| **Perintah** / **Panduan** | Sakelar dua tab, penjelasannya di bagian 4 dan 7. |

Aplikasi hanya memiliki mode gelap dan selalu tampil dalam orientasi tegak
(*portrait*).

---

## 4. Tab Perintah

Tab bawaan saat aplikasi dibuka. Isinya daftar seluruh perintah Git.

### 4.1 Mencari perintah

Ketuk kolom bertanda `›` di bawah sakelar tab, lalu ketik kata kunci. Daftar
menyaring **sambil Anda mengetik** — tidak perlu menekan tombol cari.

Pencarian memeriksa **dua hal sekaligus**:

- teks perintahnya, misalnya `branch`, `push`, `--amend`;
- teks deskripsinya, misalnya `hapus`, `staging`, `remote`.

Artinya, mengetik `batal` akan memunculkan `git reset` dan `git revert`
meskipun kata "batal" tidak ada pada perintahnya.

Tepat di bawah baris saringan muncul penghitung seperti `8 dari 33 perintah`
supaya Anda tahu seberapa sempit hasil penyaringan.

Untuk mengosongkan pencarian, ketuk tombol **✕** di ujung kanan kolom.

### 4.2 Riwayat pencarian

Setiap kali Anda menekan tombol **cari** pada papan ketik, kata kunci tersebut
disimpan. Enam kata kunci terakhir tampil sebagai *chip* di bawah kolom
pencarian dengan judul **PENCARIAN TERAKHIR**.

- Ketuk *chip*-nya untuk mengulang pencarian itu.
- Ketuk tanda **✕** pada *chip* untuk menghapus satu riwayat.
- Ketuk **Hapus semua** untuk mengosongkan seluruh riwayat.

Riwayat hanya muncul ketika kolom pencarian sedang kosong, agar tidak menutupi
hasil pencarian yang sedang berjalan.

> **Catatan:** riwayat pencarian disimpan selama aplikasi terbuka dan akan
> hilang bila aplikasi ditutup sepenuhnya.

### 4.3 Menyaring per kategori

Baris *chip* di bawah kolom pencarian dapat digulir ke samping. Isinya:

| Chip | Kategori |
| --- | --- |
| **Semua** | Tanpa saringan — menampilkan seluruh kategori. |
| ⚙️ **Inisialisasi** | Inisialisasi & Konfigurasi |
| 📝 **Commit** | Staging & Commit |
| 🌿 **Branch** | Branch & Penggabungan |
| 🌐 **Remote** | Remote & Sinkronisasi |
| ⏳ **Riwayat** | Riwayat & Pembatalan |
| 📦 **Stash** | Stash & Inspeksi |

Ketuk sebuah kategori untuk menyaring, ketuk sekali lagi (atau ketuk **Semua**)
untuk melepas saringan. *Chip* yang aktif berubah warna sesuai warna
kategorinya.

### 4.4 Menggabungkan pencarian dan kategori

Kedua saringan bekerja bersamaan. Contohnya, memilih kategori **Branch** lalu
mengetik `hapus` akan menyisakan `git branch -d [nama_branch]` saja.

Bila tidak ada perintah yang cocok, layar menampilkan pesan **"Perintah tidak
ditemukan"** beserta tombol **Bersihkan saringan** yang sekaligus mengosongkan
kata kunci dan kategori.

### 4.5 Membaca daftar

- Judul kategori — misalnya **BRANCH & PENGGABUNGAN** — **menempel di atas
  layar** selama Anda menggulir kategori tersebut, jadi Anda selalu tahu sedang
  berada di kelompok mana.
- Angka di sisi kanan judul menunjukkan jumlah perintah pada kategori itu
  (mengikuti hasil penyaringan yang sedang aktif).
- Setiap kartu punya garis warna tipis di sisi kiri sesuai warna kategorinya.
- Setiap kali Anda mengubah kata kunci atau kategori, daftar otomatis kembali ke
  posisi paling atas.

---

## 5. Menyalin Perintah

Tersedia tiga cara, semuanya menyalin ke papan klip perangkat:

1. **Tombol Salin** pada kartu perintah — cara tercepat, satu ketukan.
2. **Tekan lama** pada kartu perintah — untuk yang terbiasa dengan gestur ini.
3. **Tombol "Salin perintah"** di dalam lembar detail (lihat bagian 6).

Setiap penyalinan berhasil ditandai notifikasi melayang berwarna hijau di bagian
bawah layar, misalnya `✓ Disalin: git switch -c fitur/login`. Notifikasi hilang
sendiri setelah sekitar dua detik.

Setelah tersalin, buka terminal Anda dan tempel dengan cara biasa
(`Ctrl+V`, `Cmd+V`, atau tekan lama lalu pilih *Tempel*).

---

## 6. Lembar Detail Perintah

Ketuk **badan kartu** — bukan tombol Salin — untuk membuka lembar detail yang
muncul dari bawah layar. Isinya:

| Bagian | Keterangan |
| --- | --- |
| Lencana kategori | Kategori asal perintah, berwarna sesuai kategorinya. |
| Blok `$` | Perintah lengkap dalam huruf monospace; teksnya dapat diseleksi. |
| Deskripsi | Penjelasan singkat fungsi perintah. |
| **CATATAN** | Tips praktis, peringatan, atau variasi perintah yang berguna. |
| **Tutup** / **Salin perintah** | Menutup lembar, atau menyalin lalu menutupnya. |

Lembar detail juga bisa ditutup dengan mengetuk area gelap di luarnya atau
menekan tombol *kembali* perangkat.

---

## 7. Tab Panduan

Ketuk **Panduan** pada sakelar tab di bagian atas. Isinya dua bagian:

### Alur kerja harian

Lima langkah berurutan yang menutup hampir seluruh pekerjaan Git sehari-hari:

| Langkah | Inti | Perintah |
| --- | --- | --- |
| 01 | Mulai dari kondisi terbaru | `git pull` |
| 02 | Kerjakan di branch sendiri | `git switch -c fitur/login` |
| 03 | Periksa sebelum menyimpan | `git status` |
| 04 | Simpan dengan pesan jelas | `git commit -m "tambah halaman login"` |
| 05 | Kirim dan ajukan review | `git push -u origin fitur/login` |

Kotak perintah pada setiap langkah dapat **diketuk untuk langsung disalin**,
sama seperti kartu di tab Perintah.

### Tips singkat

Empat kartu berisi saran praktis: cara mengetahui posisi Anda di dalam
repository, cara membatalkan perubahan dengan aman, merapikan branch lama, dan
menghindari berkas rahasia ikut ter-*commit*.

---

## 8. Membaca Notasi Perintah

Teks di dalam kurung siku adalah **isian yang harus Anda ganti**, termasuk
kurung sikunya.

| Notasi | Ganti dengan | Contoh hasil |
| --- | --- | --- |
| `[url]` | Alamat repository | `git clone https://github.com/user/repo.git` |
| `[nama_file]` | Nama berkas | `git add App.js` |
| `[nama_branch]` | Nama branch | `git switch -c fitur/login` |
| `[hash_commit]` | Kode commit (7 karakter pertama sudah cukup) | `git show 443e86d` |

Teks di dalam tanda kutip — seperti `"Pesan commit"` atau `"Nama Anda"` —
juga perlu diganti, **tetapi tanda kutipnya tetap dipertahankan**.

---

## 9. Skenario Pemakaian

### Baru mulai dan belum tahu harus mengetik apa

Buka tab **Panduan**, ikuti langkah 01 sampai 05 secara berurutan. Salin
perintah tiap langkah dan sesuaikan nama branch atau pesan commit-nya.

### Sudah tahu perintahnya, hanya lupa penulisannya

Buka tab **Perintah**, ketik sebagian namanya di kolom pencarian (misalnya
`stash`), lalu ketuk **Salin** pada kartu yang cocok.

### Tahu maksudnya, tidak tahu nama perintahnya

Cari memakai kata Indonesia yang menggambarkan tujuannya — `hapus`, `batal`,
`gabung`, `simpan sementara` — karena pencarian juga memeriksa deskripsi.

### Ingin memahami sebuah perintah sebelum memakainya

Ketuk badan kartunya untuk membuka lembar detail, lalu baca bagian
**CATATAN**. Bagian ini menjelaskan kapan perintah aman dipakai dan apa
konsekuensinya.

---

## 10. Daftar Lengkap Perintah

### ⚙️ Inisialisasi & Konfigurasi

| Perintah | Fungsi |
| --- | --- |
| `git init` | Membuat repository Git lokal baru di folder saat ini. |
| `git clone [url]` | Menyalin repository remote ke komputer lokal. |
| `git config --global user.name "Nama Anda"` | Mengatur nama identitas pengguna. |
| `git config --global user.email "email@anda.com"` | Mengatur email identitas pengguna. |
| `git config --list` | Menampilkan seluruh konfigurasi yang berlaku. |

### 📝 Staging & Commit

| Perintah | Fungsi |
| --- | --- |
| `git status` | Melihat berkas yang diubah, ditambah, atau siap di-commit. |
| `git add [nama_file]` | Memasukkan berkas tertentu ke staging area. |
| `git add .` | Memasukkan semua berkas yang berubah ke staging area. |
| `git restore --staged [nama_file]` | Mengeluarkan berkas dari staging tanpa membatalkan perubahannya. |
| `git commit -m "Pesan commit"` | Menyimpan perubahan dari staging ke riwayat Git. |
| `git commit --amend` | Mengubah pesan atau isi commit terakhir. |

### 🌿 Branch & Penggabungan

| Perintah | Fungsi |
| --- | --- |
| `git branch` | Menampilkan daftar branch lokal. |
| `git branch [nama_branch]` | Membuat branch baru. |
| `git switch [nama_branch]` | Berpindah ke branch tujuan. |
| `git switch -c [nama_branch]` | Membuat branch baru sekaligus berpindah ke sana. |
| `git merge [nama_branch]` | Menggabungkan branch terpilih ke branch aktif. |
| `git branch -d [nama_branch]` | Menghapus branch lokal yang sudah tidak dipakai. |

### 🌐 Remote & Sinkronisasi

| Perintah | Fungsi |
| --- | --- |
| `git remote add origin [url]` | Menghubungkan repository lokal ke remote server. |
| `git remote -v` | Menampilkan alamat remote yang terhubung. |
| `git push -u origin [nama_branch]` | Mengirim commit sekaligus mengatur upstream branch. |
| `git push` | Mengirim commit ke remote branch yang sudah terhubung. |
| `git pull` | Mengambil sekaligus menggabungkan perubahan terbaru dari remote. |
| `git fetch` | Mengambil riwayat terbaru tanpa merge otomatis. |

### ⏳ Riwayat & Pembatalan

| Perintah | Fungsi |
| --- | --- |
| `git log --oneline` | Menampilkan riwayat commit secara ringkas. |
| `git show [hash_commit]` | Menampilkan detail perubahan sebuah commit. |
| `git reset --soft HEAD~1` | Membatalkan commit terakhir, berkas tetap di staging. |
| `git reset --hard HEAD~1` | Membatalkan commit beserta seluruh perubahan berkasnya. |
| `git revert [hash_commit]` | Membuat commit baru yang membalikkan commit tertentu. |

### 📦 Stash & Inspeksi

| Perintah | Fungsi |
| --- | --- |
| `git diff` | Melihat perubahan yang belum masuk staging, baris per baris. |
| `git stash` | Menyimpan sementara perubahan yang belum selesai. |
| `git stash pop` | Mengembalikan perubahan terakhir yang disimpan. |
| `git blame [nama_file]` | Menampilkan pengubah terakhir setiap baris berkas. |
| `git clean -fd` | Menghapus berkas dan folder baru yang belum dilacak Git. |

---

## 11. Perintah yang Perlu Kehati-hatian

Tiga perintah berikut dapat menghilangkan pekerjaan secara permanen. Baca
**CATATAN** pada lembar detailnya sebelum menjalankan.

| Perintah | Risiko | Alternatif lebih aman |
| --- | --- | --- |
| `git reset --hard HEAD~1` | Menghapus commit **dan** seluruh perubahan berkas yang belum tersimpan. | `git reset --soft HEAD~1` bila hanya ingin memperbaiki commit. |
| `git clean -fd` | Menghapus berkas dan folder baru yang belum pernah dilacak Git. | Jalankan `git clean -nd` dulu untuk melihat daftar yang akan dihapus. |
| `git commit --amend` | Menulis ulang riwayat; berbahaya bila commit sudah di-push. | `git revert` untuk commit yang sudah berada di remote. |

---

## 12. Pemecahan Masalah

**Daftar terlihat kosong padahal belum mencari apa pun.**
Kemungkinan sebuah kategori masih aktif dari pencarian sebelumnya. Ketuk *chip*
**Semua** atau tombol **Bersihkan saringan**.

**Perintah tidak ketemu walau yakin ada.**
Coba kata kunci yang lebih pendek. Pencarian mencocokkan potongan kata, jadi
`comm` akan menemukan `git commit`, sementara salah ketik satu huruf akan
membuat hasilnya kosong.

**Menekan tombol Salin tetapi tidak ada yang tertempel.**
Pastikan notifikasi hijau `✓ Disalin: …` sempat muncul. Bila muncul, isinya
sudah berada di papan klip perangkat — periksa aplikasi tujuan tempel Anda.

**Riwayat pencarian hilang.**
Riwayat memang hanya bertahan selama aplikasi masih berjalan dan akan kosong
kembali setelah aplikasi ditutup penuh.

**Perintah tersalin tetapi ditolak terminal.**
Periksa apakah masih ada bagian `[...]` yang belum diganti dengan nilai
sebenarnya. Lihat [bagian 8](#8-membaca-notasi-perintah).

---

Hak Cipta © 2026 Universitas Insan Mahardika. Lihat berkas [LICENSE](LICENSE).
