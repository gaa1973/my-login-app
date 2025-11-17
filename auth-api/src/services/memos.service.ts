import {
  getMemosByAuthorId,
  createMemo as createMemoInDb,
  getMemoById,
  deleteMemo as deleteMemoInDb,
} from "@/models/memos";

/**
 * 特定のユーザーのすべてのメモを取得する
 * @param userId ユーザーID
 */
export const getMemosForUser = async (userId: number) => {
  return await getMemosByAuthorId(userId);
};

/**
 * 特定のユーザーのために新しいメモを作成する
 * @param userId ユーザーID
 * @param title メモのタイトル
 * @param content メモの内容
 */
export const createMemoForUser = async (
  userId: number,
  title: string,
  content: string,
) => {
  return await createMemoInDb(title, content, userId);
};

/**
 * メモを削除する（所有者チェックを含む）
 * @param userId リクエストしたユーザーのID
 * @param memoId 削除対象のメモID
 */
export const deleteUserMemo = async (userId: number, memoId: number) => {
  const memo = await getMemoById(memoId);

  if (!memo) {
    const error = new Error("メモが見つかりません");
    (error as any).statusCode = 404;
    throw error;
  }

  if (memo.authorId !== userId) {
    const error = new Error("このメモを削除する権限がありません");
    (error as any).statusCode = 403; // Forbidden
    throw error;
  }

  await deleteMemoInDb(memoId);
};
