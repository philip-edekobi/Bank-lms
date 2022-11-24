/*
  Warnings:

  - A unique constraint covering the columns `[loan_name]` on the table `loan_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `loan_types_loan_name_key` ON `loan_types`(`loan_name`);
