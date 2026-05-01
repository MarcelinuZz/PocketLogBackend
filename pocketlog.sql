-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 01 Bulan Mei 2026 pada 14.11
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
('04105732-8a8d-494a-b11a-4fb7494e71dd', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'gaming', 'icon ngasal', 'color'),
('469d9642-afc1-460a-8258-5fa550e3cf86', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'playing', 'icon ngasal', 'color'),
('50260480-b34f-4d6e-9596-7f1c1e721f41', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'clubing', 'icon ngasal', 'color'),
('7f2b3e4a-9c1d-4b8f-a2e5-6d7c8b9a0f1e', NULL, 'Transfer', 'ic_swap_horiz', '#9E9E9E'),
('a67e6058-5321-46ae-be5a-5ccfab80fd73', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'education', 'icon ngasal', 'color'),
('f176b232-3a59-4cd3-b2b8-ab528a3839a7', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'Job', 'icon ngasal', 'color'),
('fdc48b42-e8b2-4eba-89b6-6b6cb59a5368', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'sport', 'icon ngasal', 'color');

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

--
-- Dumping data untuk tabel `otp_verifications`
--

INSERT INTO `otp_verifications` (`id`, `user_id`, `otp_code`, `action_type`, `target_value`, `expires_at`, `created_at`) VALUES
(1, '77501367-c570-4af8-930a-96b798f4feaa', '507441', 'change_password', NULL, '2026-04-26 21:30:05', '2026-04-26 14:25:05');

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

