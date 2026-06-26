const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const bcrypt = require('bcryptjs');

// Menggunakan DATABASE_URL dari .env jika ada, atau menggunakan default
const databaseUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/porto_db';

let config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'porto_db',
  connectionLimit: 10,
  allowPublicKeyRetrieval: true,
};

if (databaseUrl.startsWith('mysql://')) {
  try {
    const url = new URL(databaseUrl);
    config = {
      host: url.hostname || 'localhost',
      port: url.port ? parseInt(url.port) : 3306,
      user: url.username || 'root',
      password: decodeURIComponent(url.password || ''),
      database: url.pathname.replace(/^\//, '') || 'porto_db',
      connectionLimit: 10,
      allowPublicKeyRetrieval: true,
    };
  } catch (e) {
    console.error('Gagal parsing DATABASE_URL, menggunakan default config.', e.message);
  }
}

// Inisialisasi Prisma dengan MariaDB Adapter
const adapter = new PrismaMariaDb(config);
const prisma = new PrismaClient({ adapter });

async function resetPassword() {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error("\n❌ Error: Argumen tidak lengkap!");
    console.error("Gunakan perintah: node reset-password.js <username> <password_baru>");
    console.error("Contoh: node reset-password.js admin rahasia123\n");
    process.exit(1);
  }

  const [username, newPassword] = args;
  
  // Cek apakah user ada di database
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user) {
    console.error(`\n❌ Error: User dengan username '${username}' tidak ditemukan di database.\n`);
    process.exit(1);
  }

  // Hash password baru
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  // Update password di database
  await prisma.user.update({
    where: { username },
    data: { password: hashedPassword }
  });

  console.log(`\n✅ SUKSES: Password untuk user '${username}' berhasil direset!`);
  console.log(`🔑 Silakan login dengan password baru Anda.\n`);
}

resetPassword()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('\n❌ Terjadi kesalahan:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
