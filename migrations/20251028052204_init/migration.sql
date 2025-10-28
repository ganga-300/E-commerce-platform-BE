/*
  Warnings:

  - You are about to drop the column `productId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_productId_fkey`;

-- DropIndex
DROP INDEX `Order_productId_fkey` ON `Order`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `productId`,
    DROP COLUMN `quantity`;

-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `price` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `name`,
    ADD COLUMN `userName` VARCHAR(191) NOT NULL;
