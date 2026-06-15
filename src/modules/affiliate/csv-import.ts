import { AffiliateProduct, CompetitionLevel } from "./types";

export const requiredCsvColumns = [
  "productName",
  "category",
  "price",
  "commissionRate",
  "salesScore",
  "competitionLevel",
  "productUrl",
  "imageUrl",
  "rating",
  "reviewCount",
  "targetAudience",
  "mainBenefit",
  "problemSolved",
  "demoIdea",
  "notes"
] as const;

export const SAMPLE_PRODUCT_CSV = [
  requiredCsvColumns.join(","),
  "Sample mini chopper,Dapur,149000,12,72,medium,https://example.com/sample-mini-chopper,https://example.com/image-1.jpg,4.6,120,Ibu rumah tangga,Memotong bumbu lebih cepat,Ribet cincang bawang,Tunjukkan bawang dicincang dalam beberapa detik,Sample only - not TikTok Shop API data",
  "Sample desk organizer,Home Office,89000,15,68,low,https://example.com/sample-desk-organizer,https://example.com/image-2.jpg,4.7,86,Pekerja kantoran,Meja lebih rapi,Kabel dan alat tulis berantakan,Before-after meja kerja,Sample only - not TikTok Shop API data",
  "Sample portable blender,Dapur,199000,10,75,medium,https://example.com/sample-portable-blender,https://example.com/image-3.jpg,4.5,210,Kaum rebahan,Bikin minuman praktis,Malas cuci blender besar,Demo smoothie satu porsi,Sample only - not TikTok Shop API data",
  "Sample hijab travel pouch,Fashion,59000,18,64,low,https://example.com/sample-hijab-pouch,https://example.com/image-4.jpg,4.8,55,Mahasiswa,Bawa hijab cadangan lebih rapi,Hijab kusut di tas,Tunjukkan isi pouch sebelum-sesudah,Sample only - not TikTok Shop API data",
  "Sample cable clips,Aksesoris,25000,20,58,low,https://example.com/sample-cable-clips,https://example.com/image-5.jpg,4.4,310,General TikTok Audience,Kabel tidak jatuh dari meja,Kabel charger sering hilang,Demo tempel di meja,Sample only - not TikTok Shop API data",
  "Sample lunch box set,Dapur,78000,13,70,medium,https://example.com/sample-lunch-box,https://example.com/image-6.jpg,4.6,145,Ibu rumah tangga,Bekal lebih praktis,Wadah bekal bocor,Tunjukkan kompartemen dan tutup,Sample only - not TikTok Shop API data",
  "Sample phone tripod,Creator,99000,16,80,high,https://example.com/sample-phone-tripod,https://example.com/image-7.jpg,4.7,500,Creator faceless,Rekam video lebih stabil,Susah rekam sendiri,Demo setup video produk,Sample only - not TikTok Shop API data",
  "Sample makeup sponge holder,Beauty,35000,17,62,low,https://example.com/sample-sponge-holder,https://example.com/image-8.jpg,4.5,77,Affiliate pemula,Alat makeup lebih higienis,Sponge basah tercecer,Before-after meja rias,Sample only - not TikTok Shop API data",
  "Sample shoe cleaning brush,Rumah,45000,14,66,medium,https://example.com/sample-shoe-brush,https://example.com/image-9.jpg,4.3,92,Kaum rebahan,Bersihin sepatu lebih mudah,Sepatu cepat kotor,Demo satu sisi sepatu dibersihkan,Sample only - not TikTok Shop API data",
  "Sample foldable hanger,Rumah,69000,12,73,medium,https://example.com/sample-foldable-hanger,https://example.com/image-10.jpg,4.6,134,UMKM,Hemat ruang jemuran,Jemuran sempit,Tunjukkan hanger dibuka dan dilipat,Sample only - not TikTok Shop API data"
].join("\n");

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

function isValidOptionalUrl(value: string) {
  if (!value.trim()) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (const char of line) {
    if (char === "\"") {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

export function validateAndParseCsv(csv: string, now = new Date().toISOString()): CsvImportResult {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { products: [], errors: ["CSV is empty."] };
  }

  const headers = parseCsvLine(lines[0]);
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
    const values = parseCsvLine(line);
    const row = Object.fromEntries(headers.map((header, valueIndex) => [header, values[valueIndex] ?? ""]));
    const price = parseNumber(row.price);
    const commissionRate = parseNumber(row.commissionRate);
    const salesScore = parseNumber(row.salesScore);
    const rating = parseNumber(row.rating ?? "");
    const reviewCount = parseNumber(row.reviewCount ?? "");

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

    if (!isValidOptionalUrl(row.productUrl)) {
      errors.push(`Row ${rowNumber}: productUrl must be a valid URL when filled.`);
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
        salesScore: Number.isNaN(salesScore) ? 50 : Math.max(0, Math.min(100, salesScore)),
        rating: Number.isNaN(rating) ? 0 : rating,
        reviewCount: Number.isNaN(reviewCount) ? 0 : reviewCount,
        competitionLevel: row.competitionLevel as CompetitionLevel,
        productUrl: row.productUrl,
        imageUrl: row.imageUrl,
        targetAudience: row.targetAudience,
        mainBenefit: row.mainBenefit,
        problemSolved: row.problemSolved,
        demoIdea: row.demoIdea,
        notes: row.notes || "Imported from CSV. Sample rows are examples only, not TikTok Shop API data.",
        contentPotential: row.mainBenefit || row.demoIdea ? 82 : 70,
        beginnerFriendliness: row.problemSolved ? 78 : 70,
        createdAt: now,
        updatedAt: now
      });
    }
  });

  return { products, errors };
}
