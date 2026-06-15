import { buildCaption } from "./caption.prompt";
import { buildCta } from "./cta.prompt";
import { buildHooks } from "./hook.prompt";
import { buildScenePlan } from "./script.prompt";
import { PromptInput } from "./types";

export function buildSevenDayCampaign(input: PromptInput) {
  const hooks = buildHooks(input);
  const scenes = buildScenePlan(input);
  const angles = ["Problem/Solution", "Beginner Mistake", "Before/After", "Unboxing", "Comparison", "FAQ", "Final Recommendation"];

  return angles.map((angle, index) => ({
    day: index + 1,
    angle,
    hook: hooks[index % hooks.length],
    scriptIdea: `${angle}: ${scenes[index % scenes.length]} Keep it simple and show the product early.`,
    caption: `${buildCaption(input)} Day ${index + 1}: ${angle}.`,
    cta: buildCta(),
    postingNote: index < 5 ? "Post at a consistent time and reply to early comments." : "Use performance data to adjust hook, angle, CTA, or product choice."
  }));
}
