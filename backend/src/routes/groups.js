import { Router } from "express";
import { nanoid } from "nanoid";
import { db } from "../db.js";
import { asyncHandler, Errors } from "../utils/errors.js";
import { requireString, requireArray } from "../utils/validate.js";

export const groupsRouter = Router();

// Create a group with an initial set of member names.
groupsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const name = requireString(req.body?.name, "name", { maxLength: 80 });
    const memberNames = requireArray(req.body?.members, "members", { minLength: 2 });

    const memberIds = [];
    for (const rawName of memberNames) {
      const memberName = requireString(rawName, "member name", { maxLength: 60 });
      const id = nanoid(10);
      await db.put("members", id, { id, name: memberName, groupId: null });
      memberIds.push(id);
    }

    const groupId = nanoid(10);
    const group = {
      id: groupId,
      name,
      memberIds,
      createdAt: new Date().toISOString(),
    };
    await db.put("groups", groupId, group);

    for (const id of memberIds) {
      const member = await db.get("members", id);
      member.groupId = groupId;
      await db.put("members", id, member);
    }

    res.status(201).json({ group, members: await Promise.all(memberIds.map((id) => db.get("members", id))) });
  })
);

groupsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const groups = await db.getAll("groups");
    res.json({ groups: groups.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
  })
);

groupsRouter.get(
  "/:groupId",
  asyncHandler(async (req, res) => {
    const group = await db.get("groups", req.params.groupId);
    if (!group) throw Errors.notFound("Group not found.");
    const members = await Promise.all(group.memberIds.map((id) => db.get("members", id)));
    res.json({ group, members });
  })
);

groupsRouter.post(
  "/:groupId/members",
  asyncHandler(async (req, res) => {
    const group = await db.get("groups", req.params.groupId);
    if (!group) throw Errors.notFound("Group not found.");
    const name = requireString(req.body?.name, "name", { maxLength: 60 });

    const id = nanoid(10);
    const member = { id, name, groupId: group.id };
    await db.put("members", id, member);
    group.memberIds.push(id);
    await db.put("groups", group.id, group);

    res.status(201).json({ member });
  })
);
