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
router.use(authMiddleware);

router.get("/", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).end();
  const list = await getMemosByAuthor(userId);
  res.json(list);
});

router.post("/", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).end();
  const {title, content} = req.body;
  const memo = await createMemo(title, content, userId);
  res.status(201).json(memo);
});

router.patch("/:id", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).end();
  const id = Number(req.params.id);
  const existing = await getMemoById(id);
  if (!existing || existing.authorId !== userId)
    return res.status(403).json({message: "権限がありません"});
  const updated = await updateMemo(id, req.body);
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).end();
  const id = Number(req.params.id);
  const existing = await getMemoById(id);
  if (!existing || existing.authorId !== userId)
    return res.status(403).json({message: "権限がありません"});
  await deleteMemo(id);
  res.status(204).end();
});

export default router;
