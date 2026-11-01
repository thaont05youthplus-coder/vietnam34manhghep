import { query } from "./_generated/server";
import { v } from "convex/values";

export const listByFilters = query({
  args: {
    domain: v.optional(v.string()),
    topic: v.optional(v.string()),
    provinceCode: v.optional(v.string()),
    regionId: v.optional(v.string()),
    level: v.optional(v.union(v.literal("khai_quat"), v.literal("mo_rong"), v.literal("cu_the"))),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("question_bank").withIndex("by_status", (q) => q.eq("status", "published"));

    if (args.provinceCode) {
      return await q.filter((doc) => doc.eq(doc.field("provinceCode"), args.provinceCode)).collect();
    }
    if (args.regionId) {
      return await q.filter((doc) => doc.eq(doc.field("regionId"), args.regionId)).collect();
    }
    if (args.domain) {
      return await q.filter((doc) => doc.eq(doc.field("domain"), args.domain)).collect();
    }
    return await q.take(50);
  },
});
