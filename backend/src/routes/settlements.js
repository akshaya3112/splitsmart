import { Router } from "express";
import { db } from "../db.js";
import { asyncHandler, Errors } from "../utils/errors.js";
import { simplifyDebts, computeNetBalances } from "../algorithms/simplifyDebts.js";
import { requireAuth } from "../middleware/auth.js";
import { checkGroupAccess } from "./groups.js";

export const settlementsRouter = Router();

settlementsRouter.get(
  "/group/:groupId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const group = await checkGroupAccess(req.params.groupId, req.user);
    if (!group) throw Errors.notFound("Group not found or access denied.");

    const members = await Promise.all(group.memberIds.map((id) => db.get("members", id)));
    const expenses = await db.filter("expenses", (e) => e.groupId === group.id);

    const netBalances = computeNetBalances(members, expenses);
    const transactions = simplifyDebts(netBalances);

    const byId = Object.fromEntries(members.map((m) => [m.id, m.name]));
    const transactionsWithNames = transactions.map((t) => ({
      ...t,
      fromName: byId[t.from],
      toName: byId[t.to],
    }));

    const naiveTransactionCount = members.filter((m) => netBalances[m.id] !== 0).length; // rough baseline for comparison
    res.json({
      netBalances,
      transactions: transactionsWithNames,
      stats: {
        transactionCount: transactions.length,
        memberCount: members.length,
        naiveUpperBound: Math.max(0, naiveTransactionCount - 1),
      },
    });
  })
);
