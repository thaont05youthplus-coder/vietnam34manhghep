import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getSession = query({
  args: { sessionId: v.id("chat_sessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) return null;
    const messages = await ctx.db
      .query("chat_messages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    return { session, messages };
  },
});

export const listSessions = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    return await ctx.db
      .query("chat_sessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const createSession = mutation({
  args: {
    userId: v.optional(v.string()),
    contextProvinceCode: v.optional(v.string()),
    contextRegionId: v.optional(v.string()),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chat_sessions", {
      userId: args.userId,
      contextProvinceCode: args.contextProvinceCode,
      contextRegionId: args.contextRegionId,
      title: args.title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const sendMessage = mutation({
  args: {
    sessionId: v.id("chat_sessions"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    citations: v.array(
      v.object({
        sourceId: v.string(),
        title: v.string(),
        url: v.optional(v.string()),
        quote: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chat_messages", {
      sessionId: args.sessionId,
      role: args.role,
      content: args.content,
      citations: args.citations,
      timestamp: Date.now(),
    });
    await ctx.db.patch(args.sessionId, { updatedAt: Date.now() });
  },
});
