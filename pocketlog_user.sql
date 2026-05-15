CREATE DATABASE IF NOT EXISTS pocketlog_user
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE pocketlog_user;

CREATE TABLE IF NOT EXISTS `user_settings` (
    `user_id` VARCHAR(36) NOT NULL,
    `currency` VARCHAR(10) DEFAULT 'IDR',
    `appearance` VARCHAR(20) DEFAULT 'Light',
    `language` VARCHAR(20) DEFAULT 'English',
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
