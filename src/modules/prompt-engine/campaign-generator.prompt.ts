import { CampaignDuration, CampaignGoal } from "@/modules/campaign/performance";
import { buildCaptionMedium } from "./caption-generator.prompt";
import { buildCtaDirect, buildCtaKeranjangKuning, buildCtaSoft } from "./cta-generator.prompt";
import { buildHashtags } from "./hashtag-generator.prompt";
import { buildHooks } from "./hook-generator.prompt";
import { buildScenePlan } from "./scene-plan.prompt";
import { CampaignDayPlan, contentModes, PromptInput, ContentMode, defaultPromptOptions } from "./types";

const campaignAngles = [
  "Problem harian",
  "Demo hasil",
  "Before-after realistis",
  "Review natural",
  "Unboxing singkat",
  "Comparison value",
  "Tutorial pemakaian",
  "Daily use",
  "Budget find",
  "FAQ komentar",
  "Objection handling",
  "Soft selling recap",
  "Hard selling terukur",
  "Best angle recap"
];

export function buildCampaignPlan(input: PromptInput, duration: CampaignDuration, goal: CampaignGoal): CampaignDayPlan[] {
  const hooks = buildHooks(input);
  const scenes = buildScenePlan(input);
  const hashtags = buildHashtags(input);
  const ctas = [buildCtaSoft(), buildCtaDirect(), buildCtaKeranjangKuning()];

  return Array.from({ length: duration }, (_, index) => {
    const contentMode = contentModes[index % contentModes.length] as ContentMode;
    const angle = campaignAngles[index % campaignAngles.length];

    return {
      day: index + 1,
      contentMode,
      angle,
      hook: hooks[index % hooks.length],
      scriptIdea: `${contentMode}: ${scenes[index % scenes.length]} Fokus goal: ${goal}. Tunjukkan produk lebih awal dan jangan overclaim.`,
      caption: `${buildCaptionMedium({ ...input, options: { ...(input.options ?? defaultPromptOptions), contentMode } })} Hari ${index + 1}: ${angle}.`,
      cta: ctas[index % ctas.length],
      hashtagGroup: hashtags.slice(index % 3, index % 3 + 5),
      postingNote: index < 5 ? "Tes hook berbeda dan balas komentar awal." : "Pakai data performa untuk ubah hook, CTA, demo, atau produk."
    };
  });
}

export function buildSevenDayCampaign(input: PromptInput) {
  return buildCampaignPlan(input, 7, "testing product");
}
