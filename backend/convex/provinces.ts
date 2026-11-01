import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("provinces").collect();
  },
});

export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("provinces")
      .withIndex("by_code", (q) => q.eq("provinceCode", args.code))
      .first();
  },
});

export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("provinces")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
  },
});

export const listByEconomicRegion = query({
  args: { regionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("provinces")
      .withIndex("by_economic_region", (q) => q.eq("economicRegionId", args.regionId))
      .collect();
  },
});

export const listByNaturalRegion = query({
  args: { regionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("provinces")
      .withIndex("by_natural_region", (q) => q.eq("naturalRegionId", args.regionId))
      .collect();
  },
});
