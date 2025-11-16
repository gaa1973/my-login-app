import {databaseManager} from "@/db";
//import {searchUsers} from "@/models/user";

export const getBooks = async () => {
  const prisma = databaseManager.getInstance();
  return await prisma.books.findMany();
};

export const searchBooks = async (title: string) => {
  const prisma = databaseManager.getInstance();

  return await prisma.books.findMany({
    where: {
      title: {
        contains: title,
      },
    },
  });
};

// getBookId
export const getBookById = async (id: number) => {
  const prisma = databaseManager.getInstance();
  return await prisma.books.findUnique({
    where: {
      id,
    },
  });
};

export const createBook = async (
  title: string,
  author: string,
  genre?: string,
  publishedYear?: number,
) => {
  const prisma = databaseManager.getInstance();

  return await prisma.books.create({
    data: {
      title,
      author,
      genre,
      publishedYear,
    },
  });
};

// ファイル末尾に updateBook を追記
export const updateBook = async (id: number, title: string) => {
  const prisma = databaseManager.getInstance();

  return await prisma.books.update({
    where: {
      id,
    },
    data: {
      title,
    },
  });
};

export const deleteBook = async (id: number) => {
  const prisma = databaseManager.getInstance();

  return await prisma.books.delete({
    where: {
      id,
    },
  });
};

// // Userテーブルからpasswordを検索
// export const searchUsers = async (email: string) => {
//   const prisma = databaseManager.getInstance();

//   return await prisma.users.findUnique({
//     where: {
//       email: {
//         equals: email,
//       },
//     },
//   });
// };
