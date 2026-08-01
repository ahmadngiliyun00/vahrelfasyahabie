import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';

/* -------------------------------------------------------------------------- */
/* 1. TOKEN DESAIN                                                            */
/* -------------------------------------------------------------------------- */

// Palet resmi Universitas Insan Mahardika.
// Warna utama aplikasi mengikuti Program Studi Informatika (kuning emas);
// warna program studi lain dipakai sebagai penanda kategori perintah.
const BRAND = {
  informatika: '#F0B90B',
  informatikaTerang: '#FFD75E',
  fmt: '#FB7A1E',
  fkes: '#7ED957',
  psik: '#3D8B11',
  kesmas: '#8B5BD6',
  kebidanan: '#4DA6FF',
  rmik: '#E85555',
  tinta: '#08080C',
  putih: '#FFFFFF',
};

const COLORS = {
  bg: '#08080C',
  surface: '#111119',
  surfaceRaised: '#17171F',
  border: '#242430',
  borderSoft: '#1B1B24',
  text: '#F2F2F7',
  textMuted: '#8C8CA1',
  textFaint: '#5C5C73',
  accent: BRAND.informatika,
  success: BRAND.psik,
  danger: BRAND.rmik,
};

// Font monospace bawaan sistem — tanpa dependensi font tambahan.
const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

/* -------------------------------------------------------------------------- */
/* 2. DATA PERINTAH GIT                                                       */
/* -------------------------------------------------------------------------- */

const CATEGORIES = [
  {
    id: 'init',
    icon: '⚙️',
    label: 'Inisialisasi',
    title: 'Inisialisasi & Konfigurasi',
    color: BRAND.informatika,
  },
  {
    id: 'commit',
    icon: '📝',
    label: 'Commit',
    title: 'Staging & Commit',
    color: BRAND.fmt,
  },
  {
    id: 'branch',
    icon: '🌿',
    label: 'Branch',
    title: 'Branch & Penggabungan',
    color: BRAND.fkes,
  },
  {
    id: 'remote',
    icon: '🌐',
    label: 'Remote',
    title: 'Remote & Sinkronisasi',
    color: BRAND.kebidanan,
  },
  {
    id: 'history',
    icon: '⏳',
    label: 'Riwayat',
    title: 'Riwayat & Pembatalan',
    color: BRAND.rmik,
  },
  {
    id: 'inspect',
    icon: '📦',
    label: 'Stash',
    title: 'Stash & Inspeksi',
    color: BRAND.kesmas,
  },
];

const CATEGORY_BY_ID = CATEGORIES.reduce((acc, category) => {
  acc[category.id] = category;
  return acc;
}, {});

