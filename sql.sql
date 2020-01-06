SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

DROP DATABASE IF EXISTS `clientes`;

CREATE DATABASE `clientes`;

USE `clientes`;

CREATE TABLE `cliente` (
	`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`nome` varchar(50) NOT NULL,
	`endereco` varchar(50) NOT NULL,
	`intervalo` int(5) NOT NULL,
	`proximo` varchar(20) NOT NULL,
	`ativo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;