-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 14 Apr 2026 pada 07.18
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
  `type` varchar(20) NOT NULL,
  `icon_url` varchar(255) DEFAULT NULL,
  `color_hex` varchar(10) DEFAULT NULL
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
(21, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NzUwMTM2Ny1jNTcwLTRhZjgtOTMwYS05NmI3OThmNGZlYWEiLCJpYXQiOjE3NzYxMDIxNDIsImV4cCI6MTc3NjEwNTc0Mn0.KAXn991umy19Q5hlYji-u9etYJ9jJaT2Ht0r7rF52pc', '2026-04-13 18:42:22', '2026-04-13 17:43:03');

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

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `gender`, `DOB`, `email`, `avatar_url`, `created_at`) VALUES
('0c982661-a29b-4667-b02d-2326eab4973d', 'Owen', 'Male', '2003-07-24', 'Owenn@gmail.com', '', '2026-04-02 16:55:55'),
('4049a9ee-2e90-11f1-98b5-3c7c3fec23a4', 'Linus', 'Male', '2026-04-15', 'wijayaoeymarcelinus@gmail.com', NULL, '2026-04-02 12:34:07'),
('6fa45bfc-1bd6-4656-8cc6-a115e039f5ff', 'Albert', 'Male', '2006-04-02', 'wilsonalbert@gmail.com', '', '2026-04-02 16:50:01'),
('77501367-c570-4af8-930a-96b798f4feaa', 'Owenias', 'Male', '2003-07-04', 'Owennias@gmail.com', '', '2026-04-13 10:38:29'),
('8e5f9caa-6e46-4a37-87e8-e061eee56ec6', 'Maruseru Rinusu', NULL, NULL, 'rinusu123@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocKuVLTNr1CVNNPrPGHoxBgGn2YkMvH52auWqxpGUf9llNQApA=s96-c', '2026-04-13 10:50:53'),
('ac9dde04-1570-4d1d-882a-d69a74624a14', 'Oweniass', 'Male', '2003-07-04', 'Owenniass@gmail.com', '', '2026-04-13 13:14:13'),
('cb3735de-5ce2-40b2-94de-cfad422ae928', 'Owenia', 'Male', '2003-07-04', 'Owennia@gmail.com', '', '2026-04-03 16:04:05'),
('ce20641b-e427-49a4-9f67-ef4afa9f572a', 'Albertus', 'Male', '2006-07-02', 'wilsonalbertus@gmail.com', '', '2026-04-02 16:51:16');

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

--
-- Dumping data untuk tabel `user_identities`
--

INSERT INTO `user_identities` (`id`, `user_id`, `provider`, `provider_id`) VALUES
('166398c5-7202-4656-9b7c-ab5f6dfa2493', '8e5f9caa-6e46-4a37-87e8-e061eee56ec6', 'google', '108553418755461759779');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_passwords`
--

CREATE TABLE `user_passwords` (
  `user_id` varchar(36) NOT NULL,
  `hashed_password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user_passwords`
--

INSERT INTO `user_passwords` (`user_id`, `hashed_password`) VALUES
('0c982661-a29b-4667-b02d-2326eab4973d', '$2b$11$DGQ67DYvLJTrcO.AVjYrbupZSsDFsXmPdRUkrJjarIjloHLdEplxG'),
('4049a9ee-2e90-11f1-98b5-3c7c3fec23a4', 'abcd1234'),
('77501367-c570-4af8-930a-96b798f4feaa', '$2b$11$Okw/vaR1SYTw5GLn7gIwvOOWkPGccxPkhqteABKMytwmJgb6J0UL6'),
('ac9dde04-1570-4d1d-882a-d69a74624a14', '$2b$11$XWBOF.zTm3fWSIG/jLMCLePnxilpG3bTvG4R6HxdxolIVECaGM5NK'),
('cb3735de-5ce2-40b2-94de-cfad422ae928', '$2b$11$nmc0DnZ2rAAptKvVVs95Du6L/BKZGhxFgw/VqYj9HkmuCDkbHQe2i');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_settings`
--

CREATE TABLE `user_settings` (
  `user_id` varchar(36) NOT NULL,
  `currency` varchar(10) DEFAULT 'IDR',
  `appearance` varchar(20) DEFAULT 'Light',
  `language` varchar(20) DEFAULT 'English',
  `notifications_enabled` tinyint(1) DEFAULT 1
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
-- AUTO_INCREMENT untuk tabel `token_blacklist`
--
ALTER TABLE `token_blacklist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