const COMMANDS = [
  // Inisialisasi & konfigurasi
  {
    cat: 'init',
    command: 'git init',
    desc: 'Membuat repository Git lokal baru di dalam folder saat ini.',
    tip: 'Jalankan sekali saja di folder proyek. Git akan membuat folder tersembunyi .git sebagai tempat seluruh riwayat disimpan.',
  },
  {
    cat: 'init',
    command: 'git clone [url]',
    desc: 'Menyalin repository remote dari internet ke komputer lokal.',
    tip: 'Folder baru otomatis dibuat sesuai nama repository, dan remote "origin" langsung terpasang.',
  },
  {
    cat: 'init',
    command: 'git config --global user.name "Nama Anda"',
    desc: 'Mengatur nama identitas pengguna secara global.',
    tip: 'Nama ini yang tercatat pada setiap commit. Hilangkan --global bila ingin memakai identitas berbeda hanya di satu repository.',
  },
  {
    cat: 'init',
    command: 'git config --global user.email "email@anda.com"',
    desc: 'Mengatur email identitas pengguna secara global.',
    tip: 'Gunakan email yang sama dengan akun GitHub/GitLab agar kontribusi Anda terhitung di profil.',
  },
  {
    cat: 'init',
    command: 'git config --list',
    desc: 'Menampilkan seluruh konfigurasi Git yang sedang berlaku.',
    tip: 'Berguna untuk memastikan nama dan email sudah benar sebelum commit pertama.',
  },

  // Staging & commit
  {
    cat: 'commit',
    command: 'git status',
    desc: 'Melihat daftar berkas yang diubah, ditambah, atau siap di-commit.',
    tip: 'Biasakan menjalankan perintah ini sebelum commit untuk memastikan tidak ada berkas yang tertinggal atau ikut terbawa.',
  },
  {
    cat: 'commit',
    command: 'git add [nama_file]',
    desc: 'Memasukkan berkas tertentu ke dalam staging area.',
    tip: 'Staging area adalah ruang tunggu: hanya berkas di dalamnya yang akan ikut pada commit berikutnya.',
  },
  {
    cat: 'commit',
    command: 'git add .',
    desc: 'Memasukkan semua berkas yang berubah ke dalam staging area.',
    tip: 'Praktis, tetapi periksa dulu dengan git status agar berkas rahasia atau sampah build tidak ikut ter-commit.',
  },
  {
    cat: 'commit',
    command: 'git restore --staged [nama_file]',
    desc: 'Mengeluarkan kembali berkas dari staging area tanpa membatalkan perubahannya.',
    tip: 'Pilihan aman ketika salah menjalankan git add — isi berkas tetap utuh.',
  },
  {
    cat: 'commit',
    command: 'git commit -m "Pesan commit"',
    desc: 'Menyimpan perubahan dari staging area ke riwayat Git beserta pesannya.',
    tip: 'Tulis pesan singkat dalam bentuk perintah, misalnya "tambah halaman login", agar riwayat mudah dibaca.',
  },
  {
    cat: 'commit',
    command: 'git commit --amend',
    desc: 'Mengubah pesan atau isi dari commit terakhir.',
    tip: 'Hanya aman selama commit tersebut belum pernah di-push, karena perintah ini menulis ulang riwayat.',
  },

  // Branch & penggabungan
  {
    cat: 'branch',
    command: 'git branch',
    desc: 'Menampilkan daftar branch lokal di dalam repository.',
    tip: 'Branch yang sedang aktif ditandai dengan tanda bintang (*) di depannya.',
  },
  {
    cat: 'branch',
    command: 'git branch [nama_branch]',
    desc: 'Membuat branch baru dengan nama tertentu.',
    tip: 'Branch baru dibuat dari commit tempat Anda berdiri sekarang, dan posisi aktif tidak ikut berpindah.',
  },
  {
    cat: 'branch',
    command: 'git switch [nama_branch]',
    desc: 'Berpindah ke branch yang dituju.',
    tip: 'Perintah modern pengganti git checkout untuk urusan berpindah branch, sehingga niatnya lebih jelas.',
  },
  {
    cat: 'branch',
    command: 'git switch -c [nama_branch]',
    desc: 'Membuat branch baru sekaligus langsung berpindah ke branch tersebut.',
    tip: 'Setara dengan git checkout -b. Pakai ini setiap kali memulai fitur baru.',
  },
  {
    cat: 'branch',
    command: 'git merge [nama_branch]',
    desc: 'Menggabungkan riwayat branch yang dipilih ke branch yang sedang aktif.',
    tip: 'Pastikan Anda sudah berada di branch tujuan penggabungan, misalnya main, sebelum menjalankannya.',
  },
  {
    cat: 'branch',
    command: 'git branch -d [nama_branch]',
    desc: 'Menghapus branch lokal yang sudah tidak digunakan.',
    tip: 'Git menolak menghapus bila branch belum di-merge. Gunakan -D hanya bila Anda yakin ingin membuang pekerjaannya.',
  },

  // Remote & sinkronisasi
  {
    cat: 'remote',
    command: 'git remote add origin [url]',
    desc: 'Menghubungkan repository lokal dengan remote server (GitHub/GitLab).',
    tip: '"origin" hanyalah nama panggilan standar untuk remote utama.',
  },
  {
    cat: 'remote',
    command: 'git remote -v',
    desc: 'Menampilkan alamat remote yang terhubung dengan repository ini.',
    tip: 'Langkah pertama saat push gagal: pastikan alamat remote-nya sudah benar.',
  },
  {
    cat: 'remote',
    command: 'git push -u origin [nama_branch]',
    desc: 'Mengirim commit lokal ke remote sekaligus mengatur upstream branch.',
    tip: 'Cukup sekali per branch. Setelah itu git push dan git pull tanpa argumen sudah tahu tujuannya.',
  },
  {
    cat: 'remote',
    command: 'git push',
    desc: 'Mengirim commit lokal ke remote branch yang sudah terhubung.',
    tip: 'Jika ditolak, berarti ada commit baru di remote — jalankan git pull terlebih dahulu.',
  },
  {
    cat: 'remote',
    command: 'git pull',
    desc: 'Mengambil sekaligus menggabungkan perubahan terbaru dari remote ke lokal.',
    tip: 'Sama dengan git fetch yang langsung diikuti git merge.',
  },
  {
    cat: 'remote',
    command: 'git fetch',
    desc: 'Mengambil riwayat terbaru dari remote tanpa melakukan merge otomatis.',
    tip: 'Pilihan aman bila ingin memeriksa dulu apa yang berubah sebelum menggabungkannya.',
  },

  // Riwayat & pembatalan
  {
    cat: 'history',
    command: 'git log --oneline',
    desc: 'Menampilkan riwayat commit secara ringkas, satu baris per commit.',
    tip: 'Tambahkan --graph --all untuk melihat percabangan branch dalam bentuk diagram.',
  },
  {
    cat: 'history',
    command: 'git show [hash_commit]',
    desc: 'Menampilkan detail dan perubahan berkas dari sebuah commit.',
    tip: 'Hash cukup ditulis 7 karakter pertama, misalnya git show 443e86d.',
  },
  {
    cat: 'history',
    command: 'git reset --soft HEAD~1',
    desc: 'Membatalkan commit terakhir, tetapi berkasnya tetap berada di staging area.',
    tip: 'Cocok saat pesan commit salah atau ada berkas yang lupa disertakan.',
  },
  {
    cat: 'history',
    command: 'git reset --hard HEAD~1',
    desc: 'Membatalkan commit, staging, dan seluruh perubahan berkas terakhir.',
    tip: 'Perintah paling berbahaya di daftar ini — perubahan yang belum di-commit akan hilang permanen.',
  },
  {
    cat: 'history',
    command: 'git revert [hash_commit]',
    desc: 'Membuat commit baru yang membalikkan perubahan dari commit tertentu.',
    tip: 'Cara aman membatalkan sesuatu yang sudah terlanjur di-push, karena riwayat tidak ditulis ulang.',
  },

  // Stash & inspeksi
  {
    cat: 'inspect',
    command: 'git diff',
    desc: 'Melihat perubahan yang belum masuk ke staging area, baris per baris.',
    tip: 'Gunakan git diff --staged untuk memeriksa isi yang sudah siap di-commit.',
  },
  {
    cat: 'inspect',
    command: 'git stash',
    desc: 'Menyimpan sementara perubahan yang belum selesai agar folder kerja kembali bersih.',
    tip: 'Penyelamat saat harus mendadak berpindah branch di tengah pekerjaan.',
  },
  {
    cat: 'inspect',
    command: 'git stash pop',
    desc: 'Mengembalikan perubahan terakhir yang disimpan dan menghapusnya dari daftar stash.',
    tip: 'Pakai git stash list untuk melihat seluruh simpanan yang masih tersedia.',
  },
  {
    cat: 'inspect',
    command: 'git blame [nama_file]',
    desc: 'Menampilkan siapa yang terakhir mengubah setiap baris pada sebuah berkas.',
    tip: 'Berguna untuk menelusuri asal-usul sebuah baris kode, bukan untuk mencari siapa yang salah.',
  },
  {
    cat: 'inspect',
    command: 'git clean -fd',
    desc: 'Menghapus berkas dan folder baru yang belum pernah dilacak Git.',
    tip: 'Coba dulu dengan -n (git clean -nd) untuk melihat daftar yang akan dihapus tanpa benar-benar menghapusnya.',
  },
];

