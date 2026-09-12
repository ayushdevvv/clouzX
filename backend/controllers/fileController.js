import crypto from "crypto";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import File from "../models/File.js";
import User from "../models/User.js";
import hashBuffer from "../utils/hashBuffer.js";
import generateFileIntelligence from "../utils/generateFileIntelligence.js";

const LARGE_FILE_THRESHOLD_BYTES = 5 * 1024 * 1024;

function getFileCategory(mimeType) {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (
    mimeType === "application/pdf" ||
    mimeType === "application/msword" ||
    mimeType.includes("wordprocessingml") ||
    mimeType.includes("spreadsheetml") ||
    mimeType === "text/plain"
  )
    return "document";
  if (
    mimeType === "application/zip" ||
    mimeType === "application/x-rar-compressed" ||
    mimeType === "application/x-7z-compressed"
  )
    return "archive";
  return "other";
}

function getResourceType(mimeType) {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "raw";
}

function streamUpload(buffer, options) {
  return new Promise(function (resolve, reject) {
    const uploadStream = cloudinary.uploader.upload_stream(options, function (error, result) {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const user = req.user;
    const fileSize = req.file.size;

    if (user.storageUsed + fileSize > user.storageLimit) {
      return res.status(400).json({ message: "Storage limit exceeded. Free up space or upgrade." });
    }

    const resourceType = getResourceType(req.file.mimetype);
    const fileCategory = getFileCategory(req.file.mimetype);
    const fileHash = hashBuffer(req.file.buffer);

    const result = await streamUpload(req.file.buffer, {
      folder: "clouzx/" + user._id,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    });

    const intelligence = await generateFileIntelligence({
      name: req.file.originalname,
      category: fileCategory,
      mimeType: req.file.mimetype,
      sizeBytes: fileSize,
    });

    const newFile = await File.create({
      owner: user._id,
      name: req.file.originalname,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileCategory: fileCategory,
      size: fileSize,
      url: result.secure_url,
      cloudinaryId: result.public_id,
      resourceType: resourceType,
      fileHash: fileHash,
      tags: intelligence.tags,
      aiInsight: intelligence.insight,
      aiProcessed: true,
    });

    await User.findByIdAndUpdate(user._id, { $inc: { storageUsed: fileSize } });

    const duplicateCount = await File.countDocuments({
      owner: user._id,
      fileHash: fileHash,
      isTrashed: false,
      _id: { $ne: newFile._id },
    });

    res.status(201).json({ file: newFile, isDuplicate: duplicateCount > 0 });
  } catch (error) {
    res.status(500).json({ message: error.message || "Upload failed" });
  }
}

async function getFiles(req, res) {
  try {
    const { search, category, starred, sort } = req.query;

    const query = { owner: req.user._id, isTrashed: false };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "all") {
      query.fileCategory = category;
    }

    if (starred === "true") {
      query.isStarred = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === "size_desc") sortOption = { size: -1 };
    if (sort === "size_asc") sortOption = { size: 1 };
    if (sort === "name_asc") sortOption = { name: 1 };

    const files = await File.find(query).sort(sortOption);

    res.status(200).json({ files: files });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getTimeline(req, res) {
  try {
    const { search, category } = req.query;

    const query = { owner: req.user._id, isTrashed: false };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "all") {
      query.fileCategory = category;
    }

    const files = await File.find(query).sort({ createdAt: -1 });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const groups = { today: [], yesterday: [], thisWeek: [], earlier: [] };

    files.forEach(function (file) {
      const createdAt = new Date(file.createdAt);
      if (createdAt >= startOfToday) {
        groups.today.push(file);
      } else if (createdAt >= startOfYesterday) {
        groups.yesterday.push(file);
      } else if (createdAt >= startOfWeek) {
        groups.thisWeek.push(file);
      } else {
        groups.earlier.push(file);
      }
    });

    res.status(200).json({ groups: groups, totalFiles: files.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getTrashedFiles(req, res) {
  try {
    const files = await File.find({ owner: req.user._id, isTrashed: true }).sort({ trashedAt: -1 });

    res.status(200).json({ files: files });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getDuplicates(req, res) {
  try {
    const groups = await File.aggregate([
      { $match: { owner: req.user._id, isTrashed: false, fileHash: { $ne: null } } },
      {
        $group: {
          _id: "$fileHash",
          count: { $sum: 1 },
          totalSize: { $sum: "$size" },
          files: { $push: "$$ROOT" },
        },
      },
      { $match: { count: { $gt: 1 } } },
      { $sort: { totalSize: -1 } },
    ]);

    const duplicateGroups = groups.map(function (group) {
      const perCopySize = group.files[0] ? group.files[0].size : 0;
      const wastedBytes = perCopySize * (group.count - 1);
      return {
        hash: group._id,
        count: group.count,
        wastedBytes: wastedBytes,
        files: group.files.sort(function (a, b) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }),
      };
    });

    const totalWastedBytes = duplicateGroups.reduce(function (sum, g) {
      return sum + g.wastedBytes;
    }, 0);

    res.status(200).json({ groups: duplicateGroups, totalWastedBytes: totalWastedBytes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getLargeFiles(req, res) {
  try {
    const files = await File.find({ owner: req.user._id, isTrashed: false }).sort({ size: -1 });

    const totalSize = files.reduce(function (sum, f) {
      return sum + f.size;
    }, 0);

    const filesWithImpact = files.map(function (file) {
      return {
        ...file.toObject(),
        percentOfTotal: totalSize > 0 ? Number(((file.size / totalSize) * 100).toFixed(1)) : 0,
        isLarge: file.size >= LARGE_FILE_THRESHOLD_BYTES,
      };
    });

    res.status(200).json({
      files: filesWithImpact,
      threshold: LARGE_FILE_THRESHOLD_BYTES,
      totalSize: totalSize,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function toggleStar(req, res) {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.isStarred = !file.isStarred;
    await file.save();

    res.status(200).json({ file: file });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function trashFile(req, res) {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.isTrashed = true;
    file.trashedAt = new Date();
    await file.save();

    res.status(200).json({ message: "File moved to trash" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function restoreFile(req, res) {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.isTrashed = false;
    file.trashedAt = null;
    await file.save();

    res.status(200).json({ message: "File restored" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteFilePermanently(req, res) {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    try {
      await cloudinary.uploader.destroy(file.cloudinaryId, { resource_type: file.resourceType });
    } catch (cloudinaryError) {
      console.log("Cloudinary destroy failed, continuing with local cleanup: " + cloudinaryError.message);
    }

    await User.findByIdAndUpdate(req.user._id, { $inc: { storageUsed: -file.size } });

    await file.deleteOne();

    res.status(200).json({ message: "File permanently deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not delete file" });
  }
}

async function getStorageStats(req, res) {
  try {
    const user = req.user;

    const categoryStats = await File.aggregate([
      { $match: { owner: user._id, isTrashed: false } },
      { $group: { _id: "$fileCategory", totalSize: { $sum: "$size" }, count: { $sum: 1 } } },
      { $sort: { totalSize: -1 } },
    ]);

    const totalFiles = await File.countDocuments({ owner: user._id, isTrashed: false });

    const duplicateGroups = await File.aggregate([
      { $match: { owner: user._id, isTrashed: false, fileHash: { $ne: null } } },
      { $group: { _id: "$fileHash", count: { $sum: 1 }, size: { $first: "$size" } } },
      { $match: { count: { $gt: 1 } } },
    ]);

    const duplicateWastedBytes = duplicateGroups.reduce(function (sum, g) {
      return sum + g.size * (g.count - 1);
    }, 0);

    const largestFiles = await File.find({ owner: user._id, isTrashed: false })
      .sort({ size: -1 })
      .limit(5);

    const largeFilesCount = await File.countDocuments({
      owner: user._id,
      isTrashed: false,
      size: { $gte: LARGE_FILE_THRESHOLD_BYTES },
    });

    const recentFiles = await File.find({ owner: user._id, isTrashed: false })
      .sort({ createdAt: -1 })
      .limit(6);

    const sharedFilesCount = await File.countDocuments({ owner: user._id, shareEnabled: true });

    const sharedThisWeekCount = await File.countDocuments({
      owner: user._id,
      shareEnabled: true,
      updatedAt: { $gte: (function () {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d;
      })() },
    });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const startOfPrevWeek = new Date(startOfWeek);
    startOfPrevWeek.setDate(startOfPrevWeek.getDate() - 7);

    const timelineFiles = await File.find({ owner: user._id, isTrashed: false }).select("size createdAt");

    const timelineSummary = {
      today: { count: 0, size: 0 },
      yesterday: { count: 0, size: 0 },
      thisWeek: { count: 0, size: 0 },
      earlier: { count: 0, size: 0 },
    };

    timelineFiles.forEach(function (f) {
      const createdAt = new Date(f.createdAt);
      let bucket = "earlier";
      if (createdAt >= startOfToday) bucket = "today";
      else if (createdAt >= startOfYesterday) bucket = "yesterday";
      else if (createdAt >= startOfWeek) bucket = "thisWeek";
      timelineSummary[bucket].count += 1;
      timelineSummary[bucket].size += f.size;
    });

    const filesThisWeek = timelineSummary.today.count + timelineSummary.yesterday.count + timelineSummary.thisWeek.count;

    const filesPrevWeek = await File.countDocuments({
      owner: user._id,
      isTrashed: false,
      createdAt: { $gte: startOfPrevWeek, $lt: startOfWeek },
    });

    let growthPercent = null;
    if (filesPrevWeek > 0) {
      growthPercent = Number((((filesThisWeek - filesPrevWeek) / filesPrevWeek) * 100).toFixed(0));
    } else if (filesThisWeek > 0) {
      growthPercent = 100;
    }

    res.status(200).json({
      storageUsed: user.storageUsed,
      storageLimit: user.storageLimit,
      totalFiles: totalFiles,
      categoryStats: categoryStats,
      duplicateGroupCount: duplicateGroups.length,
      duplicateWastedBytes: duplicateWastedBytes,
      largestFiles: largestFiles,
      largeFilesCount: largeFilesCount,
      recentFiles: recentFiles,
      sharedFilesCount: sharedFilesCount,
      sharedThisWeekCount: sharedThisWeekCount,
      filesThisWeek: filesThisWeek,
      timelineSummary: timelineSummary,
      growthPercent: growthPercent,
      largeFileThresholdBytes: LARGE_FILE_THRESHOLD_BYTES,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createShare(req, res) {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const { permission, expiresInHours } = req.body;

    file.shareEnabled = true;
    file.sharePermission = permission === "view" ? "view" : "download";

    if (!file.shareToken) {
      file.shareToken = crypto.randomBytes(16).toString("hex");
    }

    if (expiresInHours && Number(expiresInHours) > 0) {
      file.shareExpiresAt = new Date(Date.now() + Number(expiresInHours) * 60 * 60 * 1000);
    } else {
      file.shareExpiresAt = null;
    }

    await file.save();

    res.status(200).json({ file: file });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function revokeShare(req, res) {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Use $unset (not $set ... = null) so the field is removed from the
    // document entirely. The sparse unique index on shareToken only
    // skips documents where the field is absent - an explicit null is
    // still indexed and would collide with every other revoked file.
    await File.updateOne(
      { _id: file._id },
      {
        $set: { shareEnabled: false, shareViews: 0 },
        $unset: { shareToken: "", shareExpiresAt: "" },
      }
    );

    res.status(200).json({ message: "Share link revoked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getSharedFiles(req, res) {
  try {
    const files = await File.find({ owner: req.user._id, shareEnabled: true }).sort({ updatedAt: -1 });

    res.status(200).json({ files: files });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getPublicSharedFile(req, res) {
  try {
    const file = await File.findOne({ shareToken: req.params.token, shareEnabled: true });

    if (!file) {
      return res.status(404).json({ message: "This share link is invalid or has been revoked" });
    }

    if (file.shareExpiresAt && new Date(file.shareExpiresAt) < new Date()) {
      file.shareEnabled = false;
      await file.save();
      return res.status(410).json({ message: "This share link has expired" });
    }

    file.shareViews = file.shareViews + 1;
    await file.save();

    res.status(200).json({
      file: {
        name: file.name,
        size: file.size,
        fileCategory: file.fileCategory,
        fileType: file.fileType,
        url: file.url,
        sharePermission: file.sharePermission,
        shareExpiresAt: file.shareExpiresAt,
        aiInsight: file.aiInsight,
        tags: file.tags,
        createdAt: file.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export {
  uploadFile,
  getFiles,
  getTimeline,
  getTrashedFiles,
  getDuplicates,
  getLargeFiles,
  toggleStar,
  trashFile,
  restoreFile,
  deleteFilePermanently,
  getStorageStats,
  createShare,
  revokeShare,
  getSharedFiles,
  getPublicSharedFile,
};
