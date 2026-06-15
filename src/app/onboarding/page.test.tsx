import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import OnboardingPage from "./page";

describe("Onboarding page", () => {
  it("renders the welcome step and beginner promise", () => {
    const html = renderToStaticMarkup(<OnboardingPage />);

    expect(html).toContain("Mulai Affiliate TikTok dengan Lebih Terarah");
    expect(html).toContain("Cari produk");
    expect(html).toContain("Nilai peluang produk");
    expect(html).toContain("Buat script konten");
    expect(html).toContain("Evaluasi performa");
  });
});
