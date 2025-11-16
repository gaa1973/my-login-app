// src/routes/auth.ts
import express from "express";
import {searchUsers, createUser} from "@/models/user";
import {hashPassword, comparePassword} from "@/utils/auth";
import authMiddleware from "@/middleware/auth.middleware";

import jwt from "jsonwebtoken";
const router = express.Router();
// user
router.get("/protected", authMiddleware, (req, res) => {
  // req.user が入っている前提
  res.json({ok: true, user: req.user});
});

router.post("/login", async (req, res) => {
  const {email, password} = req.body;
  console.log("[LOGIN] Request received for:", email);

  // データベースからユーザー情報を取得
  console.log("[LOGIN] Searching for user in DB...");
  const data = await searchUsers(email);
  console.log("[LOGIN] DB search complete. User found:", !!data);

  if (!data) {
    console.log("ユーザー未登録");
    return res.status(400).json({message: "ユーザーが見つかりません"});
  }

  if (!(await comparePassword(password, data.password))) {
    console.log("パスワード不一致");
    return res.status(400).json({message: "パスワードが間違っています"});
  }

  if (!process.env.JWT_SECRET) {
    return res
      .status(500)
      .json({message: "サーバー設定エラー（JWT_SECRET未設定）"});
  }

  // ログイン成功
  const payload = {id: data.id, email: data.email};
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  // セキュアなクッキーにトークンを保存
  res.cookie("token", token, {
    httpOnly: false,
    //    secure: process.env.NODE_ENV === "production", // 本番では true
    secure: false, // 本番では true
    sameSite: "lax",
    maxAge: 1000 * 60 * 60, // 1時間
    path: "/",
  });

  // // 開発用の安全な例
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: false, // 本番では true にする
  //   sameSite: "lax",
  //   maxAge: 1000 * 60 * 60, // 1時間
  //   path: "/",
  // });

  console.log("[LOGIN] Sending success response.");
  return res.json({message: "ログイン成功server"});
});

router.post("/registration", async (req, res) => {
  const {email, password} = req.body;
  console.log(typeof email, email);

  const existingUser = await searchUsers(email);
  if (existingUser) {
    console.log("既に登録");
    return res
      .status(400)
      .json({message: "既に登録されているメールアドレスです"});
  }

  // パスワードをハッシュ化
  const hashedPassword = await hashPassword(password);
  console.log(hashedPassword);

  const data = await createUser(email, hashedPassword);

  // 新規登録成功後、そのままログイン処理を行う
  if (!process.env.JWT_SECRET) {
    return res
      .status(500)
      .json({message: "サーバー設定エラー（JWT_SECRET未設定）"});
  }
  const payload = {id: data.id, email: data.email};
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60, // 1時間
    path: "/",
  });

  res
    .status(201)
    .json({message: "新規登録とログインに成功しました", user: data});
});

// router.get("/hello", (req, res) => {
//   res.json({message: "Hello from backend!"});
// });

export default router;
