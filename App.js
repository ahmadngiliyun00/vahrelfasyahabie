import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SectionList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

// Palet resmi Universitas Insan Mahardika.
// Warna utama aplikasi ini mengikuti Program Studi Informatika (kuning emas).
// Varian "Terang" adalah versi lebih cerah dari warna resmi, dipakai untuk teks
// di atas latar gelap agar tetap terbaca.
const BRAND = {
  informatika: '#F0B90B', // Informatika — warna utama
  informatikaTerang: '#FFD75E',
  fmt: '#FB7A1E', // FMT — aksen sekunder
  fkes: '#7ED957', // FKES — hijau muda
  psik: '#3D8B11', // PSIK — hijau
  kesmasTerang: '#8B5BD6', // KESMAS (dicerahkan)
  kebidananTerang: '#4DA6FF', // Kebidanan (dicerahkan)
  rmikTerang: '#E85555', // RMIK (dicerahkan)
  tinta: '#0a0a0f',
  putih: '#FFFFFF',
};

// 1. DATA PERINTAH GIT (Dikelompokkan berdasarkan Kategori)
const GIT_DATA = [
  {
    title: '⚙️ INISIALISASI & KONFIGURASI',
    data: [
      { command: 'git init', desc: 'Membuat repository Git lokal baru di dalam folder.' },
      { command: 'git config --global user.name "Nama Anda"', desc: 'Mengatur nama identitas pengguna secara global.' },
      { command: 'git config --global user.email "email@anda.com"', desc: 'Mengatur email identitas pengguna secara global.' },
      { command: 'git clone [url]', desc: 'Menyalin repository remote dari internet ke lokal komputer.' },
    ],
  },
  {
    title: '📝 MEMBUAT PERUBAHAN (STAGING & COMMIT)',
    data: [
      { command: 'git status', desc: 'Melihat daftar berkas yang diubah, ditambah, atau siap di-commit.' },
      { command: 'git add [nama_file]', desc: 'Memasukkan berkas spesifik ke dalam staging area.' },
      { command: 'git add .', desc: 'Memasukkan semua berkas yang berubah ke dalam staging area.' },
      { command: 'git commit -m "Pesan commit"', desc: 'Menyimpan perubahan dari staging area ke riwayat Git dengan pesan.' },
      { command: 'git commit --amend', desc: 'Mengubah pesan atau isi dari commit terakhir.' },
    ],
  },
  {
    title: '🌿 REKAYASA BRANCH (PERCABANGAN)',
    data: [
      { command: 'git branch', desc: 'Menampilkan daftar branch lokal di dalam repository.' },
      { command: 'git branch [nama_branch]', desc: 'Membuat branch baru dengan nama tertentu.' },
      { command: 'git checkout [nama_branch]', desc: 'Berpindah ke branch yang dituju.' },
      { command: 'git checkout -b [nama_branch]', desc: 'Membuat branch baru dan langsung berpindah ke branch tersebut.' },
      { command: 'git merge [nama_branch]', desc: 'Menggabungkan riwayat branch yang dipilih ke branch aktif saat ini.' },
      { command: 'git branch -d [nama_branch]', desc: 'Menghapus branch lokal yang sudah tidak digunakan.' },
    ],
  },
  {
    title: '🌐 REMOTE REPOSITORY & SYNC',
    data: [
      { command: 'git remote add origin [url]', desc: 'Menghubungkan repository lokal dengan remote server (GitHub/GitLab).' },
      { command: 'git push -u origin [nama_branch]', desc: 'Mengirim commit lokal ke remote repository sekaligus mengatur upstream.' },
      { command: 'git push', desc: 'Mengirim commit lokal ke remote branch yang sudah terhubung.' },
      { command: 'git pull', desc: 'Mengambil sekaligus menggabungkan (merge) perubahan terbaru dari remote ke lokal.' },
      { command: 'git fetch', desc: 'Mengambil riwayat perubahan terbaru dari remote tanpa melakukan merge otomatis.' },
    ],
  },
  {
    title: '⏳ LOG & PEMBATALAN (UNDO)',
    data: [
      { command: 'git log --oneline', desc: 'Menampilkan riwayat commit secara ringkas dalam satu baris per commit.' },
      { command: 'git reset --soft HEAD~1', desc: 'Membatalkan commit terakhir, namun berkas tetap berada di staging area.' },
      { command: 'git reset --hard HEAD~1', desc: 'Membatalkan commit, staging, dan semua perubahan berkas terakhir secara permanen!' },
      { command: 'git revert [hash_commit]', desc: 'Membuat commit baru yang isinya membalikkan perubahan dari commit tertentu.' },
    ],
  },
];

const OTHER_VIEW_DATA = [
  {
    title: '💡 Tips Git Cepat',
    desc: 'Gunakan `git status` sebelum commit untuk memastikan semua perubahan yang diinginkan sudah siap.',
  },
  {
    title: '🔀 Branch Workflow',
    desc: 'Kerjakan fitur di branch terpisah, lalu merge ke main setelah review untuk menjaga riwayat bersih.',
  },
  {
    title: '🌐 Sinkronisasi Remote',
    desc: 'Selalu lakukan `git pull` sebelum `git push` untuk menghindari konflik di remote branch.',
  },
  {
    title: '🧹 Housekeeping',
    desc: 'Hapus branch lokal yang tidak digunakan dengan `git branch -d <nama_branch>` agar repo tetap rapi.',
  },
];

