/*
  Warnings:

  - The primary key for the `image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `photo_id` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `photo_location` on the `image` table. All the data in the column will be lost.
  - Added the required column `path` to the `image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "image" DROP CONSTRAINT "image_pkey",
DROP COLUMN "photo_id",
DROP COLUMN "photo_location",
ADD COLUMN     "image_id" SERIAL NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL,
ADD CONSTRAINT "image_pkey" PRIMARY KEY ("image_id");
