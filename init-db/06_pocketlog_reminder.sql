CREATE DATABASE IF NOT EXISTS pocketlog_reminder
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE pocketlog_reminder;

CREATE TABLE IF NOT EXISTS `reminders` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `note` VARCHAR(255) DEFAULT NULL,
    `time_scheduled` TIME NOT NULL,
    `days_active` VARCHAR(255) NOT NULL,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `notification_history` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `reminder_id` VARCHAR(36) DEFAULT NULL,
    `title` VARCHAR(255) NOT NULL,
    `note` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    KEY `reminder_id` (`reminder_id`),
    CONSTRAINT `notification_history_ibfk_1`
        FOREIGN KEY (`reminder_id`) REFERENCES `reminders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
