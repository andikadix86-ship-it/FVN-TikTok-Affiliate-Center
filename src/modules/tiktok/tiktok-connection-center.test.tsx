import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { buildDisconnectedAccountView } from "./account-service";
import { TikTokConnectionCenter } from "./tiktok-connection-center";

describe("TikTokConnectionCenter", () => {
  it("renders demo connected mode when TikTok OAuth is not configured", () => {
    const html = renderToStaticMarkup(
      <TikTokConnectionCenter
        account={buildDisconnectedAccountView()}
        apiConfigured={false}
        loginConnected={false}
        startFlow
      />
    );

    expect(html).toContain("Connect Platform");
    expect(html).toContain("Authorize Demo");
    expect(html).toContain("Platform API Not Connected");
    expect(html).toContain("Demo Creator Account");
    expect(html).toContain("@fvn_demo_creator");
    expect(html).toContain("Connected (Demo)");
  });
});
