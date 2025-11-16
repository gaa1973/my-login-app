import express from "express";
import "express-async-errors"; // 非同期エラーハンドリングのために必須
import cors from "cors";
// import {
//   getBooks,
//   searchBooks,
//   getBookById,
//   createBook,
//   updateBook,
//   deleteBook,
// } from "../models/books";
// import {searchUsers, createUser} from "../models/user";
// import {hashPassword, comparePassword} from "../utils/auth";
// import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
// import authMiddleware from "../middleware/auth.middleware"; // JWT認証ミドルウェアをインポート
import authRouter from "./routes/auth";
import memosRouter from "./routes/memos";
import booksRouter from "./routes/books";

export const app = express();

app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
// [変更点] cookieParserをミドルウェアとして追加
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/memos", memosRouter);
app.use("/api/books", booksRouter);
