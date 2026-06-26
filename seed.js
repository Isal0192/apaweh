const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seed() {
  const p1 = await bcrypt.hash('author123', 10);
  await prisma.user.create({
    data: { username: 'authorblog', password: p1, role: 'author_blog', name: 'Penulis Blog' }
  }).catch(e => console.log('Exists authorblog'));

  await prisma.user.create({
    data: { username: 'authorshare', password: p1, role: 'author_sharing', name: 'Penulis Sharing' }
  }).catch(e => console.log('Exists authorshare'));

  console.log('Done');
}

seed().then(() => prisma.$disconnect());
