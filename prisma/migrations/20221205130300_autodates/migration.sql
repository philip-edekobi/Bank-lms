-- AlterTable
ALTER TABLE `loans` MODIFY `start_date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `due_date` DATE NOT NULL DEFAULT '2025-12-30';
