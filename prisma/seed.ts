import { PrismaClient, ProductSource } from "@prisma/client";
import { sampleProducts } from "../src/modules/affiliate/sample-products";
import { scoreProduct } from "../src/modules/scoring/score-product";

const prisma = new PrismaClient();

async function main() {
  for (const product of sampleProducts) {
    const score = scoreProduct(product);

    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        productName: product.productName,
        platform: product.platform,
        category: product.category,
        price: product.price,
        commissionRate: product.commissionRate,
        salesScore: product.salesScore,
        soldCount: product.soldCount,
        rating: product.rating,
        reviewCount: product.reviewCount,
        competitionLevel: product.competitionLevel,
        productUrl: product.productUrl,
        imageUrl: product.imageUrl,
        targetAudience: product.targetAudience,
        problemSolved: product.problemSolved,
        mainBenefit: product.mainBenefit,
        demoIdea: product.demoIdea,
        source: ProductSource.DEMO,
        notes: product.notes,
        score: score.total,
        recommendation: score.recommendation
      },
      create: {
        id: product.id,
        productName: product.productName,
        platform: product.platform,
        category: product.category,
        price: product.price,
        commissionRate: product.commissionRate,
        salesScore: product.salesScore,
        soldCount: product.soldCount,
        rating: product.rating,
        reviewCount: product.reviewCount,
        competitionLevel: product.competitionLevel,
        productUrl: product.productUrl,
        imageUrl: product.imageUrl,
        targetAudience: product.targetAudience,
        problemSolved: product.problemSolved,
        mainBenefit: product.mainBenefit,
        demoIdea: product.demoIdea,
        source: ProductSource.DEMO,
        notes: product.notes,
        score: score.total,
        recommendation: score.recommendation
      }
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
