CREATE DATABASE IF NOT EXISTS pocketlog_category
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE pocketlog_category;

CREATE TABLE IF NOT EXISTS `categories` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) DEFAULT NULL,
    `name` VARCHAR(100) NOT NULL,
    `icon_url` VARCHAR(255) DEFAULT NULL,
    `color_hex` VARCHAR(10) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `categories` (`id`, `user_id`, `name`, `icon_url`, `color_hex`)
VALUES ('7f2b3e4a-9c1d-4b8f-a2e5-6d7c8b9a0f1e', NULL, 'Transfer', 'ic_swap_horiz', '#9E9E9E');