const WORKFLOW = [
  {
    step: '01',
    title: 'Mulai dari kondisi terbaru',
    desc: 'Tarik perubahan rekan tim sebelum menulis kode agar konflik tidak menumpuk.',
    command: 'git pull',
  },
  {
    step: '02',
    title: 'Kerjakan di branch sendiri',
    desc: 'Satu fitur satu branch. Branch main tetap bersih dan selalu siap dijalankan.',
    command: 'git switch -c fitur/login',
  },
  {
    step: '03',
    title: 'Periksa sebelum menyimpan',
    desc: 'Pastikan hanya berkas yang Anda maksud yang ikut masuk ke dalam commit.',
    command: 'git status',
  },
  {
    step: '04',
    title: 'Simpan dengan pesan jelas',
    desc: 'Pesan commit yang deskriptif membuat riwayat proyek bisa dibaca berbulan-bulan kemudian.',
    command: 'git commit -m "tambah halaman login"',
  },
  {
    step: '05',
    title: 'Kirim dan ajukan review',
    desc: 'Push branch Anda, lalu buka pull request agar perubahan bisa ditinjau rekan tim.',
    command: 'git push -u origin fitur/login',
  },
];

const TIPS = [
  {
    icon: '🧭',
    title: 'Tersesat? Lihat peta dulu',
    desc: 'git status dan git log --oneline --graph menjawab hampir semua pertanyaan "saya ada di mana dan apa yang terjadi".',
  },
  {
    icon: '🛟',
    title: 'Batalkan dengan aman',
    desc: 'Gunakan git revert untuk commit yang sudah di-push, dan git reset hanya untuk commit yang masih ada di komputer sendiri.',
  },
  {
    icon: '🧹',
    title: 'Rapikan branch lama',
    desc: 'Hapus branch yang sudah di-merge dengan git branch -d agar daftar branch tetap ringkas dan mudah dibaca.',
  },
  {
    icon: '🚫',
    title: 'Jangan commit rahasia',
    desc: 'Masukkan berkas .env, kunci API, dan folder build ke dalam .gitignore sebelum commit pertama dibuat.',
  },
];

