-- ============================================================
-- 图书借阅系统 数据库初始化脚本
-- 包含:建库、建表(主键自增)、测试数据
-- 与 server/prisma/schema.prisma 保持一致
-- 执行方式:mysql -uroot -p < init.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS `book_manage` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `book_manage`;

-- ------------------------------------------------------------
-- 图书类型表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `book_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `typeName` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 图书信息表
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `book_info` (
    `bookId` INTEGER NOT NULL AUTO_INCREMENT,
    `bookCode` VARCHAR(50) NOT NULL COMMENT '图书编号',
    `bookName` VARCHAR(100) NOT NULL COMMENT '图书名称',
    `bookType` INTEGER NOT NULL COMMENT '图书类型(关联 book_type.id)',
    `bookAuthor` VARCHAR(50) NOT NULL COMMENT '图书作者',
    `publishPress` VARCHAR(100) NOT NULL COMMENT '出版社',
    `publishDate` DATE NOT NULL COMMENT '出版日期',
    `borrowed` INTEGER NOT NULL DEFAULT 0 COMMENT '是否借阅:1 已借阅 / 0 未借阅',
    `createdBy` VARCHAR(50) NOT NULL COMMENT '入库人',
    `creationTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '入库时间',
    `lastUpdatetime` DATETIME(3) NULL COMMENT '最新更新时间',
    INDEX `book_info_creationTime_idx` (`creationTime`),
    PRIMARY KEY (`bookId`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 系统用户表(登录用)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sys_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(100) NOT NULL COMMENT 'bcrypt 哈希',
    `realName` VARCHAR(50) NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'admin',
    UNIQUE INDEX `sys_user_username_key` (`username`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 测试数据:图书类型(8 类,与试卷要求一致)
-- ------------------------------------------------------------
INSERT INTO `book_type` (`typeName`) VALUES
    ('小说'), ('文学'), ('传记'), ('艺术'),
    ('少儿'), ('经济'), ('管理'), ('科技');

-- ------------------------------------------------------------
-- 测试数据:图书信息(6 条,入库时间各不相同用于验证降序)
-- ------------------------------------------------------------
INSERT INTO `book_info`
    (`bookCode`, `bookName`, `bookType`, `bookAuthor`, `publishPress`, `publishDate`, `borrowed`, `createdBy`, `creationTime`)
VALUES
    ('BK-1001', '三体',     1, '刘慈欣',         '重庆出版社',     '2008-01-01', 0, '系统管理员', '2024-03-01 09:10:00'),
    ('BK-1002', '活着',     2, '余华',           '作家出版社',     '2012-08-01', 1, '系统管理员', '2024-03-02 10:20:00'),
    ('BK-1003', '乔布斯传', 3, '沃尔特·艾萨克森', '中信出版社',     '2011-10-24', 0, '系统管理员', '2024-03-03 11:30:00'),
    ('BK-1004', '人类简史', 8, '尤瓦尔·赫拉利',   '中信出版社',     '2014-11-01', 1, '系统管理员', '2024-03-04 14:00:00'),
    ('BK-1005', '小王子',   5, '圣埃克苏佩里',   '人民文学出版社', '2003-08-01', 0, '系统管理员', '2024-03-05 16:40:00'),
    ('BK-1006', '国富论',   6, '亚当·斯密',      '商务印书馆',     '2015-01-01', 0, '系统管理员', '2024-03-06 08:05:00');

-- ------------------------------------------------------------
-- 测试数据:管理员账号 admin / 123456(密码为 bcrypt 哈希)
-- ------------------------------------------------------------
INSERT INTO `sys_user` (`username`, `password`, `realName`, `role`) VALUES
    ('admin', '$2a$10$Fv.VoBG4abnpAlaYS766AeH7IZxL2IUKekyq1x83fk8tN70vsB3VG', '系统管理员', 'admin');
