import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getNoteByProvince = query({
  args: { userId: v.optional(v.string()), provinceCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_province", (q) => q.eq("provinceCode", args.provinceCode))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
  },
});

export const saveNote = mutation({
  args: {
    userId: v.optional(v.string()),
    provinceCode: v.optional(v.string()),
    regionId: v.optional(v.string()),
    title: v.string(),
    textContent: v.string(),
    drawingStrokes: v.string(),
    mapSnapshotUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = args.provinceCode
      ? await ctx.db
          .query("notes")
          .withIndex("by_province", (q) => q.eq("provinceCode", args.provinceCode))
          .filter((q) => q.eq(q.field("userId"), args.userId))
          .first()
      : null;

    if (existing) {
      await ctx.db.patch(existing._id, {
        title: args.title,
        textContent: args.textContent,
        drawingStrokes: args.drawingStrokes,
        mapSnapshotUrl: args.mapSnapshotUrl,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("notes", {
        userId: args.userId,
        provinceCode: args.provinceCode,
        regionId: args.regionId,
        title: args.title,
        textContent: args.textContent,
        drawingStrokes: args.drawingStrokes,
        mapSnapshotUrl: args.mapSnapshotUrl,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});
