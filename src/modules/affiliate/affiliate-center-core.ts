import { AffiliateProduct } from "./types";

export type ContentFactoryType = "Product Review" | "Problem Solution" | "Comparison" | "UGC Script" | "Short Video" | "Live Selling Script";
export type StoryMode = "Kids Animation" | "Education" | "Business Story" | "Affiliate Story" | "Islamic Story" | "Motivational Story";
export type GeneratedStatus = "Draft" | "Generated" | "Saved" | "Scheduled";
export type MediaGenerationStatus = "DEMO" | "GENERATING" | "READY" | "FAILED";
export type GeneratedSourceLabel = "Content Factory" | "Story Engine" | "Creative Studio" | "Multi Video Engine";
export type GeneratedSourceCode = "CONTENT_FACTORY" | "STORY_ENGINE" | "CREATIVE_STUDIO" | "MULTI_VIDEO_ENGINE";
export type GeneratedStatusCode = "DRAFT" | "GENERATED" | "SAVED" | "SCHEDULED";
export type ShowcaseStatus = "NOT_CONNECTED" | "PENDING" | "ADDED_TO_SHOWCASE" | "FAILED";
export type VideoAspectRatio = "9:16" | "1:1" | "16:9" | "4:5";
export type VideoResolution = "720x1280" | "1080x1920" | "1080x1080" | "1920x1080" | "1080x1350";
export type VideoDuration = "15 detik" | "30 detik" | "45 detik" | "60 detik" | "90 detik";
export type VideoGenerator = "Veo 3" | "Banana Pro" | "Gemini Video" | "Kling" | "Runway" | "Mock Preview";
export type VideoPlatform = "TikTok" | "Reels" | "Shorts" | "Instagram Feed" | "YouTube Landscape";

export type MultiVideoSettings = {
  platform: VideoPlatform;
  aspectRatio: VideoAspectRatio;
  resolution: VideoResolution;
  duration: VideoDuration;
  generator: VideoGenerator;
};

export type ContentFactoryOutput = {
  contentType: ContentFactoryType;
  hook: string;
  opening: string;
  mainScript: string;
  cta: string;
  caption: string;
  hashtag: string[];
};

export type StoryEngineOutput = {
  mode: StoryMode;
  structure: string;
  hook: string;
  shortScript: string;
  scenePlan: string[];
  imagePrompt: string;
  videoPrompt: string;
  voiceOver: string;
  subtitle: string;
  caption: string;
  hashtag: string[];
  cta: string;
};

export type MultiVideoVariant = {
  id: string;
  title: string;
  duration: VideoDuration;
  platform: VideoPlatform;
  aspectRatio: VideoAspectRatio;
  resolution: VideoResolution;
  generator: VideoGenerator;
  hook: string;
  sceneList: string[];
  imagePrompt: string;
  videoPrompt: string;
  script: string;
  voiceOver: string;
  subtitle: string;
  caption: string;
  hashtag: string[];
  cta: string;
  previewImagePlaceholder: string;
  previewVideoPlaceholder: string;
  imageThumbnailUrl?: string;
  videoThumbnailUrl?: string;
  generationStatus: MediaGenerationStatus;
  generationProgress: number;
  status: GeneratedStatus;
};

export type GeneratedLibraryItem = {
  id: string;
  title: string;
  sourceLabel: GeneratedSourceLabel;
  sourceCode?: GeneratedSourceCode;
  status: GeneratedStatus;
  statusCode?: GeneratedStatusCode;
  type: "TEXT" | "IMAGE" | "VIDEO";
  productName: string;
  platform?: string;
  preview: string;
  imagePrompt?: string;
  videoPrompt?: string;
  tags: string[];
  createdAt: string;
};

export type TikTokShowcaseEntry = {
  productId: string;
  accountId: string;
  platform: "TIKTOK";
  showcaseStatus: ShowcaseStatus;
  message: string;
};

export const generatedContentLibraryKey = "fvn-generated-content-library";

