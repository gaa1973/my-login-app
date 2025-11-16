import express from "express";
import {
  getBooks,
  searchBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "@/models/books";
import authMiddleware from "@/middleware/auth.middleware";

const router = express.Router();

// このルーターの全てのルートで認証を必須にする
router.use(authMiddleware);

// GET /api/books - 全ての書籍を取得
router.get("/", async (req, res) => {
  const data = await getBooks();
  res.json(data);
});

// GET /api/books/search - タイトルで書籍を検索
router.get("/search", async (req, res) => {
  const title = req.query.title as string;
  const data = await searchBooks(title);
  res.json(data);
});

// GET /api/books/:id - IDで単一の書籍を取得
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({message: "Invalid ID format"});
  }
  const data = await getBookById(id);
  if (!data) {
    return res.status(404).json({message: "Book not found"});
  }
  res.json(data);
});

// POST /api/books - 新しい書籍を作成
router.post("/", async (req, res) => {
  const {title, author, genre, publishedYear} = req.body;
  // 本来はここでバリデーションを行うのが望ましい
  if (!title) {
    return res.status(400).json({message: "Title is required"});
  }
  const data = await createBook(title, author, genre, publishedYear);
  res.status(201).json(data);
});

// PATCH /api/books/:id - 書籍情報を更新
router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({message: "Invalid ID format"});
  }

  const existingBook = await getBookById(id);
  if (!existingBook) {
    return res.status(404).json({message: "Book not found"});
  }

  const {title, author, genre, publishedYear} = req.body;
  const data = await updateBook(id, {title, author, genre, publishedYear});
  res.status(200).json(data);
});

// DELETE /api/books/:id - 書籍を削除
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({message: "Invalid ID format"});
  }
  // 削除対象が存在するか確認
  const existingBook = await getBookById(id);
  if (!existingBook) {
    return res.status(404).json({message: "Book not found"});
  }
  await deleteBook(id);
  res.status(204).end(); // 成功時はボディなしで204を返す
});

export default router;
