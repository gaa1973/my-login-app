import {Request, Response, NextFunction} from "express";
import * as MemosService from "@/services/memos.service";

export const getAllMemos = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const memos = await MemosService.getMemosForUser(userId);
    res.json(memos);
  } catch (error) {
    next(error);
  }
};

export const createMemo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const {title, content} = req.body;
    const newMemo = await MemosService.createMemoForUser(
      userId,
      title,
      content,
    );
    res.status(201).json(newMemo);
  } catch (error) {
    next(error);
  }
};

export const deleteMemo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const memoId = Number(req.params.id);
    await MemosService.deleteUserMemo(userId, memoId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getMemoById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const memoId = Number(req.params.id);
    const memo = await MemosService.getMemoById(memoId);
    if (!memo) {
      return res.status(404).json({message: "メモが見つかりません"});
    }
    // 所有者チェック（任意）: req.user!.id と一致するか
    if ((memo as any).authorId !== req.user!.id) {
      return res.status(403).json({message: "アクセス権がありません"});
    }
    res.json(memo);
  } catch (error) {
    next(error);
  }
};

export const updateMemo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const memoId = Number(req.params.id);
    const userId = req.user!.id;
    const {title, content} = req.body;

    // 取得して所有者チェック
    const memo = await MemosService.getMemoById(memoId);
    if (!memo) {
      return res.status(404).json({message: "メモが見つかりません"});
    }
    if ((memo as any).authorId !== userId) {
      return res.status(403).json({message: "更新権限がありません"});
    }

    const updated = await MemosService.updateMemo(memoId, title, content);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};
