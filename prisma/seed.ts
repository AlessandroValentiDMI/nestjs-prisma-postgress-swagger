import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Generazione di 50 record coerenti con lo schema User
  const usersToCreate = Array.from({ length: 50 }, (_, i) => {
    const index = i + 1;
    return {
      email: `user${index}@example.com`,
      name: `User ${index}`,
    };
  });

  // Eliminazione preventiva per evitare conflitti sugli indici unici durante il re-seed
  await prisma.user.deleteMany({
    where: {
      email: {
        in: usersToCreate.map((u) => u.email),
      },
    },
  });

  // Inserimento massivo dei 50 record
  const result = await prisma.user.createMany({
    data: usersToCreate,
    skipDuplicates: true,
  });

  console.log(`✅ Inseriti con successo ${result.count} utenti nel database.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("❌ Errore durante il seeding:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });