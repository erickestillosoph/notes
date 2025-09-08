import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    isArchived: v.boolean(),
    userId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    title: v.string(),
    content: v.string(),
    image: v.optional(v.string()), // Keep as string for now
    tags: v.array(v.string()),
    crimesDone: v.optional(v.string()),
    location: v.optional(v.string()),
    jobDone: v.optional(v.string()),
    jobCategory: v.optional(v.string()),
    jobRole: v.optional(v.string()),
    category: v.optional(v.string()),
    name: v.optional(v.string()),
    status: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_archived", ["userId", "isArchived"])
    .searchIndex("search_notes", {
      searchField: "content",
      filterFields: ["userId", "isArchived"],
    }),

  userPreferences: defineTable({
    userId: v.string(),
    colorTheme: v.string(),
    fontTheme: v.string(),
  }).index("by_user", ["userId"]),
});
