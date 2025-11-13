// src/middleware/auth.middleware.ts
import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {searchUsers} from "@/models/user"; // 必要ならDB確認

interface JwtPayloadLike {
  userId?: number;
  email?: string;
  iat?: number;
  exp?: number;
}

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // cookie から優先的に取得、なければ Authorization ヘッダ
    const token =
      req.cookies?.token ||
      (req.header("Authorization") || "").replace(/^Bearer\s+/i, "") ||
      null;

    if (!token) {
      return res.status(401).json({message: "認証トークンが見つかりません"});
    }

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({message: "サーバー設定エラー(JWT_SECRET未設定)"});
    }

    let payload: JwtPayloadLike;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayloadLike;
    } catch (err) {
      return res.status(401).json({message: "無効なトークンです"});
    }

    // payload に userId があればそれを使う
    if (payload.userId) {
      req.user = {id: payload.userId, email: payload.email};
      return next();
    }

    // userId が無ければ email で DB 確認（必要なら）
    if (payload.email) {
      const user = await searchUsers(payload.email);
      if (!user) {
        return res.status(401).json({message: "ユーザーが見つかりません"});
      }
      req.user = {id: (user as any).id, email: payload.email};
      return next();
    }

    return res
      .status(401)
      .json({message: "トークンにユーザー情報がありません"});
  } catch (err) {
    console.error("authMiddleware error", err);
    return res.status(500).json({message: "認証処理中にエラーが発生しました"});
  }
}
