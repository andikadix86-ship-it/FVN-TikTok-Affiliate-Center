import { PromptInput, ScenePlanItem, StoryboardItem, StoryboardSet, PreviewVideoMeta, defaultPromptOptions } from "./types";
import { buildStructuredScenePlan, buildVeo3PromptSet } from "./veo3-video.prompt";

function framePrompt(input: PromptInput, scene: ScenePlanItem, title: string) {
  const { product, options = defaultPromptOptions } = input;

  return [
    `Subject: ${product.productName} untuk konten affiliate TikTok.`,
    `Action: ${scene.visualAction}`,
    `Location/Context: konteks Indonesia yang realistis untuk ${options.targetAudience}.`,
    `Composition: vertical 9:16, ${scene.cameraAngle}, produk terlihat jelas, ruang aman untuk subtitle.`,
    `Style: ${options.contentMode}, realistic TikTok UGC production frame.`,
    "Lighting: soft indoor light, detail produk mudah terlihat.",
    `Camera Angle: ${scene.cameraAngle}.`,
    `Product Detail: ${product.category}, tampilkan bentuk dan fungsi tanpa klaim berlebihan.`,
    "Aspect Ratio: 9:16.",
    `Text Overlay: ${scene.onScreenText}.`,
    `Storyboard frame: ${title}.`
  ].join(" ");
}

function placeholder(sceneNumber: number, title: string) {
  return `Storyboard frame ${sceneNumber}: ${title} - vertical 9:16 placeholder.`;
}

export function buildStoryboard(input: PromptInput, scenes: ScenePlanItem[] = buildStructuredScenePlan(input)): StoryboardSet {
  const { product, options = defaultPromptOptions } = input;
  const veoScenePrompts = buildVeo3PromptSet(input, scenes).shortScenePrompts;
  const storyboardScenes: StoryboardItem[] = scenes.map((scene, index) => {
    const title = index === 0
      ? "Opening Hook"
      : index === scenes.length - 1
        ? "CTA Closing"
        : `${options.contentMode} Scene ${scene.sceneNumber}`;

    return {
      sceneNumber: scene.sceneNumber,
      title,
      duration: scene.duration,
      objective: index === 0 ? "Tarik perhatian 3 detik pertama." : index === scenes.length - 1 ? "Arahkan cek detail tanpa memaksa." : "Jelaskan produk lewat visual yang mudah dipahami.",
      visualDescription: scene.visualAction,
      voiceOver: scene.voiceOverLine,
      onScreenText: scene.onScreenText,
      subtitleText: scene.voiceOverLine,
      cameraAngle: scene.cameraAngle,
      cameraMovement: scene.cameraMovement,
      composition: "Vertical 9:16 TikTok frame, product visible, subtitle-safe lower third.",
      lighting: "Soft indoor light / natural morning light.",
      mood: `${options.tone}, realistis, beginner-friendly.`,
      transition: scene.transitionSuggestion,
      productPlacement: scene.productPlacement,
      mediaSourceType: "generated",
      assignedMediaAssets: [],
      nanoBananaImagePrompt: framePrompt(input, scene, title),
      veo3ScenePrompt: veoScenePrompts[index]?.prompt ?? "",
      previewImagePlaceholder: placeholder(scene.sceneNumber, title),
      notes: `Derived from script and scene plan for ${product.productName}. User approval required before posting.`
    };
  });

  return {
    totalDuration: options.duration === "30s" ? "30 seconds" : "15 seconds",
    scenes: storyboardScenes,
    style: options.contentMode,
    aspectRatio: "9:16",
    generatedFromScript: "script15/script30/script60 + structured scene plan",
    generatedAt: new Date().toISOString()
  };
}

export function buildPreviewVideoMeta(storyboard: StoryboardSet, providerMode: "AI" | "TEMPLATE"): PreviewVideoMeta {
  return {
    mode: providerMode === "AI" ? "AI Video Preview" : "Animatic Preview",
    label: providerMode === "AI" ? "AI Video Preview" : "Storyboard Preview / Animatic Preview",
    totalDuration: storyboard.totalDuration,
    aspectRatio: "9:16",
    providerMode,
    currentScene: 1,
    generatedAt: new Date().toISOString(),
    scenes: storyboard.scenes.map((scene) => ({
      sceneNumber: scene.sceneNumber,
      duration: scene.duration,
      subtitleText: scene.subtitleText,
      previewImagePlaceholder: scene.previewImagePlaceholder,
      transition: scene.transition
    }))
  };
}