const TOTAL_COMMANDS = COMMANDS.length;

/* -------------------------------------------------------------------------- */
/* 3. KOMPONEN KECIL                                                          */
/* -------------------------------------------------------------------------- */

function SegmentedControl({ value, onChange, options }) {
  return (
    <View style={styles.segment}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [
              styles.segmentItem,
              active && styles.segmentItemActive,
              pressed && !active && styles.pressedSoft,
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function CommandCard({ item, color, onPress, onCopy }) {
  return (
    <View style={styles.cardWrapper}>
      <View style={[styles.cardRail, { backgroundColor: color }]} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Detail perintah ${item.command}`}
        style={({ pressed }) => [styles.card, pressed && styles.pressedSoft]}
        onPress={onPress}
        onLongPress={onCopy}
        delayLongPress={250}
      >
        <Text style={styles.cardCommand} numberOfLines={2}>
          {item.command}
        </Text>
        <Text style={styles.cardDesc}>{item.desc}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardHint}>Ketuk untuk detail</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Salin ${item.command}`}
            hitSlop={8}
            style={({ pressed }) => [styles.copyButton, pressed && styles.copyButtonPressed]}
            onPress={onCopy}
          >
            <Text style={styles.copyButtonText}>Salin</Text>
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
}

function DetailSheet({ visible, item, onClose, onCopy }) {
  const anim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!visible) return;
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, anim]);

  const category = item ? CATEGORY_BY_ID[item.cat] : null;
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.sheetOverlay}>
        <Pressable style={StyleSheet.absoluteFill} accessibilityLabel="Tutup detail" onPress={onClose} />
        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: 24 + insets.bottom, opacity: anim, transform: [{ translateY }] },
          ]}
        >
          <View style={styles.sheetHandle} />
          {item && category ? (
            <>
              <View style={[styles.sheetBadge, { borderColor: category.color }]}>
                <Text style={[styles.sheetBadgeText, { color: category.color }]}>
                  {category.icon}  {category.title}
                </Text>
              </View>

              <View style={styles.sheetCommandBox}>
                <Text style={styles.sheetPrompt}>$</Text>
                <Text style={styles.sheetCommand} selectable>
                  {item.command}
                </Text>
              </View>

              <Text style={styles.sheetDesc}>{item.desc}</Text>

              {item.tip ? (
                <View style={styles.sheetTip}>
                  <Text style={styles.sheetTipLabel}>CATATAN</Text>
                  <Text style={styles.sheetTipText}>{item.tip}</Text>
                </View>
              ) : null}

              <View style={styles.sheetActions}>
                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.sheetGhostButton, pressed && styles.pressedSoft]}
                  onPress={onClose}
                >
                  <Text style={styles.sheetGhostText}>Tutup</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.sheetPrimaryButton, pressed && styles.sheetPrimaryPressed]}
                  onPress={() => onCopy(item.command)}
                >
                  <Text style={styles.sheetPrimaryText}>Salin perintah</Text>
                </Pressable>
              </View>
            </>
          ) : null}
        </Animated.View>
      </View>
    </Modal>
  );
}

