import { describe, expect, it } from "vitest";
import { getNextOnboardingStep, getPreviousOnboardingStep, onboardingSteps } from "./onboarding-steps";

describe("onboarding step flow", () => {
  it("defines the beginner onboarding steps in order", () => {
    expect(onboardingSteps).toEqual([
      "Welcome",
      "Sumber Data",
      "Produk Pertama",
      "Konten Pertama",
      "Campaign Pertama"
    ]);
  });

  it("moves forward and backward without leaving the flow bounds", () => {
    expect(getNextOnboardingStep(0)).toBe(1);
    expect(getNextOnboardingStep(4)).toBe(4);
    expect(getPreviousOnboardingStep(4)).toBe(3);
    expect(getPreviousOnboardingStep(0)).toBe(0);
  });
});
