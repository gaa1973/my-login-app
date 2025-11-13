import {databaseManager} from "@/db";

export const getUsers = async () => {
  const prisma = databaseManager.getInstance();
  return await prisma.user.findMany();
};

// Userテーブルからpasswordを検索
export const searchUsers = async (email: string) => {
  const prisma = databaseManager.getInstance();

  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

// User作成
export const createUser = async (
  email: string,
  password: string,
  name?: string,
) => {
  const prisma = databaseManager.getInstance();

  return await prisma.user.create({
    data: {
      email,
      password,
      name,
    },
  });
};
