import { AppShell } from "@/components/app-shell";

const guides = [
  ["Mulai dari nol", "Pilih produk, buat draft konten, simpan ke library, lalu jadwalkan posting manual."],
  ["Cara cari produk", "Buka Product Intelligence, gunakan filter kategori, lalu pilih produk dengan peluang terbaik."],
  ["Cara buat konten", "Buka Content Factory, pilih template, generate hook, script, caption, hashtag, dan CTA."],
  ["Cara buat story", "Kirim draft ke Story Engine untuk menyusun storyline, scene plan, voice over, dan subtitle."],
  ["Cara jadwalkan", "Pilih konten dari Content Library, atur tanggal/jam, lalu upload manual ke platform."],
  ["Cara baca profit", "Input views, klik, order, dan revenue manual, lalu cek Profit Center dan Analytics."]
];

const faqs = [
  ["Apakah aplikasi auto-post ke platform?", "Belum. MVP ini membantu persiapan dan tracking manual."],
  ["Apakah data produk selalu dari marketplace resmi?", "Tidak. Data bisa berupa Data Contoh, Data Tersimpan, Data Marketplace, atau Data Partner jika API resmi sudah terhubung."],
  ["Kalau AI provider belum aktif?", "Content Factory tetap memakai Template Mode."]
];

export default function TutorialPanduanPage() {
  return (
    <AppShell>
      <section className="space-y-5">
        <div className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-wide text-violet-600">Tutorial & Panduan</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Panduan Pemula Affiliate</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Ikuti alur sederhana dari cari produk sampai evaluasi profit tanpa mencampur menu kerja.</p>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {guides.map(([title, description]) => (
            <article key={title} className="rounded-[1.5rem] border border-line bg-white p-4">
              <h2 className="text-base font-black text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
            </article>
          ))}
        </div>
        <section className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-ink">FAQ</h2>
          <div className="mt-4 grid gap-3">
            {faqs.map(([question, answer]) => (
              <div key={question} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-black text-ink">{question}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{answer}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </AppShell>
  );
}
