// src/models/memos.ts
import {databaseManager} from "@/db";

/**
 * 指定ユーザーのメモを取得
 */
export const getMemosByAuthorId = async (authorId: number) => {
  const prisma = databaseManager.getInstance();
  return await prisma.memo.findMany({
    where: {authorId},
    orderBy: {createdAt: "desc"},
  });
};

/**
 * 新しいメモを作成
 */
export const createMemo = async (
  title: string,
  content: string,
  authorId: number,
) => {
  const prisma = databaseManager.getInstance();
  return await prisma.memo.create({
    data: {title, content, authorId},
  });
};

/**
 * IDでメモ取得
 */
export const getMemoById = async (id: number) => {
  const prisma = databaseManager.getInstance();
  return await prisma.memo.findUnique({where: {id}});
};

/**
 * メモを削除
 */
export const deleteMemo = async (id: number) => {
  const prisma = databaseManager.getInstance();
  return await prisma.memo.delete({where: {id}});
};
