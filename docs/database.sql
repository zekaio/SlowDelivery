-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- 主机： 127.0.0.1
-- 生成日期： 2019-08-25 18:56:24
-- 服务器版本： 10.4.6-MariaDB
-- PHP 版本： 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `slowdelivery`
--

-- --------------------------------------------------------

--
-- 表的结构 `defaultflag`
--

CREATE TABLE `defaultflag` (
  `id` int(11) NOT NULL,
  `flag` text COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- 表的结构 `flags`
--

CREATE TABLE `flags` (
  `id` int(11) NOT NULL,
  `open_id` text COLLATE utf8mb4_bin NOT NULL,
  `flag` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- 表的结构 `offlinecapsule`
--

CREATE TABLE `offlinecapsule` (
  `id` int(11) NOT NULL,
  `sender_name` text COLLATE utf8mb4_bin NOT NULL,
  `sender_tel` varchar(16) COLLATE utf8mb4_bin NOT NULL,
  `receiver_name` text COLLATE utf8mb4_bin NOT NULL,
  `receiver_tel` varchar(16) COLLATE utf8mb4_bin NOT NULL,
  `receiver_addr` text COLLATE utf8mb4_bin NOT NULL,
  `capsule_tag` text COLLATE utf8mb4_bin NOT NULL,
  `time` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- 表的结构 `timecapsule`
--

CREATE TABLE `timecapsule` (
  `id` int(11) NOT NULL,
  `open_id` text COLLATE utf8mb4_bin NOT NULL,
  `type` varchar(8) COLLATE utf8mb4_bin NOT NULL,
  `message` text COLLATE utf8mb4_bin DEFAULT NULL,
  `file_id` text COLLATE utf8mb4_bin DEFAULT NULL,
  `time` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- 表的结构 `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `open_id` text COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(16) COLLATE utf8mb4_bin NOT NULL,
  `tel` varchar(16) COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- 转储表的索引
--

--
-- 表的索引 `defaultflag`
--
ALTER TABLE `defaultflag`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `flags`
--
ALTER TABLE `flags`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `offlinecapsule`
--
ALTER TABLE `offlinecapsule`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `timecapsule`
--
ALTER TABLE `timecapsule`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `defaultflag`
--
ALTER TABLE `defaultflag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `flags`
--
ALTER TABLE `flags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `offlinecapsule`
--
ALTER TABLE `offlinecapsule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `timecapsule`
--
ALTER TABLE `timecapsule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
