import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/** 图书类型(与试卷要求一致:8 类) */
const TYPE_NAMES = ['小说', '文学', '传记', '艺术', '少儿', '经济', '管理', '科技'];

async function main() {
  // 清空后重建,保证种子可重复执行且结果一致
  await prisma.bookInfo.deleteMany();
  await prisma.bookType.deleteMany();

  // 1) 图书类型
  await prisma.bookType.createMany({
    data: TYPE_NAMES.map((typeName) => ({ typeName })),
  });
  const types = await prisma.bookType.findMany();
  const typeId = (name: string): number => {
    const found = types.find((t) => t.typeName === name);
    if (!found) throw new Error(`未找到图书类型: ${name}`);
    return found.id;
  };

  // 2) 系统用户(初始管理员 admin / 123456)
  await prisma.sysUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: bcrypt.hashSync('123456', 10),
      realName: '系统管理员',
      role: 'admin',
    },
  });

  // 3) 图书信息(不少于 5 条,含不同入库时间用于验证降序)
  await prisma.bookInfo.createMany({
    data: [
      {
        bookCode: 'BK-1001',
        bookName: '三体',
        bookType: typeId('小说'),
        bookAuthor: '刘慈欣',
        publishPress: '重庆出版社',
        publishDate: new Date('2008-01-01'),
        borrowed: 0,
        createdBy: '系统管理员',
        creationTime: new Date('2024-03-01T09:10:00'),
      },
      {
        bookCode: 'BK-1002',
        bookName: '活着',
        bookType: typeId('文学'),
        bookAuthor: '余华',
        publishPress: '作家出版社',
        publishDate: new Date('2012-08-01'),
        borrowed: 1,
        createdBy: '系统管理员',
        creationTime: new Date('2024-03-02T10:20:00'),
      },
      {
        bookCode: 'BK-1003',
        bookName: '乔布斯传',
        bookType: typeId('传记'),
        bookAuthor: '沃尔特·艾萨克森',
        publishPress: '中信出版社',
        publishDate: new Date('2011-10-24'),
        borrowed: 0,
        createdBy: '系统管理员',
        creationTime: new Date('2024-03-03T11:30:00'),
      },
      {
        bookCode: 'BK-1004',
        bookName: '人类简史',
        bookType: typeId('科技'),
        bookAuthor: '尤瓦尔·赫拉利',
        publishPress: '中信出版社',
        publishDate: new Date('2014-11-01'),
        borrowed: 1,
        createdBy: '系统管理员',
        creationTime: new Date('2024-03-04T14:00:00'),
      },
      {
        bookCode: 'BK-1005',
        bookName: '小王子',
        bookType: typeId('少儿'),
        bookAuthor: '圣埃克苏佩里',
        publishPress: '人民文学出版社',
        publishDate: new Date('2003-08-01'),
        borrowed: 0,
        createdBy: '系统管理员',
        creationTime: new Date('2024-03-05T16:40:00'),
      },
      {
        bookCode: 'BK-1006',
        bookName: '国富论',
        bookType: typeId('经济'),
        bookAuthor: '亚当·斯密',
        publishPress: '商务印书馆',
        publishDate: new Date('2015-01-01'),
        borrowed: 0,
        createdBy: '系统管理员',
        creationTime: new Date('2024-03-06T08:05:00'),
      },
    ],
  });

  const bookCount = await prisma.bookInfo.count();
  const typeCount = await prisma.bookType.count();
  console.log(`种子完成:图书 ${bookCount} 条,类型 ${typeCount} 条,用户 1 条(admin/123456)`);
}

main()
  .catch((e) => {
    console.error('种子执行失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
