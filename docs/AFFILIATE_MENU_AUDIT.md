# Affiliate Menu Audit

Tanggal audit: 2026-06-17

## Scope

Audit dilakukan untuk menu FVN Affiliate Center berikut:

1. Dashboard
2. Product Intelligence
3. Content Factory
4. Story Engine
5. Multi Video Engine
6. Scheduler
7. Content Library
8. AI Agents
9. Profit Center
10. Analytics
11. Tutorial & Panduan
12. Pengaturan

Audit berfokus pada tombol, navigasi, tab, filter, card action, form, data flow, status, source label, responsive layout, error handling, dan build validation.

## Tombol dan Fitur Working

- Dashboard: quick action card menuju Product Intelligence, Content Factory, Story Engine, Scheduler, Analytics, Draft Konten, dan Rencana Hari Ini sudah punya link/handler.
- Dashboard: tombol topbar notifikasi dan profil/pengaturan sekarang punya navigasi, bukan tombol mati.
- Product Intelligence: tab utama, subtab, search lokal, filter kategori/platform/periode, sorting produk, rekomendasi produk, dan action card menuju Content Factory sudah berjalan.
- Product Intelligence: empty state muncul saat filter/search tidak menemukan produk.
- Content Factory: generator hook, script, caption, full content pack, storyboard, media upload, prompt Nano Banana, prompt Veo 3, compliance, copy button, dan save draft tersedia.
- Story Engine: panel workflow menerima konteks produk/konten dan menampilkan placeholder yang jelas untuk fitur lanjutan.
- Multi Video Engine: panel workflow menerima konteks storyboard/video dan menampilkan placeholder yang jelas untuk fitur lanjutan.
- Scheduler: campaign/rencana posting, input performa manual, summary performa, dan status campaign tersedia.
- Content Library: list draft, search/filter, detail, edit, copy caption/hashtag/full pack, duplicate, archive, delete, dan create campaign tersedia.
- AI Agents: action card agent menampilkan respons placeholder, tidak dibiarkan klik tanpa reaksi.
- Profit Center: ringkasan profit sederhana memakai data manual dan memberi peringatan saat data masih contoh.
- Analytics: summary, table produk/konten/campaign, insight template, filter waktu, empty state, dan export CSV tersedia.
- Tutorial & Panduan: onboarding/panduan pemula bisa dibuka.
- Pengaturan: status database, TikTok OAuth, TikTok Shop API, AI Provider, publishing mode manual, clear demo data, sample CSV, OAuth test, dan health check tersedia.

## Placeholder yang Masih Disengaja

- AI Agents belum menjalankan agent otomatis penuh; tombol menampilkan pesan bahwa fitur sedang disiapkan.
- Story Engine dan Multi Video Engine masih memakai workflow/preview internal, belum render final AI video.
- Scheduler belum melakukan auto-post ke TikTok; mode publishing tetap manual.
- Marketplace/API real belum aktif kecuali environment dan API resmi disambungkan.
- Filter estimasi pendapatan di Top Affiliator masih UI placeholder.
- Data top seller/top affiliator masih estimasi dari data produk tersimpan, bukan scraping marketplace.

## Bug yang Ditemukan

- Topbar bell dan profil sebelumnya berupa button tanpa handler.
- Product Intelligence search/filter sebelumnya belum benar-benar memfilter data lokal.
- Product Intelligence belum punya empty state saat hasil filter kosong.
- Beberapa UI masih menampilkan label teknis seperti `DEMO DATA`, `MANUAL DATA`, `CSV IMPORT`, atau `REAL API DATA`.
- Test lama masih mengunci ekspektasi pada label teknis lama.

## Bug yang Diperbaiki

- Topbar bell diarahkan ke bagian AI Agents dan profil diarahkan ke Pengaturan.
- Product Intelligence sekarang punya state search/filter/sort lokal.
- Product Intelligence menampilkan empty state saat tidak ada hasil sesuai filter.
- Label sumber data user-facing diganti menjadi:
  - Data Contoh
  - Data Tersimpan
  - Data Marketplace
  - Data Partner
