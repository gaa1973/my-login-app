import express from "express";
import "express-async-errors"; // 非同期エラーハンドリングのために必須
import cors from "cors";
import cookieParser from "cookie-parser";

// --- ルートとミドルウェアのインポート ---
import authRouter from "./routes/auth";
import memosRouter from "./routes/memos";
import { errorHandler } from "./middleware/errorHandler.middleware";

// --- Expressアプリケーションの初期化 ---
export const app = express();

// --- 基本的なミドルウェアの設定 ---
app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
app.use(cookieParser());

// --- ルートの設定 ---
app.use("/api/auth", authRouter);
app.use("/api/memos", memosRouter);

// --- エラーハンドリングミドルウェアの適用 ---
// すべてのルート設定の「後」に配置します
app.use(errorHandler);