--
-- Dumping data untuk tabel `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `type`, `amount`, `category_id`, `from_wallet_id`, `to_wallet_id`, `transaction_date`, `title`, `note`, `receipt_image_url`, `created_at`) VALUES
('3a89244d-68a7-4def-9a8b-40fa28d82509', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'income', 450000.00, '50260480-b34f-4d6e-9596-7f1c1e721f41', NULL, '747e7c56-daf0-4d5e-b666-f45ec10268af', '2026-04-30 02:00:00', 'Gak tauV3', 'Gaji bulan AprilV3', NULL, '2026-04-30 12:32:40'),
('580259dc-e638-49d1-b803-82ec6ecbf216', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'income', 400000.00, 'f176b232-3a59-4cd3-b2b8-ab528a3839a7', NULL, '6fcc255a-2d0c-4bf5-bd8e-d981c94418c8', '2026-04-30 02:00:00', 'Gak tauV2', 'Gaji bulan AprilV2', NULL, '2026-04-30 12:30:43'),
('6dca286f-d74e-4cfa-92f6-a5556f776c76', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'income', 250000.00, '50260480-b34f-4d6e-9596-7f1c1e721f41', NULL, '6fcc255a-2d0c-4bf5-bd8e-d981c94418c8', '2026-04-30 02:00:00', 'Gak tauV3', 'Gaji bulan AprilV3', NULL, '2026-04-30 12:32:06'),
('84d290e7-f2a2-4135-95f4-76733a190be9', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'income', 300000.00, 'f176b232-3a59-4cd3-b2b8-ab528a3839a7', NULL, '747e7c56-daf0-4d5e-b666-f45ec10268af', '2026-04-30 02:00:00', 'Gak tau', 'Gaji bulan April', NULL, '2026-04-30 12:29:06'),
('ae340b63-a119-47b2-9aa2-dc14c8b38e19', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'expense', 75000.00, '469d9642-afc1-460a-8258-5fa550e3cf86', '6fcc255a-2d0c-4bf5-bd8e-d981c94418c8', NULL, '2026-04-30 06:00:00', 'Beli Kopi Spesial', 'Revisi: Ternyata kopinya lebih mahal', NULL, '2026-04-30 12:28:48'),
('cacdda8b-1253-4102-a1fa-96290ba7067d', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'expense', 2000000.00, '50260480-b34f-4d6e-9596-7f1c1e721f41', '747e7c56-daf0-4d5e-b666-f45ec10268af', NULL, '2026-04-30 02:00:00', 'ngurangin', 'Gaji bulan AprilV3', NULL, '2026-04-30 12:33:45'),
('cdd1baee-368a-462a-a4fc-9cf25ae16f02', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'transfer', 250000.00, '7f2b3e4a-9c1d-4b8f-a2e5-6d7c8b9a0f1e', '6fcc255a-2d0c-4bf5-bd8e-d981c94418c8', '747e7c56-daf0-4d5e-b666-f45ec10268af', '2026-04-30 09:00:00', 'Revisi Transfer tabungan', 'Nambahin 50rb', NULL, '2026-04-30 12:36:18'),
('d605a003-4b64-4a18-8d20-9a7a37567c31', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'income', 1500000.00, 'f176b232-3a59-4cd3-b2b8-ab528a3839a7', NULL, '747e7c56-daf0-4d5e-b666-f45ec10268af', '2026-04-30 02:00:00', 'Gaji Bulanan', 'Gaji bulan April', NULL, '2026-04-30 12:28:05');

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
('0c982661-a29b-4667-b02d-2326eab4973d', 'Owen', 'Female', '2003-07-24', 'Owenn@gmail.com', '', '2026-04-02 16:55:55'),
('2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'Linus', 'Male', '2001-04-14', 'wijayaoeymarcelinus@gmail.com', '', '2026-04-26 14:45:17'),
('6fa45bfc-1bd6-4656-8cc6-a115e039f5ff', 'Albert', 'Male', '2006-04-02', 'wilsonalbert@gmail.com', '', '2026-04-02 16:50:01'),
('77501367-c570-4af8-930a-96b798f4feaa', 'OwenZ', 'Female', '2004-07-11', 'Owennias@gmail.com', 'https://airbrush.com/image-enhancer', '2026-04-13 10:38:29'),
('81c58e6c-2327-4c42-82d0-cbacef945ad5', 'rinusu', 'Male', '2001-07-21', 'rinusu123@gmail.com', '', '2026-05-01 10:46:11'),
('ab2cb1f2-bd9a-4721-910c-be632d14f64d', 'Marcelinus Wijaya', NULL, NULL, 'wijayaoeymarcelinus2006@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocJvvo8l9DKVZBOhBizXhkfd4E8xSBUSZSsa9hSqdFPIGLTaLQ=s96-c', '2026-05-01 10:52:09'),
('ac9dde04-1570-4d1d-882a-d69a74624a14', 'Oweniass', 'Male', '2003-07-04', 'Owenniass@gmail.com', '', '2026-04-13 13:14:13'),
('cb3735de-5ce2-40b2-94de-cfad422ae928', 'Owenzz', 'Female', '2004-07-21', 'Owennia@gmail.com', 'https://airbrush.com/image-enhance', '2026-04-03 16:04:05'),
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
('0aa189a0-a918-46d3-9a98-806e88ab2d67', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'google', '101357322244149981937'),
('ae818db8-d397-482b-b180-7113533a888b', 'ab2cb1f2-bd9a-4721-910c-be632d14f64d', 'google', '118223078270721532988');

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
('2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', '$2b$11$PjnFpP7SgOegRPG0IvGQgO/Bzys007IqXwpcGq6aGkMVs.eo/bi.C'),
('77501367-c570-4af8-930a-96b798f4feaa', '$2b$11$Okw/vaR1SYTw5GLn7gIwvOOWkPGccxPkhqteABKMytwmJgb6J0UL6'),
('81c58e6c-2327-4c42-82d0-cbacef945ad5', '$2b$11$AplR6QRYWX/.P7MObtoYAuQKvlqIrakl879Ib20zRzEBXOVPRAB7y'),
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
  `language` varchar(20) DEFAULT 'English'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user_settings`
--

INSERT INTO `user_settings` (`user_id`, `currency`, `appearance`, `language`) VALUES
('81c58e6c-2327-4c42-82d0-cbacef945ad5', 'IDR', 'dark', 'indo'),
('ab2cb1f2-bd9a-4721-910c-be632d14f64d', 'IDR', 'Light', 'English');

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
-- Dumping data untuk tabel `wallets`
--

INSERT INTO `wallets` (`id`, `user_id`, `name`, `account_number`, `balance`, `color_hex`, `created_at`) VALUES
('6fcc255a-2d0c-4bf5-bd8e-d981c94418c8', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'BLU', '2355543645', 325000.00, '#fcba03', '2026-04-30 06:54:28'),
('747e7c56-daf0-4d5e-b666-f45ec10268af', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'BCA', '325367346', 500000.00, '#fcba03', '2026-04-30 07:32:42'),
('9e923da5-9f99-4559-b457-16ccb676cd69', '2b8b49a7-f2c7-446e-9e4c-48d0a6c30619', 'BBA', '123870192831', 0.00, '#j33aa', '2026-04-30 06:53:40');

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
