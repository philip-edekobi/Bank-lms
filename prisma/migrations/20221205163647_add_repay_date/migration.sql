/*
  Warnings:

  - Added the required column `repay_date` to the `loans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loans` ADD COLUMN `repay_date` DATE NOT NULL;
