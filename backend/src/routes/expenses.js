import { Router } from "express";
import { nanoid } from "nanoid";
import { db } from "../db.js";
import { asyncHandler, Errors } from "../utils/errors.js";
import { requireString, requirePositiveInt, requireArray, requireOneOf } from "../utils/validate.js";

export const expensesRouter = Router();

// Resolves a split strategy into concrete integer shares that always sum
// exactly to the expense total (remainder distributed to the first payers,
// so nothing is ever lost or double-counted to floating point drift).
function resolveSplit(totalAmount, splitType, participants, group) {
  const memberIds = new Set(group.memberIds);
  for (const p of participants) {
    if (!memberIds.has(p.memberId)) {
      throw Errors.badRequest(`Member ${p.memberId} is not part of this group.`);
    }
  }

  if (splitType === "equal") {
    const n = participants.length;
    const base = Math.floor(totalAmount / n);
    const remainder = totalAmount - base * n;
    return participants.map((p, idx) => ({
      memberId: p.memberId,
      share: base + (idx < remainder ? 1 : 0),
    }));
  }

  if (splitType === "exact") {
    let sum = 0;
    const shares = participants.map((p) => {
      const share = requirePositiveInt(p.share, `share for ${p.memberId}`);
      sum += share;
      return { memberId: p.memberId, share };
    });
    if (sum !== totalAmount) {
      throw Errors.badRequest(`Exact shares (${sum}) must add up to the total amount (${totalAmount}).`);
    }
    return shares;
  }

  if (splitType === "percentage") {
    let percentSum = 0;
    const raw = participants.map((p) => {
      const pct = Number(p.percentage);
      if (!Number.isFinite(pct) || pct <= 0) {
        throw Errors.badRequest(`percentage for ${p.memberId} must be a positive number.`);
      }
      percentSum += pct;
      return { memberId: p.memberId, pct };
    });
    if (Math.abs(percentSum - 100) > 0.01) {
      throw Errors.badRequest(`Percentages must add up to 100 (got ${percentSum}).`);
    }
    let allocated = 0;
    const shares = raw.map((r, idx) => {
      let share;
      if (idx === raw.length - 1) {
        share = totalAmount - allocated; // last share absorbs rounding remainder
      } else {
        share = Math.round((r.pct / 100) * totalAmount);
        allocated += share;
      }
      return { memberId: r.memberId, share };
    });
    return shares;
  }

  throw Errors.badRequest(`Unsupported splitType: ${splitType}`);
}

expensesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const groupId = requireString(req.body?.groupId, "groupId");
    const group = await db.get("groups", groupId);
    if (!group) throw Errors.notFound("Group not found.");

    const description = requireString(req.body?.description, "description", { maxLength: 140 });
    const amount = requirePositiveInt(req.body?.amount, "amount");
    const paidBy = requireString(req.body?.paidBy, "paidBy");
    if (!group.memberIds.includes(paidBy)) {
      throw Errors.badRequest("paidBy must be a member of this group.");
    }
    const splitType = requireOneOf(req.body?.splitType ?? "equal", "splitType", ["equal", "exact", "percentage"]);
    const participants = requireArray(req.body?.participants, "participants", { minLength: 1 });

    const splitAmong = resolveSplit(amount, splitType, participants, group);

    const id = nanoid(10);
    const expense = {
      id,
      groupId,
      description,
      amount,
      paidBy,
      splitType,
      splitAmong,
      createdAt: new Date().toISOString(),
    };
    await db.put("expenses", id, expense);
    res.status(201).json({ expense });
  })
);

expensesRouter.get(
  "/group/:groupId",
  asyncHandler(async (req, res) => {
    const group = await db.get("groups", req.params.groupId);
    if (!group) throw Errors.notFound("Group not found.");
    const expenses = await db.filter("expenses", (e) => e.groupId === req.params.groupId);
    res.json({ expenses: expenses.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
  })
);

expensesRouter.delete(
  "/:expenseId",
  asyncHandler(async (req, res) => {
    const expense = await db.get("expenses", req.params.expenseId);
    if (!expense) throw Errors.notFound("Expense not found.");
    await db.remove("expenses", expense.id);
    res.status(204).send();
  })
);