export function getVideoPlatformLabel(platform: VideoPlatform | string) {
  return platform === "TikTok" ? "Short Video" : platform;
}

export function productDisplayLimit(expanded: boolean) {
  return expanded ? 25 : 10;
}

export function addProductToTikTokShowcase(productId: string, accountId?: string, connected?: boolean): TikTokShowcaseEntry;
export function addProductToTikTokShowcase(input: { productId: string; accountId?: string; connected?: boolean }): TikTokShowcaseEntry;
export function addProductToTikTokShowcase(input: string | { productId: string; accountId?: string; connected?: boolean }, accountId?: string, connected?: boolean): TikTokShowcaseEntry {
  const payload = typeof input === "string" ? { productId: input, accountId, connected } : input;

  if (!payload.accountId || !payload.connected) {
    return {
      productId: payload.productId,
      accountId: payload.accountId ?? "",
      platform: "TIKTOK",
      showcaseStatus: "NOT_CONNECTED",
      message: "Platform API belum terhubung. Produk belum bisa ditambahkan ke Showcase."
    };
  }

  return {
    productId: payload.productId,
    accountId: payload.accountId,
    platform: "TIKTOK",
    showcaseStatus: "PENDING",
    message: "Produk masuk antrean Showcase. Siap diarahkan ke Platform API saat koneksi real aktif."
  };
}

export function createContentFactoryOutput(product: AffiliateProduct, contentType: ContentFactoryType): ContentFactoryOutput {
  const benefit = product.mainBenefit || "membantu aktivitas harian jadi lebih praktis";
  const cta = "Cek detail produk dan bandingkan sebelum checkout.";

  if (contentType === "Problem Solution") {
    return {
      contentType,
      hook: `Masalah ini sering muncul: ${product.problemSolved || "produk terasa ribet dipilih"}.`,
      opening: "Buka dengan pain point yang jelas dan dekat dengan keseharian audience.",
      mainScript: `Tampilkan masalah, jelaskan kenapa masalah itu mengganggu, lalu posisikan ${product.productName} sebagai solusi praktis. Tunjukkan demo singkat dan manfaat utama: ${benefit}.`,
      cta,
      caption: `${product.productName} sebagai solusi praktis untuk masalah harian.`,
      hashtag: ["#ProblemSolution", "#AffiliateContent", "#ReviewJujur"]
    };
  }

  if (contentType === "Comparison") {
    return {
      contentType,
      hook: `Pilih yang biasa atau ${product.productName}? Ini bedanya.`,
      opening: "Mulai dengan perbandingan situasi sebelum dan sesudah memakai produk.",
      mainScript: `Bandingkan opsi biasa dengan ${product.productName}: kepraktisan, harga, cara pakai, dan siapa yang paling cocok. Hindari klaim absolut, fokus pada perbedaan yang bisa dilihat.`,
      cta,
      caption: `Comparison singkat ${product.productName} sebelum checkout.`,
      hashtag: ["#ComparisonReview", "#TipsBelanja", "#AffiliateContent"]
    };
  }

  if (contentType === "UGC Script") {
    return {
      contentType,
      hook: `Aku nemu ${product.productName} dan ternyata ini yang paling kepakai.`,
      opening: "Gunakan gaya natural seperti cerita dari pengguna asli.",
      mainScript: `Rekam gaya UGC: unboxing singkat, alasan tertarik, demo pakai, reaksi setelah mencoba, lalu catatan jujur tentang ${product.productName}.`,
      cta,
      caption: `UGC natural untuk ${product.productName}.`,
      hashtag: ["#UGCIndonesia", "#ReviewProduk", "#AffiliateContent"]
    };
  }

  if (contentType === "Short Video") {
    return {
      contentType,
      hook: `${product.productName} dalam 15 detik: masalah, demo, hasil.`,
      opening: "Tampilkan visual paling kuat di detik pertama.",
      mainScript: `Buat script padat: 1 detik hook, 5 detik masalah, 6 detik demo ${product.productName}, 3 detik CTA. Gunakan subtitle pendek dan visual jelas.`,
      cta,
      caption: `Short video cepat untuk ${product.productName}.`,
      hashtag: ["#ShortVideo", "#AffiliateContent", "#ProdukViral"]
    };
  }

  if (contentType === "Live Selling Script") {
    return {
      contentType,
      hook: `Yang baru masuk live, ini fungsi utama ${product.productName}.`,
      opening: "Sapa audience, sebut masalah, lalu demo produk secara berulang.",
      mainScript: `Script live: pembukaan, demo manfaat ${benefit}, jawab keberatan harga/kualitas, ulangi CTA, dan arahkan penonton cek keranjang atau showcase.`,
      cta,
      caption: `Live selling script untuk ${product.productName}.`,
      hashtag: ["#LiveSelling", "#SocialCommerce", "#AffiliateContent"]
    };
  }

  return {
    contentType,
    hook: `${product.productName} ini layak dicek kalau kamu butuh solusi praktis.`,
    opening: "Tampilkan produk di 3 detik pertama dan sebutkan masalah yang diselesaikan.",
    mainScript: `Review fitur utama ${product.productName}, tunjukkan cara pakai, jelaskan manfaat ${benefit}, lalu beri catatan objektif agar review terasa kredibel.`,
    cta,
    caption: `Review cepat ${product.productName}. Cek manfaat, cara pakai, dan pertimbangkan sebelum membeli.`,
    hashtag: ["#VideoReview", "#ReviewProduk", "#AffiliateContent"]
  };
}

