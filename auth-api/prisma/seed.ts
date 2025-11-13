import {PrismaClient} from "@prisma/client";
import {books} from "./seed/books";
import {users} from "./seed/users";

export const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.books.createMany({
    data: books,
    skipDuplicates: true,
  });
  // usermain関数内で
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
