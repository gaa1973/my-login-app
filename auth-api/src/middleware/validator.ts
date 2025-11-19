import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Zodのエラー情報を、グローバルエラーハンドラーが処理しやすい形式に変換する
        const validationErrors = error.issues.map((issue) => ({
          // issue.path は ['body', 'email'] のような配列なので、最後の要素 'email' を取得
          path: issue.path[issue.path.length - 1],
          // フロントエンドが期待するプロパティ名 'msg' に合わせる
          msg: issue.message,
        }));

        // 整形したエラー情報をnext()でグローバルエラーハンドラーに渡す
        return next({ status: 400, message: '入力内容にエラーがあります。', errors: validationErrors });
      }
      // ZodError以外の予期せぬエラーもグローバルエラーハンドラーに渡す
      return next(error);
    }
  };
