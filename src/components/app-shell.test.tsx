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

    expect(html).toContain("Produk Affiliate");
    expect(html).toContain("Buat Konten");
    expect(html).toContain("Draft Konten");
    expect(html).toContain("Rencana Posting");
    expect(html).toContain("Konten Terposting");
    expect(html).toContain("Akun TikTok");
    expect(html).toContain("Pengaturan");
    expect(html).toContain("Produk");
    expect(html).toContain("Konten");
    expect(html).toContain("Draft");
    expect(html).toContain("Campaign");
    expect(html).toContain("Posting");
    expect(html).toContain("/#product-hunter");
    expect(html).toContain("/#settings");
  });
});