- Warning data contoh tetap muncul: "Data Contoh - Bukan dari TikTok Shop".
- Draft Konten tidak lagi menampilkan enum sumber data mentah pada card dan filter.
- Pengaturan memakai bahasa ramah saat clear data contoh.
- Onboarding memakai istilah sumber data yang lebih mudah dipahami.
- Test source label diperbarui agar sesuai label user-facing baru.

## Data Flow yang Dicek

- Product Intelligence -> Content Factory: tombol "Generate Konten" / "Buat Konten" memilih produk dan membawa user ke generator konten.
- Content Factory -> Story Engine: content/storyboard state tersedia untuk panel Story Engine.
- Story Engine -> Multi Video Engine: storyboard/media/prompt state tersedia untuk panel video.
- Multi Video Engine -> Content Library: draft disimpan sebagai content pack.
- Content Library -> Scheduler: draft dapat membuat campaign.
- Scheduler -> Analytics / Profit Center: performa manual dipakai untuk summary, insight, dan profit sederhana.
- Analytics / Profit Center -> AI Agents: rekomendasi tetap aman dan berbasis data manual yang tersedia.

## Status yang Dicek

- Draft
- Siap Posting
- Sudah Posting
- Arsip
- Draft campaign
- Aktif
- Paused
- Completed
- Placeholder untuk Scheduled, Failed, dan Need Revision perlu dimatangkan pada modul scheduler lanjutan.

## Error Handling dan Empty State

- Form produk manual punya validasi wajib dan pesan error.
- CSV import menolak row invalid dengan pesan jelas.
- Content Library menampilkan empty state jika belum ada draft.
- Analytics menampilkan empty state jika belum ada data performa.
- Campaign/posting manual menggunakan pesan ramah untuk aksi gagal.
- Clear demo data menampilkan pesan aman dan tidak menghapus data manual/CSV/API.
- API/database failure ditangani dengan fallback/pesan ramah pada area utama.

## Responsive Audit

- Layout utama menggunakan grid responsif dan mobile bottom navigation.
- Table analytics dibungkus horizontal scroll.
- Product Intelligence, Dashboard, Content Library, dan Settings memakai grid yang turun ke satu kolom pada layar kecil.
- Right panel Dashboard turun setelah konten utama pada ukuran non-desktop.
- Smoke check browser pada hasil build dilakukan untuk viewport desktop 1440x900, tablet 768x1024, dan mobile 390x844.
- Hasil smoke check: tidak ada page-level horizontal overflow pada ketiga viewport dan tidak ada console error/warning.
- Tabel Product Intelligence yang lebar sekarang tertahan di wrapper horizontal scroll.

## Sisa Pekerjaan

- Implementasi marketplace resmi/API partner untuk Data Partner.
- Model database khusus untuk scheduled posting status, failed status, dan need revision status jika scheduler diperluas.
- Agent execution sebenarnya untuk AI Agents.
- Persisted advanced filters untuk Product Intelligence.
- Batch workflow dari Multi Video Engine ke Content Library.
- Screenshot QA browser untuk desktop, tablet, dan mobile.
- Playwright/e2e test untuk klik lintas menu jika project sudah menambahkan dependency browser test.

## Rekomendasi Next Step

1. Tambahkan e2e smoke test untuk menu utama dan flow Product Intelligence -> Content Factory -> Content Library -> Scheduler.
2. Tambahkan visual responsive QA dengan screenshot desktop/tablet/mobile.
3. Matangkan status scheduler menjadi Scheduled, Posted, Failed, dan Need Revision pada database.
4. Pisahkan placeholder agent menjadi backlog eksplisit agar user paham fitur mana yang sudah aktif dan mana yang masih preview.
5. Hubungkan marketplace API resmi hanya setelah scope dan kredensial sudah approved.

## Validasi

Validasi yang dijalankan pada audit ini:

- `npm run lint` - passed
- `npm run typecheck` - passed
- `npm test` - passed, 25 test files / 94 tests
- `npm run build` - passed

Catatan: build pertama sempat gagal karena Prisma client DLL terkunci oleh server lokal lama. Proses server lokal project ini dihentikan, lalu build final berhasil.