// Derived category keys for quick filter
const CATEGORIES = GIT_DATA.map((s) => s.title);
export default function App() {
  const [search, setSearch] = useState('');
  const [copiedText, setCopiedText] = useState('');
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [currentView, setCurrentView] = useState('commands');
  const [recentSearches, setRecentSearches] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const addRecentSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((item) => item !== trimmed)];
      return next.slice(0, 6);
    });
  };

  const handleSearchSubmit = () => {
    addRecentSearch(search);
  };

  const toggleCategory = (cat) => {
    if (filteredCategory === cat) setFilteredCategory('');
    else setFilteredCategory(cat);
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeDetailModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const removeRecentSearch = (term) => {
    setRecentSearches((prev) => prev.filter((item) => item !== term));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // 2. LOGIKA FILTER SEARCH (Real-time Filter)
  const filteredGitData = useMemo(() => {
    const term = search.trim().toLowerCase();

    // start from base sections, optionally restrict to category
    const base = filteredCategory ? GIT_DATA.filter((s) => s.title === filteredCategory) : GIT_DATA;

    if (!term) return base;

    return base
      .map((section) => {
        const filteredItems = section.data.filter(
          (item) => item.command.toLowerCase().includes(term) || item.desc.toLowerCase().includes(term)
        );
        return { ...section, data: filteredItems };
      })
      .filter((section) => section.data.length > 0);
  }, [search, filteredCategory]);

  // 3. LOGIKA ONE-TAP COPY TO CLIPBOARD
  const handleCopy = async (command) => {
    await Clipboard.setStringAsync(command);
    setCopiedText(command);
    setNotificationVisible(true);

    // Notifikasi melayang otomatis hilang dalam 2 detik
    setTimeout(() => {
      setNotificationVisible(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />

      {/* BANNER ESTETIK TERMINAL */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>SYSTEM BOOTING...</Text>
        <Text style={styles.bannerText}>WELCOME TO GITGUD HACKER SHELL</Text>
        <Text style={styles.bannerSmall}>[ ready ]</Text>
      </View>

      {/* TERMINAL HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>~/gitgud $ cheat-sheet</Text>
        <Text style={styles.headerSubtitle}>Tap perintah untuk menyalin ke clipboard</Text>
      </View>

      {/* SEARCH BAR (TERMINAL INPUT SYTLE) */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.switchButton, currentView === 'commands' && styles.switchButtonActive]}
          onPress={() => setCurrentView('commands')}
        >
          <Text style={[styles.switchButtonText, currentView === 'commands' && styles.switchButtonTextActive]}>
            Daftar Perintah
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, currentView === 'tips' && styles.switchButtonActive]}
          onPress={() => setCurrentView('tips')}
        >
          <Text style={[styles.switchButtonText, currentView === 'tips' && styles.switchButtonTextActive]}>
            Tampilan Lain
          </Text>
        </TouchableOpacity>
      </View>

      {currentView === 'commands' ? (
        <>
          <View style={styles.searchContainer}>
            <Text style={styles.promptSymbol}>&gt;</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari perintah atau deskripsi..."
              placeholderTextColor="#5a5a72"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>✖</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentSearches.length > 0 && (
            <View style={styles.recentSearchesContainer}>
              <View style={styles.recentSearchesHeader}>
                <Text style={styles.sectionHeaderTitle}>🔎 Recent Searches</Text>
                <TouchableOpacity onPress={clearRecentSearches} style={styles.clearHistoryButton}>
                  <Text style={styles.clearHistoryText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.recentSearchesRow}>
                {recentSearches.map((term, index) => (
                  <View key={`${term}-${index}`} style={styles.recentSearchChipWrapper}>
                    <TouchableOpacity
                      style={styles.recentSearchChip}
                      onPress={() => {
                        setSearch(term);
                      }}
                    >
                      <Text style={styles.recentSearchText}>{term}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeRecentSearch(term)}
                      style={styles.removeRecentSearchButton}
                    >
                      <Text style={styles.removeRecentSearchText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* QUICK FILTER CATEGORY TABS */}
          <View style={styles.categoryRowContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, filteredCategory === cat && styles.categoryChipActive]}
                  onPress={() => toggleCategory(cat)}
                >
                  <Text style={[styles.categoryChipText, filteredCategory === cat && styles.categoryChipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <SectionList
            sections={filteredGitData}
            keyExtractor={(item, index) => item.command + index}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderTitle}>{title}</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.card}
                onPress={() => openDetailModal(item)}
                onLongPress={() => handleCopy(item.command)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.commandText}>{item.command}</Text>
                  <Text style={styles.copyBadge}>copy</Text>
                </View>
                <Text style={styles.descText}>{item.desc}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>[!] Perintah tidak ditemukan.</Text>
              </View>
            }
          />
        </>
      ) : (
        <View style={styles.otherViewContainer}>
          <Text style={styles.otherViewTitle}>Tampilan Lain</Text>
          {OTHER_VIEW_DATA.map((item, index) => (
            <View key={index} style={styles.otherViewCard}>
              <Text style={styles.otherViewCardTitle}>{item.title}</Text>
              <Text style={styles.otherViewCardDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>
      )}

      {/* TOAST / NOTIFIKASI KUSTOM MELAYANG */}
      {/* DETAIL MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeDetailModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>Detail Perintah</Text>
                <Text style={styles.modalCommand}>{selectedItem.command}</Text>
                <Text style={styles.modalDesc}>{selectedItem.desc}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalButton} onPress={() => { handleCopy(selectedItem.command); closeDetailModal(); }}>
                    <Text style={styles.modalButtonText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, { marginLeft: 8 }]} onPress={closeDetailModal}>
                    <Text style={styles.modalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      {notificationVisible && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>
            ✓ Berhasil disalin:{' '}
            <Text style={styles.notificationCode}>{copiedText}</Text>
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// 4. STYLE SHEET MURNI REACT NATIVE (tanpa library styling eksternal)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f', // Palet warna dasar aplikasi
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3a',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BRAND.fkes, // Hijau FKES sebagai aksen terminal
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9090a8',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111118',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a3a',
    paddingHorizontal: 12,
  },
  promptSymbol: {
    color: BRAND.fmt, // Oranye FMT sebagai simbol prompt
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#e8e8f0',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    color: '#5a5a72',
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 80, // Ruang ekstra agar tidak tertutup notifikasi
  },
  sectionHeader: {
    backgroundColor: '#0a0a0f',
    paddingVertical: 12,
    marginTop: 12,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: BRAND.fmt, // Oranye FMT untuk judul kategori
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#1a1a24',
    borderWidth: 1,
    borderColor: '#2a2a3a',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  commandText: {
    fontSize: 14,
    fontWeight: '700',
    color: BRAND.informatika, // Kuning Informatika untuk kode perintah
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    flex: 1,
    marginRight: 8,
  },
  copyBadge: {
    fontSize: 10,
    color: '#5a5a72',
    borderWidth: 1,
    borderColor: '#2a2a3a',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  descText: {
    fontSize: 13,
    color: '#9090a8',
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: BRAND.rmikTerang, // Merah RMIK sebagai peringatan
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 13,
  },
  banner: {
    backgroundColor: '#05060d',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#191a23',
  },
  bannerText: {
    color: BRAND.kebidananTerang,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 12,
    letterSpacing: 0.7,
  },
  bannerSmall: {
    color: BRAND.kesmasTerang,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 10,
    marginTop: 4,
  },
  recentSearchesContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  recentSearchesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryRowContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  categoryRow: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  categoryChip: {
    backgroundColor: '#0f1724',
    borderWidth: 1,
    borderColor: '#2a2a3a',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: BRAND.informatika,
    borderColor: BRAND.informatika,
  },
  categoryChipText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  categoryChipTextActive: {
    // Teks gelap di atas chip kuning agar kontrasnya tetap tinggi
    color: BRAND.tinta,
    fontWeight: '700',
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearHistoryButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: '#2a2a3a',
  },
  clearHistoryText: {
    color: BRAND.informatikaTerang,
    fontSize: 11,
    fontWeight: '700',
  },
  recentSearchChipWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  recentSearchChip: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#2a2a3a',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  removeRecentSearchButton: {
    marginLeft: 6,
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#111118',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeRecentSearchText: {
    color: BRAND.rmikTerang,
    fontSize: 12,
    fontWeight: '700',
  },
  recentSearchText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 16,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2a2a3a',
    backgroundColor: '#111118',
    alignItems: 'center',
  },
  switchButtonActive: {
    backgroundColor: '#1f2937',
    borderColor: BRAND.informatika,
  },
  switchButtonText: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '700',
  },
  switchButtonTextActive: {
    color: '#ffffff',
  },
  otherViewContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80,
  },
  otherViewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  otherViewCard: {
    backgroundColor: '#15151b',
    borderColor: '#2a2a3a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  otherViewCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BRAND.kesmasTerang,
    marginBottom: 6,
  },
  otherViewCardDesc: {
    fontSize: 13,
    color: '#c7c7d4',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#0b0b10',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2a2a3a',
  },
  modalTitle: {
    color: BRAND.informatikaTerang,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalCommand: {
    color: BRAND.informatika,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontWeight: '700',
    marginBottom: 6,
  },
  modalDesc: {
    color: '#c7c7d4',
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    backgroundColor: '#1f2937',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#e2e8f0',
    fontWeight: '700',
  },
  notification: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(61, 139, 17, 0.97)', // Hijau PSIK sebagai notifikasi sukses
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  notificationCode: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontWeight: 'bold',
    color: '#111118',
  },
});