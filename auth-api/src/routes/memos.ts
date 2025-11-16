import express from "express";
import authMiddleware from "@/middleware/auth.middleware";
import {
  createMemo,
  getMemosByAuthor,
  getMemoById,
  updateMemo,
  deleteMemo,
} from "@/models/memos";

const router = express.Router();

// 全てのルートで認証ミドルウェアを使用
router.use(authMiddleware);

// GET /api/memos - 自分のメモ一覧
router.get("/", async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const memos = await getMemosByAuthor(userId);
    res.json(memos);
  } catch (err) {
    next(err);
  }
});

// POST /api/memos - 作成（authorId は req.user.id を使う）
router.post("/", async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { title, content } = req.body;
    const memo = await createMemo(title, content ?? "", userId);
    res.status(201).json(memo);
  } catch (err) {
    next(err);
  }
});

// GET /api/memos/:id - 単一取得 + 所有者チェック
router.get("/:id", async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const id = Number(req.params.id);
    const memo = await getMemoById(id);
    if (!memo) return res.status(404).json({ message: "Not found" });
    if (memo.authorId !== userId) return res.status(403).json({ message: "Forbidden" });
    res.json(memo);
  } catch (err) {
    next(err);
  }
});

// PUT /api/memos/:id - 更新（ルートで所有者チェック）
router.put("/:id", async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const id = Number(req.params.id);
    const memo = await getMemoById(id);
    if (!memo) return res.status(404).json({ message: "Not found" });
    if (memo.authorId !== userId) return res.status(403).json({ message: "Forbidden" });

    const { title, content } = req.body;
    const updated = await updateMemo(id, { title, content });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/memos/:id - 削除（ルートで所有者チェック）
router.delete("/:id", async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const id = Number(req.params.id);
    const memo = await getMemoById(id);
    if (!memo) return res.status(404).json({ message: "Not found" });
    if (memo.authorId !== userId) return res.status(403).json({ message: "Forbidden" });

    await deleteMemo(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
