CREATE DATABASE IF NOT EXISTS pocketlog_wallet
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE pocketlog_wallet;

CREATE TABLE IF NOT EXISTS `wallets` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `account_number` VARCHAR(50) DEFAULT NULL,
    `balance` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    `color_hex` VARCHAR(10) DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
