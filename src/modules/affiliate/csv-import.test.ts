import { describe, expect, it } from "vitest";
import { requiredCsvColumns, SAMPLE_PRODUCT_CSV, validateAndParseCsv } from "./csv-import";

describe("CSV import validation", () => {
  it("imports valid rows as CSV_IMPORT products", () => {
    const result = validateAndParseCsv(
      `${requiredCsvColumns.join(",")}\nDesk Lamp,Home Office,12.5,18,72,low,https://example.com,https://example.com/image.jpg,4.7,88,Pekerja kantoran,Meja rapi,Kabel berantakan,Before-after meja,Manual sample`,
      "2026-06-15T00:00:00.000Z"
    );

    expect(result.errors).toEqual([]);
    expect(result.products).toHaveLength(1);
    expect(result.products[0].source).toBe("CSV_IMPORT");
    expect(result.products[0].productName).toBe("Desk Lamp");
    expect(result.products[0].targetAudience).toBe("Pekerja kantoran");
  });

  it("returns clear errors for invalid rows", () => {
    const result = validateAndParseCsv(
      `${requiredCsvColumns.join(",")}\n,,abc,x,70,extreme,not-a-url,https://example.com/image.jpg,4.7,88,,,,`
    );

    expect(result.products).toHaveLength(0);
    expect(result.errors).toContain("Row 2: productName is required.");
    expect(result.errors).toContain("Row 2: category is required.");
    expect(result.errors).toContain("Row 2: price must be a number.");
    expect(result.errors).toContain("Row 2: commissionRate must be a number.");
    expect(result.errors).toContain("Row 2: competitionLevel must be low, medium, or high.");
    expect(result.errors).toContain("Row 2: productUrl must be a valid URL when filled.");
  });

  it("ships a 10-row sample CSV marked sample only", () => {
    const result = validateAndParseCsv(SAMPLE_PRODUCT_CSV);

    expect(result.products).toHaveLength(10);
    expect(result.products.every((product) => product.source === "CSV_IMPORT")).toBe(true);
    expect(SAMPLE_PRODUCT_CSV).toContain("Sample only - not TikTok Shop API data");
  });
});
