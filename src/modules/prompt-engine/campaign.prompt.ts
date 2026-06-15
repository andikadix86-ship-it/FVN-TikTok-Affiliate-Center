import { buildCaption } from "./caption.prompt";
import { buildCta } from "./cta.prompt";
import { buildHooks } from "./hook.prompt";
import { buildScenePlan } from "./script.prompt";
import { PromptInput } from "./types";
import { CampaignDuration, CampaignGoal } from "@/modules/campaign/performance";

export function buildCampaignPlan(input: PromptInput, duration: CampaignDuration, goal: CampaignGoal) {
  const hooks = buildHooks(input);
  const scenes = buildScenePlan(input);
  const angles = [
    "Problem/Solution",
    "Beginner Mistake",
    "Before/After",
    "Unboxing",
    "Comparison",
    "FAQ",
    "Final Recommendation",
    "Comment Response",
    "Price Check",
    "Use Case Demo",
    "Pros and Cons",
    "Objection Handling",
    "Second Angle Test",
    "Best Product Recap"
  ];

  return angles.slice(0, duration).map((angle, index) => ({
    day: index + 1,
    angle,
    hook: hooks[index % hooks.length],
    scriptIdea: `${angle}: ${scenes[index % scenes.length]} Focus goal: ${goal}. Keep it simple and show the product early.`,
    caption: `${buildCaption(input)} Day ${index + 1}: ${angle}. Goal: ${goal}.`,
    cta: buildCta(),
    postingNote: index < 5 ? "Post at a consistent time and reply to early comments." : "Use performance data to adjust hook, angle, CTA, or product choice."
  }));
}

export function buildSevenDayCampaign(input: PromptInput) {
  return buildCampaignPlan(input, 7, "testing product");
}
