-- CreateEnum
CREATE TYPE "AdBannerSlot" AS ENUM ('top', 'middle', 'bottom');

-- CreateTable
CREATE TABLE "AdBanner" (
    "slot" "AdBannerSlot" NOT NULL,
    "href" TEXT NOT NULL DEFAULT '/advertising',
    "imageSrc" TEXT NOT NULL DEFAULT '',
    "labelRu" TEXT NOT NULL DEFAULT '',
    "labelKk" TEXT NOT NULL DEFAULT '',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdBanner_pkey" PRIMARY KEY ("slot")
);
