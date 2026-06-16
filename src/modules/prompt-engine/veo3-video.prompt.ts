import { PromptInput, ScenePlanItem, Veo3Prompt, Veo3PromptSet, defaultPromptOptions } from "./types";

function videoPrompt(input: PromptInput, title: string, duration: string, action: string, cameraAngle: string, cameraMovement: string, audioDirection: string): Veo3Prompt {
  const { product, options = defaultPromptOptions } = input;
  const style = options.contentMode === "Product Demo" ? "realistic TikTok UGC product demo" : "realistic TikTok affiliate UGC";
  const environment = options.targetAudience === "Ibu Rumah Tangga" ? "bright Indonesian home setting" : "clean everyday Indonesian indoor setting";
  const prompt = [
    `${title}. Main subject: ${product.productName}.`,
    `Product action: ${action}.`,
    `Environment/location: ${environment}.`,
    "Scene composition: vertical TikTok 9:16, product visible in the first 2 seconds, clear space for subtitles.",
    `Camera angle: ${cameraAngle}.`,
    `Camera movement: ${cameraMovement}.`,
    "Lens/optical effect: natural phone camera look, shallow depth of field only for close-ups, no unrealistic effects.",
    "Lighting: soft indoor light or natural morning light, product details clearly visible.",
    `Mood: ${options.tone.toLowerCase()}, helpful, beginner-friendly, not pushy.`,
    "Motion detail: hands demonstrate the product slowly enough to understand.",
    `Audio direction: ${audioDirection}`,
    "Subtitle/on-screen text: Bahasa Indonesia subtitles, short and readable, do not cover the product.",
    `Duration: ${duration}. Aspect ratio: 9:16.`,
    `Style: ${style}.`,
    "Avoid unsupported claims, fake discounts, fake scarcity, or auto-posting language."
  ].join(" ");

  return {
    mainSubject: product.productName,
    productAction: action,
    environmentLocation: environment,
    sceneComposition: "Vertical TikTok 9:16, product visible early, subtitle-safe framing",
    cameraAngle,
    cameraMovement,
    lensOpticalEffect: "Natural phone camera, light depth of field for close-ups",
    lighting: "Natural morning light or soft indoor light",
    mood: `${options.tone}, realistic, helpful`,
    motionDetail: "Clear hand movement and product demo pacing",
    audioDirection,
    subtitleOnScreenTextInstruction: "Use short Bahasa Indonesia subtitles, readable on mobile",
    duration,
    aspectRatio: "9:16",
    style,
    prompt
  };
}

export function buildStructuredScenePlan(input: PromptInput): ScenePlanItem[] {
  const { product, options = defaultPromptOptions } = input;

  return [
    {
      sceneNumber: 1,
      duration: "0-3s",
      visualAction: `Tampilkan problem harian yang relate sebelum ${product.productName} muncul.`,
      voiceOverLine: `Kalau kamu sering ngerasa ini ribet, coba lihat dulu.`,
      onScreenText: "Masalahnya sering kejadian?",
      cameraAngle: "close-up",
      cameraMovement: "handheld ringan",
      productPlacement: "Produk belum dominan, cukup teaser kecil di frame.",
      transitionSuggestion: "Cut cepat ke produk."
    },
    {
      sceneNumber: 2,
      duration: "3-8s",
      visualAction: `Tampilkan ${product.productName} dari dekat dan satu detail utama.`,
      voiceOverLine: `${product.productName} ini menarik karena fungsi utamanya gampang dipahami.`,
      onScreenText: options.contentMode,
      cameraAngle: "medium close-up",
      cameraMovement: "slow push-in",
      productPlacement: "Produk di tengah frame, tangan menunjukkan ukuran/detail.",
      transitionSuggestion: "Match cut ke demo."
    },
    {
      sceneNumber: 3,
      duration: "8-15s",
      visualAction: "Demo cara pakai paling sederhana dan realistis.",
      voiceOverLine: "Yang penting, tunjukin cara pakainya secara jelas, jangan dibuat berlebihan.",
      onScreenText: "Demo singkat",
      cameraAngle: "POV atau overhead shot",
      cameraMovement: "steady handheld",
      productPlacement: "Produk dipakai langsung di konteks harian.",
      transitionSuggestion: "Cut ke hasil atau ringkasan manfaat."
    },
    {
      sceneNumber: 4,
      duration: "15-30s",
      visualAction: "Tampilkan manfaat, batasan, dan alasan produk layak ditest.",
      voiceOverLine: "Kalau kebutuhan kamu mirip, produk ini berpotensi layak dicoba. Tetap cek detail dan review dulu.",
      onScreenText: "Cek detail dulu",
      cameraAngle: "medium shot",
      cameraMovement: "slow pan atau rack focus ke produk",
      productPlacement: "Produk tetap terlihat saat CTA.",
      transitionSuggestion: "End card sederhana dengan CTA keranjang kuning."
    }
  ];
}

export function buildVeo3PromptSet(input: PromptInput, scenes = buildStructuredScenePlan(input)): Veo3PromptSet {
  return {
    masterVideoPrompt: videoPrompt(input, "Master Veo 3 video prompt", "30 seconds", "show problem, product demo, realistic benefit, and soft CTA", "close-up, medium shot, and POV mix", "handheld, slow zoom, pan, and rack focus", "Natural Indonesian voice over, soft background room tone, no music overpowering the voice."),
    shortScenePrompts: scenes.map((scene) => videoPrompt(input, `Scene ${scene.sceneNumber} Veo 3 prompt`, scene.duration, scene.visualAction, scene.cameraAngle, scene.cameraMovement, `Voice over line: ${scene.voiceOverLine}`)),
    productDemoPrompt: videoPrompt(input, "Product demo prompt", "15 seconds", "demonstrate one clear use case from start to result", "overhead shot and close-up", "steady handheld with slow zoom", "Voice over explains steps simply in Bahasa Indonesia."),
    lifestyleUsagePrompt: videoPrompt(input, "Lifestyle usage prompt", "15 seconds", "show the product used naturally in daily Indonesian context", "medium shot", "gentle handheld pan", "Ambient room sound plus natural voice over."),
    openingHookShotPrompt: videoPrompt(input, "Opening hook shot prompt", "3 seconds", "show daily pain point and quick product teaser", "close-up", "quick handheld push-in", "Short punchy Indonesian hook in voice over."),
    closingCtaShotPrompt: videoPrompt(input, "Closing CTA shot prompt", "5 seconds", "show product clearly with soft keranjang kuning CTA", "medium close-up", "slow dolly in", "Soft CTA voice over, no fake urgency.")
  };
}