export function createStoryEngineOutput(product: AffiliateProduct, mode: StoryMode): StoryEngineOutput {
  const cta = mode === "Affiliate Story" ? "Cek detail produk lewat showcase atau link affiliate." : "Simpan dan lanjutkan kalau insight ini relevan.";
  const structures: Record<StoryMode, Pick<StoryEngineOutput, "structure" | "hook" | "shortScript" | "scenePlan" | "voiceOver" | "subtitle">> = {
    "Affiliate Story": {
      structure: "Problem -> Product Discovery -> Benefit -> Proof -> CTA",
      hook: `Masalah kecil ini sering bikin orang butuh ${product.productName}.`,
      shortScript: `Problem: ${product.problemSolved}. Product Discovery: ${product.productName}. Benefit: ${product.mainBenefit}. Proof: demo ringan. CTA: cek detail.`,
      scenePlan: ["Problem audience", "Product discovery", "Benefit demo", "Proof visual", "CTA"],
      voiceOver: `Awalnya masalah ini terasa sepele. Lalu ${product.productName} muncul sebagai solusi praktis. Lihat manfaatnya, cek buktinya, lalu putuskan dengan bijak.`,
      subtitle: "Problem -> Product Discovery -> Benefit -> Proof -> CTA"
    },
    "Education": {
      structure: "Question -> Explanation -> Example -> Lesson -> CTA",
      hook: `Kenapa ${product.category} seperti ${product.productName} sering dibutuhkan?`,
      shortScript: `Question: apa masalahnya? Explanation: jelaskan konsepnya. Example: pakai ${product.productName}. Lesson: prinsip memilih. CTA: simpan.`,
      scenePlan: ["Question", "Explanation", "Example", "Lesson", "CTA"],
      voiceOver: `Pernah bertanya kenapa produk ini penting? Mulai dari konsepnya, lihat contoh sederhana, ambil pelajarannya, lalu cek detail.`,
      subtitle: "Question -> Explanation -> Example -> Lesson -> CTA"
    },
    "Business Story": {
      structure: "Problem Market -> Opportunity -> Strategy -> Result -> CTA",
      hook: "Masalah market kecil bisa jadi peluang kalau dibaca dengan benar.",
      shortScript: `Problem Market: gap kategori ${product.category}. Opportunity: kebutuhan audience. Strategy: konten produk. Result: testing realistis. CTA: evaluasi.`,
      scenePlan: ["Problem Market", "Opportunity", "Strategy", "Result", "CTA"],
      voiceOver: "Di balik masalah market selalu ada sinyal. Baca peluangnya, susun strategi, ukur hasilnya, lalu ambil langkah berikutnya.",
      subtitle: "Problem Market -> Opportunity -> Strategy -> Result -> CTA"
    },
    "Islamic Story": {
      structure: "Opening Wisdom -> Story Lesson -> Moral Value -> Soft CTA",
      hook: "Keputusan yang baik dimulai dari manfaat dan amanah.",
      shortScript: `Opening Wisdom: pilih dengan bijak. Story Lesson: hubungkan kebutuhan. Moral Value: manfaat tanpa berlebihan. Soft CTA: cek detail.`,
      scenePlan: ["Opening Wisdom", "Story Lesson", "Moral Value", "Soft CTA"],
      voiceOver: "Dalam memilih sesuatu, lihat manfaat dan niatnya. Jangan berlebihan, pahami kebutuhannya, lalu ambil keputusan dengan bijak.",
      subtitle: "Opening Wisdom -> Story Lesson -> Moral Value -> Soft CTA"
    },
    "Kids Animation": {
      structure: "Character -> Problem -> Adventure -> Lesson -> Happy Ending",
      hook: "Ada karakter kecil yang punya masalah besar hari ini.",
      shortScript: `Character: tokoh kecil. Problem: bingung. Adventure: mencari solusi. Lesson: belajar. Happy Ending: tutup ceria.`,
      scenePlan: ["Character", "Problem", "Adventure", "Lesson", "Happy Ending"],
      voiceOver: "Hari ini si kecil punya tantangan. Ia mencoba, belajar, dan akhirnya menemukan cara yang lebih baik dengan hati gembira.",
      subtitle: "Character -> Problem -> Adventure -> Lesson -> Happy Ending"
    },
    "Motivational Story": {
      structure: "Pain Point -> Struggle -> Turning Point -> Lesson -> Motivation CTA",
      hook: "Kadang perubahan dimulai dari satu langkah kecil.",
      shortScript: `Pain Point: akui masalah. Struggle: proses. Turning Point: temukan cara. Lesson: ambil pelajaran. Motivation CTA: mulai.`,
      scenePlan: ["Pain Point", "Struggle", "Turning Point", "Lesson", "Motivation CTA"],
      voiceOver: "Tidak semua perubahan datang cepat. Mulai dari masalah, lewati prosesnya, temukan titik balik, dan ambil satu langkah hari ini.",
      subtitle: "Pain Point -> Struggle -> Turning Point -> Lesson -> Motivation CTA"
    }
  };
  const base = structures[mode];

  return {
    mode,
    ...base,
    imagePrompt: `Vertical 9:16 image prompt for ${product.productName}, ${mode}, clean focal point, readable subtitle space.`,
    videoPrompt: `Vertical short video for ${product.productName}. Use ${base.structure}. Natural motion, product-safe claims, subtitle-safe framing.`,
    caption: `${product.productName}: ${base.structure}.`,
    hashtag: [`#${product.category.replace(/[^a-z0-9]+/gi, "") || "Affiliate"}`, "#FVNAffiliate", "#AffiliateContent"],
    cta
  };
}

