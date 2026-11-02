import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("regions").collect();
  },
});

export const listByType = query({
  args: { type: v.union(v.literal("economic"), v.literal("natural")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("regions")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect();
  },
});

export const getByRegionId = query({
  args: { regionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("regions")
      .withIndex("by_region_id", (q) => q.eq("regionId", args.regionId))
      .first();
  },
});
