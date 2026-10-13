-- CreateTable
CREATE TABLE `book_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `typeName` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `book_info` (
    `bookId` INTEGER NOT NULL AUTO_INCREMENT,
    `bookCode` VARCHAR(50) NOT NULL,
    `bookName` VARCHAR(100) NOT NULL,
    `bookType` INTEGER NOT NULL,
    `bookAuthor` VARCHAR(50) NOT NULL,
    `publishPress` VARCHAR(100) NOT NULL,
    `publishDate` DATE NOT NULL,
    `borrowed` INTEGER NOT NULL DEFAULT 0,
    `createdBy` VARCHAR(50) NOT NULL,
    `creationTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastUpdatetime` DATETIME(3) NULL,

    INDEX `book_info_creationTime_idx`(`creationTime`),
    PRIMARY KEY (`bookId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `realName` VARCHAR(50) NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'admin',

    UNIQUE INDEX `sys_user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
