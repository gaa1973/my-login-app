import { Request, Response, NextFunction } from 'express';
import { validationResult, Result, ValidationError } from 'express-validator';

interface CustomError extends Error {
  status?: number;
  errors?: ValidationError[];
}

/**
 * Express アプリケーションのグローバルエラーハンドラー
 * すべてのルートの後に配置する必要があります。
 */
export function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
  console.error(err); // 開発中にエラーをコンソールに記録

  // express-validatorからのバリデーションエラーを処理
  // (validator.ts から渡されるエラーなど)
  if (err.errors && Array.isArray(err.errors)) {
    const statusCode = err.status || 400;
    return res.status(statusCode).json({
      message: err.message || '入力内容にエラーがあります。',
      errors: err.errors,
    });
  }

  // 上記以外の一般的なエラー (ログイン失敗など)
  const statusCode = err.status || 500;
  const message = err.message || 'サーバー内部でエラーが発生しました。';
  return res.status(statusCode).json({ message });
}