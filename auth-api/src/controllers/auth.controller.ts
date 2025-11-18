import {Request, Response, NextFunction} from "express";
import * as AuthService from "@/services/auth.service";
import jwt from "jsonwebtoken";

/**
 * JWTを生成し、セキュアなHTTP-Onlyクッキーに設定するヘルパー関数
 * @param res Expressのレスポンスオブジェクト
 * @param user ユーザー情報（id, email）
 */
const setAuthCookie = (
  res: express.Response,
  user: {id: number; email: string},
) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("サーバー設定エラー（JWT_SECRET未設定）");
  }
  const payload = {id: user.id, email: user.email};
  const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});

  res.cookie("token", token, {
    httpOnly: true, // JavaScriptからのアクセスを禁止
    secure: process.env.NODE_ENV === "production", // 本番環境ではHTTPSのみ
    sameSite: "lax",
    maxAge: 1000 * 60 * 60, // 1時間
    path: "/",
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {email, password} = req.body;
    const newUser = await AuthService.registerUser(email, password);
    setAuthCookie(res, {id: newUser.id, email: newUser.email});
    res
      .status(201)
      .json({message: "新規登録とログインに成功しました", user: newUser});
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {email, password} = req.body;
    const user = await AuthService.loginUser(email, password);
    setAuthCookie(res, {id: user.id, email: user.email});
    res.json({message: "ログイン成功server"});
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = (req: Request, res: Response) => {
  res.json({ok: true, user: req.user});
};

export const logout = async (req: Request, res: Response) => {
  try {
    // クッキーに token がある場合は削除する
    res.clearCookie("token");
    return res.json({success: true, message: "ログアウトしました"});
  } catch (err) {
    console.error("logout error", err);
    return res
      .status(500)
      .json({message: "ログアウト処理中にエラーが発生しました"});
  }
};
