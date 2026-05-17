CREATE DATABASE IF NOT EXISTS pocketlog_transaction
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE pocketlog_transaction;

CREATE TABLE IF NOT EXISTS `transactions` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `amount` DECIMAL(15,2) NOT NULL,
    `category_id` VARCHAR(36) DEFAULT NULL,
    `from_wallet_id` VARCHAR(36) DEFAULT NULL,
    `to_wallet_id` VARCHAR(36) DEFAULT NULL,
    `transaction_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `title` VARCHAR(255) NOT NULL,
    `note` TEXT DEFAULT NULL,
    `receipt_image_url` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    KEY `category_id` (`category_id`),
    KEY `from_wallet_id` (`from_wallet_id`),
    KEY `to_wallet_id` (`to_wallet_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
