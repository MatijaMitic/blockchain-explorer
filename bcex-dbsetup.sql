CREATE SCHEMA `blockchain_explorer` ;

USE blockchain_explorer

CREATE TABLE `blockchain_explorer`.`block_timestamp_mapping` (
  `Block_number` INT NOT NULL,
  `Timestamp` DATETIME NOT NULL,
  PRIMARY KEY (`Block_number`));


CREATE TABLE `blockchain_explorer`.`transaction` (
  `id` INT NOT NULL,
  `From` NVARCHAR(100) NOT NULL,
  `To` NVARCHAR(100) NOT NULL,
  `Value` DECIMAL(65,30) NOT NULL,
  `Gas` DECIMAL(65,30) NOT NULL,
  `GasPrice` DECIMAL(65,30) NOT NULL,
  `Hash` NVARCHAR(100) NOT NULL,
  `BlockNumber` INT NULL,
  `timestamp` DATETIME NULL,
  PRIMARY KEY (`id`));
