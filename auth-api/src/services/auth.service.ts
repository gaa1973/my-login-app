import {searchUsers, createUser} from "@/models/user";
import {hashPassword, comparePassword} from "@/utils/auth";

/**
 * 新規ユーザーを登録する
 * @param email ユーザーのメールアドレス
 * @param password ユーザーのパスワード（平文）
 * @returns 作成されたユーザー情報
 */
export const registerUser = async (email: string, password: string) => {
  // 既存ユーザー確認: 同じメールアドレスが既に登録されていないか確認する
  const existingUser = await searchUsers(email);
  if (existingUser) {
    const error = new Error("既に登録されているメールアドレスです");
    (error as any).status = 400;
    throw error;
  }

  // パスワードをハッシュ化
  const hashedPassword = await hashPassword(password);

  // ユーザー作成: createUser() を呼び出してmail とハッシュ化されたパスワードで新規ユーザーを作成する
  const newUser = await createUser(email, hashedPassword);
  return newUser;
};

/**
 * ユーザーをログインさせる
 * @param email ユーザーのメールアドレス
 * @param password ユーザーのパスワード
 * @returns 認証されたユーザー情報
 */
export const loginUser = async (email: string, password: string) => {
  const user = await searchUsers(email);
  if (!user || !(await comparePassword(password, user.password))) {
    const error = new Error("メールアドレスまたはパスワードが間違っています");
    (error as any).statusCode = 401;
    throw error;
  }
  return user;
};
