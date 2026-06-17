# Affiliate Center Audit

Date: 2026-06-17

## Bug dari hasil testing user

- Product Intelligence perlu default 10 produk, tombol Lihat Lebih Banyak menjadi 25 produk, filter kategori, dan aksi Add to TikTok Showcase dengan status NOT_CONNECTED saat OAuth belum aktif.
- Content Factory harus mengganti script saat content type berubah: Product Review, Problem Solution, Comparison, UGC Script, Short Video, Live Selling Script.
- Story Engine harus mengganti struktur saat story mode berubah.
- Multi Video Engine perlu jumlah video 1-30, preview card, image prompt, video prompt, Edit, Save All to Library, dan Schedule.
- Content Library harus menerima hasil dari Multi Video Engine, Content Factory, Story Engine, dan Creative Studio dengan source label dan status.

## Fix yang dilakukan

- Product Intelligence memakai `productDisplayLimit(false) = 10` dan `productDisplayLimit(true) = 25`.
- Tombol Lihat Lebih Banyak mengubah jumlah produk yang ditampilkan ke 25.
- Demo dataset diperbesar menjadi 25 produk sehingga Produk Terlaris, Top Affiliate, dan Top Seller tidak lagi berhenti di 3 item.
- Filter kategori tetap mengubah list produk berdasarkan kategori yang dipilih.
- Category Browser aktif: Electronics, Fashion, Beauty, Home & Living, Kitchen, Baby, Health, Sports, Automotive, Books.
- Ranking tab aktif: Top Hari Ini, Top Minggu Ini, Top Bulan Ini, Opportunity Score.
- Source indicator memakai label eksplisit DEMO, MANUAL, CSV_IMPORT, REAL_API.
- Action produk sekarang mencakup Save Opportunity, Create Content, Create Campaign, dan Add to TikTok Showcase.
- Add to TikTok Showcase memakai handler `addProductToTikTokShowcase(productId, accountId)` dan mengembalikan status `NOT_CONNECTED` jika TikTok Shop/Affiliate API belum connected.
- Content Factory memakai template berbeda untuk Product Review, Problem Solution, Comparison, UGC Script, Short Video, dan Live Selling Script.
- Story Engine memakai struktur berbeda untuk Kids Animation, Education, Business Story, Affiliate Story, Islamic Story, dan Motivational Story.
- Multi Video Engine menghasilkan 1 sampai 30 variasi video dengan panel setting Platform, Jumlah Video, Duration, Aspect Ratio, Resolution, dan Video Generator.
- Default TikTok/Reels/Shorts memakai `9:16` dan `1080x1920`, Instagram Feed memakai `4:5` dan `1080x1350`, YouTube Landscape memakai `16:9` dan `1920x1080`.
- Preview card Multi Video Engine memakai satu preview utama dan detail hook/script/prompt/caption/hashtag/CTA masuk ke accordion agar card tidak penuh.
- Save All to Library menyimpan item ke local generated Content Library fallback dengan `sourceCode = MULTI_VIDEO_ENGINE` dan `statusCode = DRAFT`.
- Caption di Content Factory, Story Engine, Multi Video Engine, dan Content Library bisa diklik untuk membuka modal detail caption, copy, edit, dan save to library.

## Tombol yang sudah aktif

- Lihat Lebih Banyak
- Filter Kategori
- Add to TikTok Showcase
- Create Content
- Create Campaign
- Generate Script
- Change Content Type
- Change Story Mode
- Generate Multi Video
- Edit
- Save All to Library
- Schedule
- Preview Image
- Preview Video

## Flow Product -> Showcase TikTok

1. User memilih produk di Product Intelligence.
2. User klik Add to TikTok Showcase.
3. Sistem menyimpan konteks produk.
4. Jika TikTok account belum connected, sistem menampilkan:
   `TikTok Shop API belum terhubung. Produk belum bisa ditambahkan ke Showcase.`
5. Status showcase menjadi NOT_CONNECTED sampai OAuth/API TikTok tersedia.

## Flow Multi Video -> Content Library

1. User memilih jumlah video 1 sampai 30.
2. User klik Generate Multi Video.
3. Sistem membuat preview card untuk tiap video berdasarkan aspect ratio, resolution, duration, dan generator.
4. User klik Save All to Library untuk menyimpan item video draft.
5. Sistem menyimpan item dengan source label Multi Video Engine, source code MULTI_VIDEO_ENGINE, dan status DRAFT.
6. Content Library membaca generated library fallback dari browser storage dan menampilkan item tanpa menu baru.
7. User klik Schedule untuk membuka modal schedule draft dengan platform, akun, tanggal, dan jam. Scheduler tetap fallback sampai API posting aktif.

## Menu isolation

- `/produk-affiliate` hanya merender Product Intelligence.
- `/buat-konten` dan `/content-factory` hanya merender Content Factory.
- `/story-engine` hanya merender Story Engine.
- `/multi-video-engine` hanya merender Multi Video Engine.
- `/content-library` hanya merender Content Library.
- Dashboard utama hanya berisi ringkasan/navigasi dan tidak merender seluruh modul workflow dalam satu halaman panjang.

## Status provider image/video

- Provider real image/video belum dianggap connected.
- UI Multi Video Engine menampilkan satu preview video besar, product title, duration, platform badge, aspect ratio, resolution, generator, status Draft/Generating/Ready/Failed, dan progress bar saat generating.
- Jika provider image/video production sudah mengirim `imageThumbnailUrl` atau `videoThumbnailUrl`, preview card akan menampilkan thumbnail asli/frame video.
- Prompt image dan video tetap tersedia agar siap dikirim ke Nano Banana/Veo 3 ketika provider aktif.

## Known limitations

- TikTok Showcase belum push produk ke TikTok karena OAuth/API TikTok Shop belum aktif.
- Generated Content Library fallback masih memakai browser storage untuk workflow lokal.
- Real media URL baru bisa tampil setelah provider image/video production terhubung.
