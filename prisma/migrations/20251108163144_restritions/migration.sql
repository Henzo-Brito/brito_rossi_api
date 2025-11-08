/*
  Warnings:

  - You are about to alter the column `description` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(600)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "description" SET DATA TYPE VARCHAR(600),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(150);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
