import { describe, expect, it } from "vitest";
import { sampleProducts } from "@/modules/affiliate/sample-products";
import { buildTemplateContentPack } from "@/modules/prompt-engine/fallback";
import { buildContentPackCreateData, contentPackToInput } from "./content-service";

describe("content pack save logic", () => {
  it("maps generated content pack to Prisma create data", () => {
    const pack = buildTemplateContentPack({ product: sampleProducts[0], mode: "TEMPLATE_MODE" });
    const input = contentPackToInput("product-1", pack, "TEMPLATE");
    const data = buildContentPackCreateData(input);

    expect(data.productId).toBe("product-1");
    expect(data.hooks).toHaveLength(5);
    expect(data.script15s).toContain("0-3s");
    expect(data.providerMode).toBe("TEMPLATE");
  });
});
