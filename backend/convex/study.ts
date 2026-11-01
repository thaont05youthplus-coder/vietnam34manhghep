import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listSets = query({
  args: {
    scope: v.optional(v.string()),
    targetCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("study_sets").filter((doc) => doc.eq(doc.field("isPublished"), true));
    if (args.scope && args.targetCode) {
      return await ctx.db
        .query("study_sets")
        .withIndex("by_scope", (idx) => idx.eq("scope", args.scope!).eq("targetCode", args.targetCode!))
        .collect();
    }
    return await q.collect();
  },
});

export const getSetById = query({
  args: { setId: v.id("study_sets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.setId);
  },
});

export const recordAttempt = mutation({
  args: {
    userId: v.optional(v.string()),
    studySetId: v.id("study_sets"),
    mode: v.union(v.literal("flashcards"), v.literal("learn"), v.literal("test"), v.literal("match")),
    score: v.optional(v.number()),
    totalQuestions: v.number(),
    incorrectItemIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("study_attempts", {
      userId: args.userId,
      studySetId: args.studySetId,
      mode: args.mode,
      score: args.score,
      totalQuestions: args.totalQuestions,
      incorrectItemIds: args.incorrectItemIds,
      completedAt: Date.now(),
    });
  },
});
