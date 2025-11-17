import {databaseManager} from "@/db";

// Userテーブルから全件取得
export const getUsers = async () => {
  const prisma = databaseManager.getInstance();
  return await prisma.user.findMany();
};

// Userテーブルからemailをキーにpasswordを検索
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
