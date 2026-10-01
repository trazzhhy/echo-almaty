-- AlterTable: additive only, existing labelRu/labelKk values are untouched.
ALTER TABLE "AdBanner" ADD COLUMN "labelEn" TEXT NOT NULL DEFAULT '';
