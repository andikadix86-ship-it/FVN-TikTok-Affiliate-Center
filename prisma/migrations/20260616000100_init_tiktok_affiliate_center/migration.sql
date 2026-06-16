-- CreateEnum
CREATE TYPE "ProductSource" AS ENUM ('DEMO', 'MANUAL', 'CSV_IMPORT', 'REAL_API');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ProviderMode" AS ENUM ('AI', 'TEMPLATE');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'READY', 'POSTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TikTokOAuthLogStatus" AS ENUM ('SUCCESS', 'ERROR');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'TikTok',
    "category" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "commissionRate" DECIMAL(5,2) NOT NULL,
    "salesScore" INTEGER NOT NULL,
    "soldCount" INTEGER,
    "rating" DECIMAL(3,2),
    "reviewCount" INTEGER,
    "competitionLevel" TEXT NOT NULL,
    "productUrl" TEXT,
    "imageUrl" TEXT,
    "targetAudience" TEXT,
    "problemSolved" TEXT,
    "mainBenefit" TEXT,
    "demoIdea" TEXT,
    "source" "ProductSource" NOT NULL DEFAULT 'MANUAL',
    "notes" TEXT,
    "score" INTEGER NOT NULL,
    "recommendation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPack" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "contentMode" TEXT,
    "targetAudience" TEXT,
    "tone" TEXT,
    "productInsight" TEXT,
    "mainSellingPoint" TEXT,
    "targetAudienceMatch" TEXT,
    "hooks" JSONB NOT NULL,
    "selectedHook" TEXT,
    "script15s" TEXT NOT NULL,
    "script30s" TEXT NOT NULL,
    "scenePlan" JSONB NOT NULL,
    "voiceOverDraft" TEXT,
    "caption" TEXT NOT NULL,
    "captionShort" TEXT,
    "captionMedium" TEXT,
    "captionStorytelling" TEXT,
    "hashtags" JSONB NOT NULL,
    "cta" TEXT NOT NULL,
    "ctaSoft" TEXT,
    "ctaDirect" TEXT,
    "ctaKeranjangKuning" TEXT,
    "safeClaimChecklist" JSONB NOT NULL,
    "editingNotes" JSONB,
    "postingNotes" JSONB,
    "talkingPoints" JSONB,
    "notes" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "providerMode" "ProviderMode" NOT NULL DEFAULT 'TEMPLATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "contentPackId" TEXT,
    "name" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "goal" TEXT NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "dailyPlan" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignPerformance" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "orders" INTEGER NOT NULL DEFAULT 0,
    "revenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostedContent" (
    "id" TEXT NOT NULL,
    "contentPackId" TEXT NOT NULL,
    "campaignId" TEXT,
    "campaignDayNumber" INTEGER,
    "productId" TEXT NOT NULL,
    "tiktokAccountId" TEXT,
    "tiktokVideoUrl" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "accountUsed" TEXT,
    "notes" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "saves" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "orders" INTEGER NOT NULL DEFAULT 0,
    "revenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostedContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TikTokAccount" (
    "id" TEXT NOT NULL,
    "openId" TEXT NOT NULL,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "profileDeepLink" TEXT,
    "accessTokenEncrypted" TEXT,
    "refreshTokenEncrypted" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "refreshExpiresAt" TIMESTAMP(3),
    "tokenStatus" TEXT NOT NULL DEFAULT 'not_stored',
    "scopeStatus" TEXT NOT NULL DEFAULT 'unknown',
    "lastSyncStatus" TEXT NOT NULL DEFAULT 'not_synced',
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TikTokAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TikTokOAuthLog" (
    "id" TEXT NOT NULL,
    "status" "TikTokOAuthLogStatus" NOT NULL,
    "errorCode" TEXT,
    "message" TEXT NOT NULL,
    "safeDetails" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TikTokOAuthLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_source_idx" ON "Product"("source");

-- CreateIndex
CREATE INDEX "Product_score_idx" ON "Product"("score");

-- CreateIndex
CREATE INDEX "ContentPack_productId_idx" ON "ContentPack"("productId");

-- CreateIndex
CREATE INDEX "ContentPack_status_idx" ON "ContentPack"("status");

-- CreateIndex
CREATE INDEX "ContentPack_createdAt_idx" ON "ContentPack"("createdAt");

-- CreateIndex
CREATE INDEX "Campaign_productId_idx" ON "Campaign"("productId");

-- CreateIndex
CREATE INDEX "Campaign_contentPackId_idx" ON "Campaign"("contentPackId");

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");

-- CreateIndex
CREATE INDEX "CampaignPerformance_campaignId_idx" ON "CampaignPerformance"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignPerformance_campaignId_dayNumber_key" ON "CampaignPerformance"("campaignId", "dayNumber");

-- CreateIndex
CREATE INDEX "PostedContent_contentPackId_idx" ON "PostedContent"("contentPackId");

-- CreateIndex
CREATE INDEX "PostedContent_campaignId_idx" ON "PostedContent"("campaignId");

-- CreateIndex
CREATE INDEX "PostedContent_productId_idx" ON "PostedContent"("productId");

-- CreateIndex
CREATE INDEX "PostedContent_postedAt_idx" ON "PostedContent"("postedAt");

-- CreateIndex
CREATE INDEX "PostedContent_archived_idx" ON "PostedContent"("archived");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokAccount_openId_key" ON "TikTokAccount"("openId");

-- CreateIndex
CREATE INDEX "TikTokOAuthLog_status_idx" ON "TikTokOAuthLog"("status");

-- CreateIndex
CREATE INDEX "TikTokOAuthLog_createdAt_idx" ON "TikTokOAuthLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AppSetting_key_key" ON "AppSetting"("key");

-- AddForeignKey
ALTER TABLE "ContentPack" ADD CONSTRAINT "ContentPack_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_contentPackId_fkey" FOREIGN KEY ("contentPackId") REFERENCES "ContentPack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignPerformance" ADD CONSTRAINT "CampaignPerformance_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostedContent" ADD CONSTRAINT "PostedContent_contentPackId_fkey" FOREIGN KEY ("contentPackId") REFERENCES "ContentPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostedContent" ADD CONSTRAINT "PostedContent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostedContent" ADD CONSTRAINT "PostedContent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostedContent" ADD CONSTRAINT "PostedContent_tiktokAccountId_fkey" FOREIGN KEY ("tiktokAccountId") REFERENCES "TikTokAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
