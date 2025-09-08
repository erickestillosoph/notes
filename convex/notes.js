import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all notes for a user
export const getNotes = query({
  args: {
    userId: v.string(),
    isArchived: v.optional(v.boolean()),
    tagFilter: v.optional(v.string()),
    crimesDone: v.optional(v.string()),
    location: v.optional(v.string()),
    jobDone: v.optional(v.string()),
    jobCategory: v.optional(v.string()),
    jobRole: v.optional(v.string()),
    category: v.optional(v.string()),
    name: v.optional(v.string()),
    status: v.optional(v.string()),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    image: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    if (args.isArchived !== undefined) {
      query = ctx.db
        .query("notes")
        .withIndex("by_user_archived", (q) =>
          q.eq("userId", args.userId).eq("isArchived", args.isArchived)
        );
    }

    let notes = await query.order("desc").collect();

    // Filter by tag if provided
    if (args.tagFilter) {
      notes = notes.filter((note) =>
        note.tags.some((tag) =>
          tag.toLowerCase().includes(args.tagFilter.toLowerCase())
        )
      );
    }

    return notes;
  },
});

// Search notes
export const searchNotes = query({
  args: {
    userId: v.string(),
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.searchTerm.trim()) {
      return await ctx.db
        .query("notes")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .order("desc")
        .collect();
    }

    const searchResults = await ctx.db
      .query("notes")
      .withSearchIndex("search_notes", (q) =>
        q
          .search("content", args.searchTerm)
          .eq("userId", args.userId)
          .eq("isArchived", false)
      )
      .collect();

    // Also search in title and tags
    const allNotes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const titleAndTagResults = allNotes.filter((note) => {
      const titleMatch = note.title
        .toLowerCase()
        .includes(args.searchTerm.toLowerCase());
      const tagMatch = note.tags.some((tag) =>
        tag.toLowerCase().includes(args.searchTerm.toLowerCase())
      );
      return (titleMatch || tagMatch) && !note.isArchived;
    });

    // Combine and deduplicate results
    const combinedResults = [...searchResults];
    titleAndTagResults.forEach((note) => {
      if (!combinedResults.find((existing) => existing._id === note._id)) {
        combinedResults.push(note);
      }
    });

    return combinedResults.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

// Get all unique tags for a user
export const getUserTags = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const tagSet = new Set();
    notes.forEach((note) => {
      note.tags.forEach((tag) => tagSet.add(tag));
    });

    return Array.from(tagSet).sort();
  },
});

export const createNote = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    tags: v.optional(v.array(v.string())), // Make optional to match schema
    userId: v.string(),
    crimesDone: v.optional(v.string()),
    location: v.optional(v.string()),
    jobDone: v.optional(v.string()),
    jobCategory: v.optional(v.string()),
    jobRole: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("notes", {
      title: args.title,
      name: args.name,
      status: args.status,
      category: args.category,
      crimesDone: args.crimesDone,
      location: args.location,
      jobDone: args.jobDone,
      jobCategory: args.jobCategory,
      jobRole: args.jobRole,
      image: args.image,
      content: args.content,
      tags: args.tags || [], // Provide default empty array if not provided
      isArchived: false,
      userId: args.userId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a note
export const updateNote = mutation({
  args: {
    id: v.id("notes"),
    title: v.string(),
    content: v.string(),
    image: v.optional(v.string()),
    tags: v.optional(v.array(v.string())), // Make optional to match schema
    userId: v.string(),
    crimesDone: v.optional(v.string()),
    location: v.optional(v.string()),
    jobDone: v.optional(v.string()),
    jobCategory: v.optional(v.string()),
    jobRole: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Archive/unarchive a note
export const toggleArchiveNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) throw new Error("Note not found");

    return await ctx.db.patch(args.id, {
      isArchived: !note.isArchived,
      updatedAt: Date.now(),
    });
  },
});

// Delete a note
export const deleteNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Generate upload URL for image
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save uploaded image to note (updated for string URLs)
export const saveImageToNote = mutation({
  args: {
    noteId: v.id("notes"),
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const imageUrl = await ctx.storage.getUrl(args.imageId);
    return await ctx.db.patch(args.noteId, {
      image: imageUrl, // Store the URL instead of the ID
      updatedAt: Date.now(),
    });
  },
});

// Get image URL from storage ID
export const getImageUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Delete image from storage
export const deleteImage = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.delete(args.storageId);
  },
});
