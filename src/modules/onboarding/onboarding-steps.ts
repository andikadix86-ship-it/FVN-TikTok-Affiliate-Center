export const onboardingSteps = [
  "Welcome",
  "Sumber Data",
  "Produk Pertama",
  "Konten Pertama",
  "Campaign Pertama"
] as const;

export type OnboardingStep = (typeof onboardingSteps)[number];

export function getNextOnboardingStep(currentIndex: number) {
  return Math.min(currentIndex + 1, onboardingSteps.length - 1);
}

export function getPreviousOnboardingStep(currentIndex: number) {
  return Math.max(currentIndex - 1, 0);
}
