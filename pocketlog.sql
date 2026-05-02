-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 02 Bulan Mei 2026 pada 20.22
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pocketlog`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `icon_url` varchar(255) DEFAULT NULL,
  `color_hex` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `user_id`, `name`, `icon_url`, `color_hex`) VALUES
('7f2b3e4a-9c1d-4b8f-a2e5-6d7c8b9a0f1e', NULL, 'Transfer', 'ic_swap_horiz', '#9E9E9E');

-- --------------------------------------------------------

--
-- Struktur dari tabel `notification_history`
--

CREATE TABLE `notification_history` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `reminder_id` varchar(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `otp_verifications`
--

CREATE TABLE `otp_verifications` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `target_value` varchar(255) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `register_otps`
--

CREATE TABLE `register_otps` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `reminders`
--

CREATE TABLE `reminders` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `time_scheduled` time NOT NULL,
  `days_active` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `token_blacklist`
--

CREATE TABLE `token_blacklist` (
  `id` int(11) NOT NULL,
  `token_id` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `blacklisted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `token_blacklist`
--

INSERT INTO `token_blacklist` (`id`, `token_id`, `expires_at`, `blacklisted_at`) VALUES
(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzk4MjY2MS1hMjliLTQ2NjctYjAyZC0yMzI2ZWFiNDk3M2QiLCJpYXQiOjE3NzUyMzcwODMsImV4cCI6MTc3NTI0MDY4M30.RbwgiGmLl3P1yUx6VhdhrSrx1QSu04PT13XRQ3zDRZc', '2026-04-03 18:24:43', '2026-04-03 17:27:14'),
(2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzk4MjY2MS1hMjliLTQ2NjctYjAyZC0yMzI2ZWFiNDk3M2QiLCJpYXQiOjE3NzUyMzY3MjQsImV4cCI6MTc3NTg0MTUyNH0.CVnrnChNf-98gYjB2AADw6pjk2ukQetSA-kNp4lcIWI', '2026-04-10 17:18:44', '2026-04-03 17:27:14'),
(3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzk4MjY2MS1hMjliLTQ2NjctYjAyZC0yMzI2ZWFiNDk3M2QiLCJpYXQiOjE3NzUyMzY3MjQsImV4cCI6MTc3NTg0MTUyNH0.CVnrnChNf-98gYjB2AADw6pjk2ukQetSA-kNp4lcIWI', '2026-04-10 17:18:44', '2026-04-13 10:52:00'),
(4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzk4MjY2MS1hMjliLTQ2NjctYjAyZC0yMzI2ZWFiNDk3M2QiLCJpYXQiOjE3NzYwODYwNDAsImV4cCI6MTc3NjA4OTY0MH0.G8jkUeHuGuQahYK-VwUxBbV-EtDVjgeJSKI9fmehBbk', '2026-04-13 14:14:00', '2026-04-13 13:16:04'),
(5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzk4MjY2MS1hMjliLTQ2NjctYjAyZC0yMzI2ZWFiNDk3M2QiLCJpYXQiOjE3NzUyMzY3MjQsImV4cCI6MTc3NTg0MTUyNH0.CVnrnChNf-98gYjB2AADw6pjk2ukQetSA-kNp4lcIWI', '2026-04-10 17:18:44', '2026-04-13 13:16:04'),
(6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzk4MjY2MS1hMjliLTQ2NjctYjAyZC0yMzI2ZWFiNDk3M2QiLCJpYXQiOjE3NzYwODY0NTMsImV4cCI6MTc3NjA5MDA1M30.SLS7rZC1hCmq9uZ3p_3Wwmim3XkYZH2M7tOX_AFW7g0', '2026-04-13 14:20:53', '2026-04-13 13:21:25'),
(7, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzk4MjY2MS1hMjliLTQ2NjctYjAyZC0yMzI2ZWFiNDk3M2QiLCJpYXQiOjE3NzUyMzY3MjQsImV4cCI6MTc3NTg0MTUyNH0.CVnrnChNf-98gYjB2AADw6pjk2ukQetSA-kNp4lcIWI', '2026-04-10 17:18:44', '2026-04-13 13:21:25'),
(8, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzk4MjY2MS1hMjliLTQ2NjctYjAyZC0yMzI2ZWFiNDk3M2QiLCJpYXQiOjE3NzYwODY1MDAsImV4cCI6MTc3NjA5MDEwMH0.CM2BqpBtONf0FncQJZEpo-fiFtHfsIrTyHda8jfCZrM', '2026-04-13 14:21:40', '2026-04-13 13:21:51'),
(9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzk4MjY2MS1hMjliLTQ2NjctYjAyZC0yMzI2ZWFiNDk3M2QiLCJpYXQiOjE3NzUyMzY3MjQsImV4cCI6MTc3NTg0MTUyNH0.CVnrnChNf-98gYjB2AADw6pjk2ukQetSA-kNp4lcIWI', '2026-04-10 17:18:44', '2026-04-13 13:21:51'),
(10, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzk4MjY2MS1hMjliLTQ2NjctYjAyZC0yMzI2ZWFiNDk3M2QiLCJpYXQiOjE3NzYwODg1ODcsImV4cCI6MTc3NjA5MjE4N30.n25_7E4ZQFQIy388TTEHZDV_SI3MaQ001Y7-nYQrOn8', '2026-04-13 14:56:27', '2026-04-13 13:57:45'),
(11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzk4MjY2MS1hMjliLTQ2NjctYjAyZC0yMzI2ZWFiNDk3M2QiLCJpYXQiOjE3NzUyMzY3MjQsImV4cCI6MTc3NTg0MTUyNH0.CVnrnChNf-98gYjB2AADw6pjk2ukQetSA-kNp4lcIWI', '2026-04-10 17:18:44', '2026-04-13 13:57:45'),
(12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzk4MjY2MS1hMjliLTQ2NjctYjAyZC0yMzI2ZWFiNDk3M2QiLCJpYXQiOjE3NzYwODkzNzIsImV4cCI6MTc3NjA5Mjk3Mn0.AIhsAjsM_zaJIDLf4ilmKWLgJgCbxz-rvyFM7IA7iZA', '2026-04-13 15:09:32', '2026-04-13 14:09:41'),
(13, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYzk4MjY2MS1hMjliLTQ2NjctYjAyZC0yMzI2ZWFiNDk3M2QiLCJpYXQiOjE3NzYwODkzNDIsImV4cCI6MTc3NjA5Mjk0Mn0.NFZNQNaN-Ne8b3wwdhv8Bvk6jFmA2Dk4R7r7MTgA4Ng', '2026-04-13 15:09:02', '2026-04-13 14:09:41'),
(14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NzUwMTM2Ny1jNTcwLTRhZjgtOTMwYS05NmI3OThmNGZlYWEiLCJpYXQiOjE3NzYwODk0MDcsImV4cCI6MTc3NjA5MzAwN30.fTR0uUL_4M9JBP2H8WTGwpSY3SvFF9BOr4A3evdB5bE', '2026-04-13 15:10:07', '2026-04-13 14:10:54'),
(15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NzUwMTM2Ny1jNTcwLTRhZjgtOTMwYS05NmI3OThmNGZlYWEiLCJpYXQiOjE3NzYwODk0MDcsImV4cCI6MTc3NjY5NDIwN30.PQL21DKUQ9oqbBZb7rr6CZLppheJZRXzbtFzJWn1L4I', '2026-04-20 14:10:07', '2026-04-13 14:10:54'),
(16, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZTVmOWNhYS02ZTQ2LTRhMzctODdlOC1lMDYxZWVlNTZlYzYiLCJpYXQiOjE3NzYwODk4OTYsImV4cCI6MTc3NjA5MzQ5Nn0.zAikESX7Aaqdfv1vfSRfMbBGVPjX1SA_hGfMa_qkwqE', '2026-04-13 15:18:16', '2026-04-13 14:18:43'),
(17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZTVmOWNhYS02ZTQ2LTRhMzctODdlOC1lMDYxZWVlNTZlYzYiLCJpYXQiOjE3NzYwODk4OTYsImV4cCI6MTc3NjY5NDY5Nn0.G8-Kvwvvk1pJMpjcfZRsu9WnJ3SmV10flD-maPJfeDg', '2026-04-20 14:18:16', '2026-04-13 14:18:43'),
(18, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZTVmOWNhYS02ZTQ2LTRhMzctODdlOC1lMDYxZWVlNTZlYzYiLCJpYXQiOjE3NzYwOTEwNTUsImV4cCI6MTc3NjA5NDY1NX0.sG-gHSz-xL98un-zIf199eBQWS-zDNUojiaPB7Gr25g', '2026-04-13 15:37:35', '2026-04-13 14:37:56'),
(19, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZTVmOWNhYS02ZTQ2LTRhMzctODdlOC1lMDYxZWVlNTZlYzYiLCJpYXQiOjE3NzYwODk4OTYsImV4cCI6MTc3NjY5NDY5Nn0.G8-Kvwvvk1pJMpjcfZRsu9WnJ3SmV10flD-maPJfeDg', '2026-04-20 14:18:16', '2026-04-13 14:37:56'),
(20, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NzUwMTM2Ny1jNTcwLTRhZjgtOTMwYS05NmI3OThmNGZlYWEiLCJpYXQiOjE3NzYxMDIxNDIsImV4cCI6MTc3NjEwNTc0Mn0.KAXn991umy19Q5hlYji-u9etYJ9jJaT2Ht0r7rF52pc', '2026-04-13 18:42:22', '2026-04-13 17:43:03'),
(21, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NzUwMTM2Ny1jNTcwLTRhZjgtOTMwYS05NmI3OThmNGZlYWEiLCJpYXQiOjE3NzYxMDIxNDIsImV4cCI6MTc3NjEwNTc0Mn0.KAXn991umy19Q5hlYji-u9etYJ9jJaT2Ht0r7rF52pc', '2026-04-13 18:42:22', '2026-04-13 17:43:03'),
(22, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyYjhiNDlhNy1mMmM3LTQ0NmUtOWU0Yy00OGQwYTZjMzA2MTkiLCJpYXQiOjE3Nzc1MzE5MDcsImV4cCI6MTc3NzUzNTUwN30.lPno57w1xJcTMNlUc5T-WH-Zm0CwxozDt61KTT5OHhY', '2026-04-30 07:51:47', '2026-04-30 07:07:49'),
(23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyYjhiNDlhNy1mMmM3LTQ0NmUtOWU0Yy00OGQwYTZjMzA2MTkiLCJpYXQiOjE3Nzc1MzE5MDcsImV4cCI6MTc3ODEzNjcwN30.1HW62X_ZRaL9M6WODXu_HQmq1h3ZfmXYWONzO0kiGJ4', '2026-05-07 06:51:47', '2026-04-30 07:07:49');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transactions`
--

CREATE TABLE `transactions` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `type` varchar(20) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `category_id` varchar(36) DEFAULT NULL,
  `from_wallet_id` varchar(36) DEFAULT NULL,
  `to_wallet_id` varchar(36) DEFAULT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `title` varchar(255) NOT NULL,
  `note` text DEFAULT NULL,
  `receipt_image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_identities`
--

CREATE TABLE `user_identities` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `provider` varchar(50) NOT NULL,
  `provider_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_passwords`
--

CREATE TABLE `user_passwords` (
  `user_id` varchar(36) NOT NULL,
  `hashed_password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_settings`
--

CREATE TABLE `user_settings` (
  `user_id` varchar(36) NOT NULL,
  `currency` varchar(10) DEFAULT 'IDR',
  `appearance` varchar(20) DEFAULT 'Light',
  `language` varchar(20) DEFAULT 'English'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `wallets`
--

CREATE TABLE `wallets` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `color_hex` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `notification_history`
--
ALTER TABLE `notification_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `reminder_id` (`reminder_id`);

--
-- Indeks untuk tabel `otp_verifications`
--
ALTER TABLE `otp_verifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `register_otps`
--
ALTER TABLE `register_otps`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `reminders`
--
ALTER TABLE `reminders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `token_blacklist`
--
ALTER TABLE `token_blacklist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_token_id` (`token_id`);

--
-- Indeks untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `from_wallet_id` (`from_wallet_id`),
  ADD KEY `to_wallet_id` (`to_wallet_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `user_identities`
--
ALTER TABLE `user_identities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `user_passwords`
--
ALTER TABLE `user_passwords`
  ADD PRIMARY KEY (`user_id`);

--
-- Indeks untuk tabel `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`user_id`);

--
-- Indeks untuk tabel `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `otp_verifications`
--
ALTER TABLE `otp_verifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `register_otps`
--
ALTER TABLE `register_otps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `token_blacklist`
--
ALTER TABLE `token_blacklist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `notification_history`
--
ALTER TABLE `notification_history`
  ADD CONSTRAINT `notification_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notification_history_ibfk_2` FOREIGN KEY (`reminder_id`) REFERENCES `reminders` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `otp_verifications`
--
ALTER TABLE `otp_verifications`
  ADD CONSTRAINT `otp_verifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `reminders`
--
ALTER TABLE `reminders`
  ADD CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`from_wallet_id`) REFERENCES `wallets` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `transactions_ibfk_4` FOREIGN KEY (`to_wallet_id`) REFERENCES `wallets` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `user_identities`
--
ALTER TABLE `user_identities`
  ADD CONSTRAINT `user_identities_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user_passwords`
--
ALTER TABLE `user_passwords`
  ADD CONSTRAINT `user_passwords_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user_settings`
--
ALTER TABLE `user_settings`
  ADD CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

DELIMITER $$
--
-- Event
--
CREATE DEFINER=`root`@`localhost` EVENT `clean_expired_tokens` ON SCHEDULE EVERY 1 DAY STARTS '2026-04-14 12:17:37' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
  DELETE FROM token_blacklist WHERE expires_at < NOW();
END$$

CREATE DEFINER=`root`@`localhost` EVENT `daily_cleanup_otp` ON SCHEDULE EVERY 1 DAY STARTS '2026-04-28 00:00:00' ON COMPLETION NOT PRESERVE ENABLE COMMENT 'Membersihkan OTP yang sudah luput setiap hari pada waktu trafik' DO BEGIN
    DELETE FROM otp_verifications WHERE expires_at < NOW();
    DELETE FROM register_otps WHERE expires_at < NOW();
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
