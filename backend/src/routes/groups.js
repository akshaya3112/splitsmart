import { Router } from "express";
import { nanoid } from "nanoid";
import { db } from "../db.js";
import { asyncHandler, Errors } from "../utils/errors.js";
import { requireString, requireArray } from "../utils/validate.js";
import { requireAuth } from "../middleware/auth.js";

export const groupsRouter = Router();

// Helper to check if a user has access to a group
export async function checkGroupAccess(groupId, user) {
  const group = await db.get("groups", groupId);
  if (!group) return null;

  // Authorized if creator
  if (group.creatorId === user.id) return group;

  // Authorized if user is in the members list
  const members = await Promise.all(group.memberIds.map((id) => db.get("members", id)));
  const isMember = members.some(
    (m) => m && (m.userId === user.id || m.email?.toLowerCase() === user.email.toLowerCase())
  );
  if (isMember) return group;

  return null;
}

// Create a group with an initial set of member names/emails.
groupsRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const name = requireString(req.body?.name, "name", { maxLength: 80 });
    const membersInput = requireArray(req.body?.members, "members", { minLength: 2 });

    const memberIds = [];
    for (const item of membersInput) {
      let mName, mEmail = null;
      if (typeof item === "string") {
        mName = requireString(item, "member name", { maxLength: 60 });
      } else if (item && typeof item === "object") {
        mName = requireString(item.name, "member name", { maxLength: 60 });
        mEmail = item.email ? requireString(item.email, "member email", { maxLength: 100 }).trim().toLowerCase() : null;
      } else {
        throw Errors.badRequest("Invalid member item format.");
      }

      // Check if this member is a registered user
      let userId = null;
      if (mEmail) {
        const matchingUsers = await db.filter("users", (u) => u.email === mEmail);
        if (matchingUsers.length > 0) {
          userId = matchingUsers[0].id;
        }
      } else if (mName.toLowerCase() === req.user.name.toLowerCase() || mEmail === req.user.email) {
        userId = req.user.id;
      }

      const id = nanoid(10);
      await db.put("members", id, { id, name: mName, email: mEmail, userId, groupId: null });
      memberIds.push(id);
    }

    const groupId = nanoid(10);
    const group = {
      id: groupId,
      name,
      creatorId: req.user.id,
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

// List groups accessible to the logged-in user.
groupsRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const allGroups = await db.getAll("groups");
    const accessibleGroups = [];

    for (const group of allGroups) {
      if (group.creatorId === req.user.id) {
        accessibleGroups.push(group);
        continue;
      }

      const members = await Promise.all(group.memberIds.map((id) => db.get("members", id)));
      const isMember = members.some(
        (m) => m && (m.userId === req.user.id || m.email?.toLowerCase() === req.user.email.toLowerCase())
      );

      if (isMember) {
        accessibleGroups.push(group);
      }
    }

    res.json({ groups: accessibleGroups.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
  })
);

// Get specific group details
groupsRouter.get(
  "/:groupId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const group = await checkGroupAccess(req.params.groupId, req.user);
    if (!group) throw Errors.notFound("Group not found or access denied.");

    const members = await Promise.all(group.memberIds.map((id) => db.get("members", id)));
    res.json({ group, members });
  })
);

// Add a member to a group
groupsRouter.post(
  "/:groupId/members",
  requireAuth,
  asyncHandler(async (req, res) => {
    const group = await checkGroupAccess(req.params.groupId, req.user);
    if (!group) throw Errors.notFound("Group not found or access denied.");

    const mName = requireString(req.body?.name, "name", { maxLength: 60 });
    const mEmail = req.body?.email ? requireString(req.body.email, "email", { maxLength: 100 }).trim().toLowerCase() : null;

    let userId = null;
    if (mEmail) {
      const matchingUsers = await db.filter("users", (u) => u.email === mEmail);
      if (matchingUsers.length > 0) {
        userId = matchingUsers[0].id;
      }
    }

    const id = nanoid(10);
    const member = { id, name: mName, email: mEmail, userId, groupId: group.id };
    await db.put("members", id, member);

    group.memberIds.push(id);
    await db.put("groups", group.id, group);

    res.status(201).json({ member });
  })
);

// Delete group (restricted to creator only)
groupsRouter.delete(
  "/:groupId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const group = await db.get("groups", req.params.groupId);
    if (!group) throw Errors.notFound("Group not found.");

    if (group.creatorId !== req.user.id) {
      throw Errors.unauthorized("Only the group creator can delete this group.");
    }

    // Delete members
    for (const memberId of group.memberIds) {
      await db.remove("members", memberId);
    }

    // Delete expenses associated with the group
    const expenses = await db.filter("expenses", (e) => e.groupId === group.id);
    for (const expense of expenses) {
      await db.remove("expenses", expense.id);
    }

    // Delete group
    await db.remove("groups", group.id);

    res.json({ success: true });
  })
);
