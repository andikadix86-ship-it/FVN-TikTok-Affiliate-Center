import { describe, expect, it } from "vitest";
import { validateAndParseCsv } from "./csv-import";

describe("CSV import validation", () => {
  it("imports valid rows as CSV_IMPORT products", () => {
    const result = validateAndParseCsv(
      "productName,category,price,commissionRate,salesScore,competitionLevel,productUrl,imageUrl\nDesk Lamp,Home Office,12.5,18,72,low,https://example.com,https://example.com/image.jpg",
      "2026-06-15T00:00:00.000Z"
    );

    expect(result.errors).toEqual([]);
    expect(result.products).toHaveLength(1);
    expect(result.products[0].source).toBe("CSV_IMPORT");
    expect(result.products[0].productName).toBe("Desk Lamp");
  });

  it("returns clear errors for invalid rows", () => {
    const result = validateAndParseCsv(
      "productName,category,price,commissionRate,salesScore,competitionLevel,productUrl,imageUrl\n,,abc,x,70,extreme,https://example.com,https://example.com/image.jpg"
    );

    expect(result.products).toHaveLength(0);
    expect(result.errors).toContain("Row 2: productName is required.");
    expect(result.errors).toContain("Row 2: category is required.");
    expect(result.errors).toContain("Row 2: price must be a number.");
    expect(result.errors).toContain("Row 2: commissionRate must be a number.");
    expect(result.errors).toContain("Row 2: competitionLevel must be low, medium, or high.");
  });
});
