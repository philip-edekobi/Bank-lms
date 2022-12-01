-- CreateTable
CREATE TABLE `customers` (
    `customer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fname` VARCHAR(25) NOT NULL,
    `lname` VARCHAR(25) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `acc_num` INTEGER NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone_num` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `gender` VARCHAR(1) NULL,
    `dob` DATE NULL,

    UNIQUE INDEX `customers_email_key`(`email`),
    UNIQUE INDEX `customers_acc_num_key`(`acc_num`),
    PRIMARY KEY (`customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loans` (
    `loan_id` INTEGER NOT NULL AUTO_INCREMENT,
    `desc` VARCHAR(255) NOT NULL,
    `collateral` VARCHAR(191) NOT NULL,
    `customer_id` INTEGER NOT NULL,
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

    UNIQUE INDEX `loan_types_loan_name_key`(`loan_name`),
    PRIMARY KEY (`loan_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `account_id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` INTEGER NOT NULL DEFAULT 0,
    `user_acc_num` INTEGER NOT NULL,
    `date_opened` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `accounts_user_acc_num_key`(`user_acc_num`),
    PRIMARY KEY (`account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `loans` ADD CONSTRAINT `loans_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loans` ADD CONSTRAINT `loans_loan_type_id_fkey` FOREIGN KEY (`loan_type_id`) REFERENCES `loan_types`(`loan_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_acc_num_fkey` FOREIGN KEY (`user_acc_num`) REFERENCES `customers`(`acc_num`) ON DELETE RESTRICT ON UPDATE CASCADE;
