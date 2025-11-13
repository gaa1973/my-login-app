import express from "express";
import "express-async-errors"; // 非同期エラーハンドリングのために必須
import cors from "cors";
import {
  getBooks,
  searchBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "@/models/books";
import {searchUsers, createUser} from "@/models/user";
import {hashPassword, comparePassword} from "@/utils/auth";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import authMiddleware from "@/middleware/auth.middleware"; // JWT認証ミドルウェアをインポート

export const app = express();

app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
// [変更点] cookieParserをミドルウェアとして追加
app.use(cookieParser());

// user
app.get("/api/protected", authMiddleware, (req, res) => {
  // req.user が入っている前提
  res.json({ok: true, user: req.user});
});

app.post("/api/login", async (req, res) => {
  const {email, password} = req.body;
  console.log(typeof email, email);

  // データベースからユーザー情報を取得
  const data = await searchUsers(email);

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
  const payload = {email};
  const token = jwt.sign(payload, process.env.JWT_SECRET);

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

  return res.json({message: "ログイン成功server"});
});

app.post("/api/Registration", async (req, res) => {
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

  res.status(201).json(data);
});

app.get("/api/hello", (req, res) => {
  res.json({message: "Hello from backend!"});
});

// GET /api/booksへのリクエスト時、getBooksが実行される
app.get("/api/books", async (req, res) => {
  const data = await getBooks();

  res.json(data);
});

// GET /api/books/searchへのリクエスト時、searchBooksが実行される
app.get("/api/books/search", async (req, res) => {
  const title = req.query.title as string;
  const data = await searchBooks(title);

  res.json(data);
});

// GET /api/books/:idへのリクエスト時、getBookByIdが実行される
app.get("/api/books/:id", async (req, res) => {
  const id = Number(req.params.id);
  const data = await getBookById(id);

  res.json(data);
});

// POST /api/booksへのリクエスト時、createBookが実行される
app.post("/api/books", async (req, res) => {
  const {title, author, genre, publishedYear} = req.body;
  const data = await createBook(title, author, genre, publishedYear);

  res.status(201).json(data);
});

// PATCH /api/books/:idへのリクエスト時、updateBookが実行される
app.patch("/api/books/:id", async (req, res) => {
  const id = Number(req.params.id);
  const {title} = req.body;
  const data = await updateBook(id, title);

  res.status(200).json(data);
});

// DELETE /api/books/:idへのリクエスト時、deleteBookが実行される
app.delete("/api/books/:id", async (req, res) => {
  const id = Number(req.params.id);
  const data = await deleteBook(id);

  res.status(200).json(data);
});
