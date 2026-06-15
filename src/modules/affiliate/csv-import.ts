import { AffiliateProduct, CompetitionLevel } from "./types";

export const requiredCsvColumns = [
  "productName",
  "category",
  "price",
  "commissionRate",
  "salesScore",
  "competitionLevel",
  "productUrl",
  "imageUrl"
] as const;

export type CsvImportResult = {
  products: AffiliateProduct[];
  errors: string[];
};

function isCompetitionLevel(value: string): value is CompetitionLevel {
  return value === "low" || value === "medium" || value === "high";
}

function parseNumber(value: string) {
  if (value.trim() === "") {
    return NaN;
  }

  return Number(value);
}

export function validateAndParseCsv(csv: string, now = new Date().toISOString()): CsvImportResult {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { products: [], errors: ["CSV is empty."] };
  }

  const headers = lines[0].split(",").map((header) => header.trim());
  const missingColumns = requiredCsvColumns.filter((column) => !headers.includes(column));

  if (missingColumns.length > 0) {
    return {
      products: [],
      errors: [`Missing required columns: ${missingColumns.join(", ")}.`]
    };
  }

  const products: AffiliateProduct[] = [];
  const errors: string[] = [];

  lines.slice(1).forEach((line, index) => {
    const rowNumber = index + 2;
    const values = line.split(",").map((value) => value.trim());
    const row = Object.fromEntries(headers.map((header, valueIndex) => [header, values[valueIndex] ?? ""]));
    const price = parseNumber(row.price);
    const commissionRate = parseNumber(row.commissionRate);
    const salesScore = parseNumber(row.salesScore);

    if (!row.productName) {
      errors.push(`Row ${rowNumber}: productName is required.`);
    }

    if (!row.category) {
      errors.push(`Row ${rowNumber}: category is required.`);
    }

    if (Number.isNaN(price)) {
      errors.push(`Row ${rowNumber}: price must be a number.`);
    }

    if (Number.isNaN(commissionRate)) {
      errors.push(`Row ${rowNumber}: commissionRate must be a number.`);
    }

    if (!isCompetitionLevel(row.competitionLevel)) {
      errors.push(`Row ${rowNumber}: competitionLevel must be low, medium, or high.`);
    }

    const rowHasError = errors.some((error) => error.startsWith(`Row ${rowNumber}:`));

    if (!rowHasError) {
      products.push({
        id: `csv-${Date.now()}-${index}`,
        source: "CSV_IMPORT",
        productName: row.productName,
        platform: "TikTok",
        category: row.category,
        price,
        commissionRate,
        salesScore: Number.isNaN(salesScore) ? 50 : salesScore,
        rating: parseNumber(row.rating ?? "") || 0,
        reviewCount: parseNumber(row.reviewCount ?? "") || 0,
        competitionLevel: row.competitionLevel as CompetitionLevel,
        productUrl: row.productUrl,
        imageUrl: row.imageUrl,
        notes: row.notes || "Imported from CSV.",
        contentPotential: 70,
        beginnerFriendliness: 70,
        createdAt: now,
        updatedAt: now
      });
    }
  });

  return { products, errors };
}
