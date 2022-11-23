-- CreateTable
CREATE TABLE `customers` (
    `customer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fname` VARCHAR(25) NOT NULL,
    `lname` VARCHAR(25) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `acc_num` INTEGER NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone_num` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(1) NOT NULL,
    `dob` DATE NOT NULL,

    UNIQUE INDEX `customers_email_key`(`email`),
    UNIQUE INDEX `customers_acc_num_key`(`acc_num`),
    PRIMARY KEY (`customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loans` (
    `loan_id` INTEGER NOT NULL AUTO_INCREMENT,
    `desc` VARCHAR(255) NOT NULL,
    `collateral` VARCHAR(191) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `loan_type_id` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `due_date` DATE NOT NULL,
    `isSettled` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`loan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `admin_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fname` VARCHAR(25) NOT NULL,
    `lname` VARCHAR(25) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `admins_email_key`(`email`),
    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loan_types` (
    `loan_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `loan_name` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(255) NOT NULL,
    `amount` INTEGER NOT NULL,
    `interest` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`loan_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `loans` ADD CONSTRAINT `loans_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`customer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loans` ADD CONSTRAINT `loans_loan_type_id_fkey` FOREIGN KEY (`loan_type_id`) REFERENCES `loan_types`(`loan_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