export function createMultiVideoVariants(product: AffiliateProduct, count: number, story?: StoryEngineOutput, settings?: Partial<MultiVideoSettings>): MultiVideoVariant[] {
  const bounded = Math.min(30, Math.max(1, Math.floor(count)));
  const durations: VideoDuration[] = settings?.duration ? [settings.duration] : ["15 detik", "30 detik", "45 detik", "60 detik", "90 detik"];
  const platforms: VideoPlatform[] = settings?.platform ? [settings.platform] : ["TikTok", "Reels", "Shorts"];
  const aspectRatio = settings?.aspectRatio ?? "9:16";
  const resolution = settings?.resolution ?? "1080x1920";
  const generator = settings?.generator ?? "Mock Preview";
  const scenes = story?.scenePlan?.length ? story.scenePlan : ["Hook", "Problem", "Demo product", "Benefit", "CTA"];

  return Array.from({ length: bounded }, (_, index) => {
    const duration = durations[index % durations.length];
    const platform = platforms[index % platforms.length];
    const platformLabel = getVideoPlatformLabel(platform);
    const title = `${product.productName} - ${platformLabel} ${duration} ${aspectRatio} #${index + 1}`;
    const imagePrompt = `Preview image for ${title}, aspect ratio ${aspectRatio}, resolution ${resolution}, product focal point, clean text-safe composition, generator ${generator}.`;
    const videoPrompt = `Generate ${duration} ${platformLabel} video for ${product.productName} using ${generator}. Aspect ratio ${aspectRatio}, resolution ${resolution}. Scenes: ${scenes.join(" | ")}.`;
    return {
      id: `multi-video-${product.id}-${index + 1}`,
      title,
      duration,
      platform,
      aspectRatio,
      resolution,
      generator,
      hook: story?.hook ?? `${product.productName}: lihat solusi singkat sebelum checkout.`,
      sceneList: scenes,
      imagePrompt,
      videoPrompt,
      script: story?.shortScript ?? `${product.productName}: hook, problem, demo, benefit, CTA.`,
      voiceOver: story?.voiceOver ?? `${product.productName}. Mulai dari masalah, tunjukkan solusi, beri contoh singkat, lalu arahkan penonton untuk bertindak.`,
      subtitle: story?.subtitle ?? `${product.productName} | ${duration} | ${platformLabel}`,
      caption: story?.caption ?? `Konsep ${duration} untuk ${product.productName}.`,
      hashtag: story?.hashtag ?? ["#FVNAffiliate", "#AffiliateContent"],
      cta: story?.cta ?? "Cek detail produk sebelum membeli.",
      previewImagePlaceholder: `Mock visual placeholder for ${product.productName}, ${platformLabel}, ${duration}, ${aspectRatio}, ${resolution}.`,
      previewVideoPlaceholder: `Mock Preview for ${product.productName}, ${platformLabel}, ${duration}, ${generator}.`,
      generationStatus: "DEMO",
      generationProgress: 100,
      status: "Draft"
    };
  });
}

