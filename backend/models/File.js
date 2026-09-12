import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileCategory: {
      type: String,
      enum: ["image", "video", "audio", "document", "archive", "other"],
      default: "other",
    },
    size: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      default: "raw",
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    isTrashed: {
      type: Boolean,
      default: false,
    },
    trashedAt: {
      type: Date,
      default: null,
    },
    fileHash: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    aiInsight: {
      type: String,
      default: "",
    },
    aiProcessed: {
      type: Boolean,
      default: false,
    },
    shareEnabled: {
      type: Boolean,
      default: false,
    },
    shareToken: {
      type: String,
      // No default here on purpose: leaving this field completely absent
      // (rather than explicitly null) is what allows the sparse unique
      // index below to work for many unshared files at once. Mongoose
      // would otherwise write shareToken: null on every insert, and a
      // sparse index still indexes explicit nulls, causing E11000
      // duplicate key errors as soon as a second file was uploaded.
    },
    sharePermission: {
      type: String,
      enum: ["view", "download"],
      default: "download",
    },
    shareExpiresAt: {
      type: Date,
      default: null,
    },
    shareViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

fileSchema.index({ owner: 1, isTrashed: 1 });
fileSchema.index({ owner: 1, fileHash: 1 });
fileSchema.index({ shareToken: 1 }, { unique: true, sparse: true });
fileSchema.index({ name: "text" });

const File = mongoose.model("File", fileSchema);

export default File;