function Toast({ anim, message, tone, bottomInset }) {
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const accent = tone === 'error' ? COLORS.danger : COLORS.success;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        {
          bottom: 20 + bottomInset,
          borderColor: accent,
          opacity: anim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={[styles.toastIcon, { color: accent }]}>{tone === 'error' ? '✕' : '✓'}</Text>
      <Text style={styles.toastText} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. LAYAR UTAMA                                                             */
/* -------------------------------------------------------------------------- */

export default function App() {
  return (
    <SafeAreaProvider>
      <GitGudScreen />
    </SafeAreaProvider>
  );
}

function GitGudScreen() {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState('commands');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const [toast, setToast] = useState({ message: '', tone: 'success', mounted: false });
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef(null);
  const listRef = useRef(null);

  // Bersihkan timer agar tidak ada pembaruan state setelah komponen dilepas.
  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    []
  );

  const showToast = useCallback(
    (message, tone = 'success') => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToast({ message, tone, mounted: true });
      toastAnim.stopAnimation();
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();

      toastTimer.current = setTimeout(() => {
        Animated.timing(toastAnim, {
          toValue: 0,
          duration: 220,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) setToast((prev) => ({ ...prev, mounted: false }));
        });
      }, 1900);
    },
    [toastAnim]
  );

  // Salin perintah ke papan klip dengan satu ketuk.
  const handleCopy = useCallback(
    async (command) => {
      try {
        await Clipboard.setStringAsync(command);
        showToast(`Disalin: ${command}`);
      } catch (error) {
        showToast('Gagal menyalin ke papan klip', 'error');
      }
    },
    [showToast]
  );

  const addRecentSearch = useCallback((term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => [trimmed, ...prev.filter((entry) => entry !== trimmed)].slice(0, 6));
  }, []);

  const openDetail = useCallback((item) => {
    setSelectedItem(item);
    setSheetVisible(true);
  }, []);

  // Item sengaja tidak dikosongkan agar isinya tidak berkedip saat animasi tutup.
  const closeDetail = useCallback(() => setSheetVisible(false), []);

  const copyFromSheet = useCallback(
    (command) => {
      setSheetVisible(false);
      handleCopy(command);
    },
    [handleCopy]
  );

  const resetFilters = useCallback(() => {
    setSearch('');
    setActiveCategory('');
  }, []);

  // Pencarian langsung: menyaring perintah maupun deskripsinya sambil mengetik.
  const sections = useMemo(() => {
    const term = search.trim().toLowerCase();

    return CATEGORIES.filter((category) => !activeCategory || category.id === activeCategory)
      .map((category) => ({
        ...category,
        data: COMMANDS.filter(
          (item) =>
            item.cat === category.id &&
            (!term ||
              item.command.toLowerCase().includes(term) ||
              item.desc.toLowerCase().includes(term))
        ),
      }))
      .filter((section) => section.data.length > 0);
  }, [search, activeCategory]);

  const resultCount = useMemo(
    () => sections.reduce((total, section) => total + section.data.length, 0),
    [sections]
  );

  // Hasil saringan selalu dibaca dari awal, bukan dari posisi gulir sebelumnya.
  useEffect(() => {
    listRef.current?.getScrollResponder?.()?.scrollTo?.({ y: 0, animated: false });
  }, [search, activeCategory]);

  const isFiltering = search.trim().length > 0 || activeCategory !== '';
  const showRecent = recentSearches.length > 0 && search.trim().length === 0;

  const renderItem = useCallback(
    ({ item, section }) => (
      <CommandCard
        item={item}
        color={section.color}
        onPress={() => openDetail(item)}
        onCopy={() => handleCopy(item.command)}
      />
    ),
    [handleCopy, openDetail]
  );

  const renderSectionHeader = useCallback(
    ({ section }) => (
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionDot, { backgroundColor: section.color }]} />
        <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
        <Text style={styles.sectionCount}>{section.data.length}</Text>
      </View>
    ),
    []
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" backgroundColor={COLORS.bg} />

      {/* KEPALA APLIKASI */}
      <View style={styles.appBar}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>$_</Text>
        </View>
        <View style={styles.appBarTitles}>
          <Text style={styles.appTitle}>Git Gud</Text>
          <Text style={styles.appSubtitle}>Cheat sheet perintah Git</Text>
        </View>
        <View style={styles.counterChip}>
          <Text style={styles.counterValue}>{TOTAL_COMMANDS}</Text>
          <Text style={styles.counterLabel}>perintah</Text>
        </View>
      </View>

      <View style={styles.segmentWrapper}>
        <SegmentedControl
          value={view}
          onChange={setView}
          options={[
            { value: 'commands', label: 'Perintah' },
            { value: 'guide', label: 'Panduan' },
          ]}
        />
      </View>

      {view === 'commands' ? (
        <>
          {/* PENCARIAN */}
          <View style={styles.searchBar}>
            <Text style={styles.searchPrompt}>›</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari perintah atau deskripsi…"
              placeholderTextColor={COLORS.textFaint}
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={() => addRecentSearch(search)}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor={COLORS.accent}
            />
            {search.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Bersihkan pencarian"
                hitSlop={10}
                style={styles.searchClear}
                onPress={() => setSearch('')}
              >
                <Text style={styles.searchClearText}>✕</Text>
              </Pressable>
            ) : null}
          </View>

          {/* RIWAYAT PENCARIAN */}
          {showRecent ? (
            <View style={styles.recentBlock}>
              <View style={styles.recentHeader}>
                <Text style={styles.recentLabel}>PENCARIAN TERAKHIR</Text>
                <Pressable hitSlop={8} onPress={() => setRecentSearches([])}>
                  <Text style={styles.recentClearAll}>Hapus semua</Text>
                </Pressable>
              </View>
              <View style={styles.recentRow}>
                {recentSearches.map((term) => (
                  <View key={term} style={styles.recentChip}>
                    <Pressable hitSlop={6} onPress={() => setSearch(term)}>
                      <Text style={styles.recentChipText}>{term}</Text>
                    </Pressable>
                    <Pressable
                      accessibilityLabel={`Hapus riwayat ${term}`}
                      hitSlop={8}
                      onPress={() =>
                        setRecentSearches((prev) => prev.filter((entry) => entry !== term))
                      }
                    >
                      <Text style={styles.recentChipRemove}>✕</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* SARINGAN KATEGORI */}
          <View style={styles.filterRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.filterContent}
            >
              <Pressable
                style={[styles.filterChip, !activeCategory && styles.filterChipActive]}
                onPress={() => setActiveCategory('')}
              >
                <Text style={[styles.filterChipText, !activeCategory && styles.filterChipTextActive]}>
                  Semua
                </Text>
              </Pressable>
              {CATEGORIES.map((category) => {
                const active = activeCategory === category.id;
                return (
                  <Pressable
                    key={category.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    style={[
                      styles.filterChip,
                      active && { backgroundColor: category.color, borderColor: category.color },
                    ]}
                    onPress={() => setActiveCategory(active ? '' : category.id)}
                  >
                    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                      {category.icon}  {category.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {isFiltering ? (
            <Text style={styles.resultLine}>
              {resultCount} dari {TOTAL_COMMANDS} perintah
            </Text>
          ) : null}

          {/* DAFTAR PERINTAH */}
          <SectionList
            ref={listRef}
            sections={sections}
            keyExtractor={(item) => `${item.cat}:${item.command}`}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            stickySectionHeadersEnabled
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContent, { paddingBottom: 96 + insets.bottom }]}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>Perintah tidak ditemukan</Text>
                <Text style={styles.emptyDesc}>
                  Coba kata kunci lain, atau bersihkan saringan yang sedang aktif.
                </Text>
                <Pressable
                  style={({ pressed }) => [styles.emptyButton, pressed && styles.pressedSoft]}
                  onPress={resetFilters}
                >
                  <Text style={styles.emptyButtonText}>Bersihkan saringan</Text>
                </Pressable>
              </View>
            }
          />
        </>
      ) : (
        /* TAMPILAN PANDUAN */
        <ScrollView
          style={styles.guide}
          contentContainerStyle={[styles.guideContent, { paddingBottom: 96 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.guideHeading}>Alur kerja harian</Text>
          <Text style={styles.guideLead}>
            Lima langkah yang menutup hampir seluruh pekerjaan Git sehari-hari. Ketuk perintahnya
            untuk menyalin.
          </Text>

          {WORKFLOW.map((entry, index) => (
            <View key={entry.step} style={styles.stepRow}>
              <View style={styles.stepGutter}>
                <View style={styles.stepBullet}>
                  <Text style={styles.stepBulletText}>{entry.step}</Text>
                </View>
                {index < WORKFLOW.length - 1 ? <View style={styles.stepLine} /> : null}
              </View>
              <View style={styles.stepBody}>
                <Text style={styles.stepTitle}>{entry.title}</Text>
                <Text style={styles.stepDesc}>{entry.desc}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Salin ${entry.command}`}
                  style={({ pressed }) => [styles.stepCommand, pressed && styles.pressedSoft]}
                  onPress={() => handleCopy(entry.command)}
                >
                  <Text style={styles.stepCommandText} numberOfLines={1}>
                    {entry.command}
                  </Text>
                  <Text style={styles.stepCommandCopy}>Salin</Text>
                </Pressable>
              </View>
            </View>
          ))}

          <Text style={[styles.guideHeading, styles.guideHeadingSpaced]}>Tips singkat</Text>
          {TIPS.map((tip) => (
            <View key={tip.title} style={styles.tipCard}>
              <Text style={styles.tipIcon}>{tip.icon}</Text>
              <View style={styles.tipBody}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDesc}>{tip.desc}</Text>
              </View>
            </View>
          ))}

          <Text style={styles.guideFooter}>Universitas Insan Mahardika · Git Gud v1.0.0</Text>
        </ScrollView>
      )}

      <DetailSheet
        visible={sheetVisible}
        item={selectedItem}
        onClose={closeDetail}
        onCopy={copyFromSheet}
      />

      {toast.mounted ? (
        <Toast
          anim={toastAnim}
          message={toast.message}
          tone={toast.tone}
          bottomInset={insets.bottom}
        />
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. GAYA (STYLESHEET MURNI REACT NATIVE)                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  pressedSoft: {
    opacity: 0.65,
  },

  /* Kepala aplikasi */
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: MONO,
    fontSize: 17,
    fontWeight: '700',
    color: BRAND.tinta,
  },
  appBarTitles: {
    flex: 1,
    marginLeft: 12,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  appSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  counterChip: {
    alignItems: 'flex-end',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    paddingLeft: 12,
  },
  counterValue: {
    fontFamily: MONO,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.accent,
  },
  counterLabel: {
    fontSize: 10,
    color: COLORS.textFaint,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  /* Sakelar tampilan */
  segmentWrapper: {
    paddingHorizontal: 20,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
  },
  segmentItemActive: {
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  segmentTextActive: {
    color: COLORS.text,
  },

  /* Pencarian */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 14,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
  },
  searchPrompt: {
    fontFamily: MONO,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.accent,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 46,
    fontSize: 14,
    color: COLORS.text,
    padding: 0,
  },
  searchClear: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchClearText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },

  /* Riwayat pencarian */
  recentBlock: {
    marginHorizontal: 20,
    marginTop: 14,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.textFaint,
  },
  recentClearAll: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.accent,
  },
  recentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingLeft: 12,
    paddingRight: 9,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  recentChipText: {
    fontFamily: MONO,
    fontSize: 12,
    color: COLORS.text,
  },
  recentChipRemove: {
    fontSize: 10,
    color: COLORS.textFaint,
    marginLeft: 8,
  },

  /* Saringan kategori */
  filterRow: {
    marginTop: 14,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingRight: 12,
  },
  filterChip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  filterChipTextActive: {
    color: BRAND.tinta,
    fontWeight: '700',
  },
  resultLine: {
    marginTop: 12,
    marginHorizontal: 20,
    fontSize: 11,
    color: COLORS.textFaint,
    fontFamily: MONO,
  },

  /* Daftar & judul kategori */
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 96,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    paddingTop: 18,
    paddingBottom: 10,
  },
  sectionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 8,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: COLORS.textMuted,
  },
  sectionCount: {
    fontFamily: MONO,
    fontSize: 11,
    color: COLORS.textFaint,
  },

  /* Kartu perintah */
  cardWrapper: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
  },
  cardRail: {
    width: 3,
  },
  card: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  cardCommand: {
    fontFamily: MONO,
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.accent,
    lineHeight: 20,
  },
  cardDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 19,
    marginTop: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cardHint: {
    fontSize: 11,
    color: COLORS.textFaint,
  },
  copyButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  copyButtonPressed: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  copyButtonText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: COLORS.text,
  },

  /* Kondisi kosong */
  empty: {
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 30,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
  },
  emptyButton: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  emptyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
  },

  /* Panduan */
  guide: {
    flex: 1,
  },
  guideContent: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 96,
  },
  guideHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  guideHeadingSpaced: {
    marginTop: 26,
    marginBottom: 14,
  },
  guideLead: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
  },
  stepGutter: {
    alignItems: 'center',
    width: 34,
  },
  stepBullet: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBulletText: {
    fontFamily: MONO,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
  },
  stepLine: {
    flex: 1,
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  stepBody: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 5,
  },
  stepDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 19,
    marginTop: 4,
  },
  stepCommand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
  },
  stepCommandText: {
    flex: 1,
    fontFamily: MONO,
    fontSize: 12,
    color: COLORS.accent,
    marginRight: 10,
  },
  stepCommandCopy: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: COLORS.textFaint,
    textTransform: 'uppercase',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  tipIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  tipBody: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  tipDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 19,
    marginTop: 4,
  },
  guideFooter: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.textFaint,
  },

  /* Lembar detail */
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(4, 4, 8, 0.72)',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: COLORS.border,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginBottom: 18,
  },
  sheetBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  sheetBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sheetCommandBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 14,
  },
  sheetPrompt: {
    fontFamily: MONO,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textFaint,
    marginRight: 10,
  },
  sheetCommand: {
    flex: 1,
    fontFamily: MONO,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accent,
    lineHeight: 21,
  },
  sheetDesc: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 21,
    marginTop: 16,
  },
  sheetTip: {
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: 12,
    padding: 13,
    marginTop: 14,
  },
  sheetTipLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.textFaint,
    marginBottom: 5,
  },
  sheetTipText: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 19,
  },
  sheetActions: {
    flexDirection: 'row',
    marginTop: 22,
  },
  sheetGhostButton: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
  },
  sheetGhostText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  sheetPrimaryButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 11,
    backgroundColor: COLORS.accent,
  },
  sheetPrimaryPressed: {
    backgroundColor: BRAND.informatikaTerang,
  },
  sheetPrimaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: BRAND.tinta,
  },

  /* Notifikasi melayang */
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  toastIcon: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: 10,
  },
  toastText: {
    flex: 1,
    fontFamily: MONO,
    fontSize: 12,
    color: COLORS.text,
  },
});