export function videosToLibraryItems(product: AffiliateProduct, variants: MultiVideoVariant[], status: GeneratedStatus): GeneratedLibraryItem[] {
  const now = new Date().toISOString();
  const statusCode: Record<GeneratedStatus, GeneratedStatusCode> = {
    Draft: "DRAFT",
    Generated: "GENERATED",
    Saved: "SAVED",
    Scheduled: "SCHEDULED"
  };
  return variants.map((variant) => ({
    id: `${variant.id}-${status.toLowerCase()}`,
    title: variant.title,
    sourceLabel: "Multi Video Engine",
    sourceCode: "MULTI_VIDEO_ENGINE",
    status,
    statusCode: statusCode[status],
    type: "VIDEO",
    productName: product.productName,
    platform: getVideoPlatformLabel(variant.platform),
    preview: `${variant.hook}\n${variant.script}\n${variant.sceneList.join("\n")}\n${variant.caption}\n${variant.aspectRatio} ${variant.resolution} ${variant.generator}`,
    imagePrompt: variant.imagePrompt,
    videoPrompt: variant.videoPrompt,
    tags: [getVideoPlatformLabel(variant.platform), variant.duration, variant.aspectRatio, variant.resolution, variant.generator, "multi-video", ...variant.hashtag],
    createdAt: now
  }));
}

export function readGeneratedLibraryItems(): GeneratedLibraryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(generatedContentLibraryKey) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGeneratedLibraryItems(items: GeneratedLibraryItem[]) {
  if (typeof window === "undefined") return [];
  const next = [...items, ...readGeneratedLibraryItems()];
  window.localStorage.setItem(generatedContentLibraryKey, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("fvn-content-library-updated"));
  return next;
}
