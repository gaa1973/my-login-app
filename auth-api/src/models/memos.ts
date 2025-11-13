import {databaseManager} from "@/db";

export const createMemo = (title: string, content: string, authorId: number) =>
  databaseManager.getInstance().memo.create({data: {title, content, authorId}});

export const getMemosByAuthor = (authorId: number) =>
  databaseManager
    .getInstance()
    .memo.findMany({where: {authorId}, orderBy: {createdAt: "desc"}});

export const getMemoById = (id: number) =>
  databaseManager.getInstance().memo.findUnique({where: {id}});

export const updateMemo = (
  id: number,
  data: {title?: string; content?: string},
) => databaseManager.getInstance().memo.update({where: {id}, data});

export const deleteMemo = (id: number) =>
  databaseManager.getInstance().memo.delete({where: {id}});
