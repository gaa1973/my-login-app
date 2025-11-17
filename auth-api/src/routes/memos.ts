import express from "express";
import authMiddleware from "@/middleware/auth.middleware";
import * as MemosController from "@/controllers/memos.controller";

const router = express.Router();

// 全てのルートで認証ミドルウェアを使用
router.use(authMiddleware);

// GET /api/memos - 一覧取得
router.get("/", MemosController.getAllMemos);

// POST /api/memos - 作成（authorId は req.user.id を使う）
router.post("/", MemosController.createMemo);

// GET /api/memos/:id - 単一取得 + 所有者チェック
router.get("/:id", MemosController.getMemoById);

// PUT /api/memos/:id - 更新（ルートで所有者チェック）
router.put("/:id", MemosController.updateMemo);

// DELETE /api/memos/:id - 削除（ルートで所有者チェック）
// DELETEメソッドで /api/memos/:id という形式のURLへのリクエストを待ち受ける
router.delete("/:id", MemosController.deleteMemo);

export default router;
