import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AppShell } from "./app-shell";

describe("AppShell navigation", () => {
  it("renders Indonesian desktop labels and mobile navigation links", () => {
    const html = renderToStaticMarkup(
      <AppShell>
        <div>content</div>
      </AppShell>
    );

    expect(html).toContain("Product Intelligence");
    expect(html).toContain("Content Factory");
    expect(html).toContain("Story Engine");
    expect(html).toContain("Multi Video Engine");
    expect(html).toContain("Scheduler");
    expect(html).toContain("Content Library");
    expect(html).toContain("AI Agents");
    expect(html).toContain("Profit Center");
    expect(html).toContain("Analytics");
    expect(html).toContain("Tutorial &amp; Panduan");
    expect(html).toContain("Pengaturan");
    expect(html).toContain("Produk");
    expect(html).toContain("Library");
    expect(html).toContain("Jadwal");
    expect(html).toContain("Analisa");
    expect(html).toContain("Cari produk, konten, template...");
    expect(html).toContain("Upgrade");
    expect(html).toContain("Andika");
    expect(html).toContain("Buka akun Andika dan pengaturan TikTok");
    expect(html).toContain("/produk-affiliate");
    expect(html).toContain("/analytics");
    expect(html).toContain("/story-engine");
    expect(html).toContain("/multi-video-engine");
    expect(html).toContain("/ai-agents");
    expect(html).toContain("/profit-center");
    expect(html).toContain("/tutorial-panduan");
    expect(html).toContain("/pengaturan#tiktok-accounts");
    expect(html).toContain("/terms");
    expect(html).toContain("/privacy");
    expect(html).toContain("Terms of Service");
    expect(html).toContain("Privacy Policy");
  });
});
