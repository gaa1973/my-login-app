import express from "express";
import "express-async-errors"; // 非同期エラーハンドリングのために必須
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import memosRouter from "./routes/memos";

export const app = express();

app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
// [変更点] cookieParserをミドルウェアとして追加
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/memos", memosRouter);

// 末尾に追加
export const runServer = (port: number = Number(process.env.PORT) || 4000) => {
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  return server;
};
