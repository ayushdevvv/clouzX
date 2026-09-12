import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Star,
  Trash2,
  Link2,
  Copy,
  Check,
  Sparkles,
  Hash,
  Calendar,
  HardDrive,
  Eye,
  AlertTriangle,
} from "lucide-react";
import api from "../api/axios.js";
import { formatBytes, formatDateTime, timeRemaining } from "../utils/format.js";
import toast from "react-hot-toast";

function FileDetailsDrawer(props) {
  const file = props.file;
  const [permission, setPermission] = useState(file.sharePermission || "download");
  const [expiresInHours, setExpiresInHours] = useState("0");
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentFile, setCurrentFile] = useState(file);

  useEffect(
    function () {
      setCurrentFile(file);
      setPermission(file.sharePermission || "download");
    },
    [file]
  );

  const shareUrl = currentFile.shareToken ? window.location.origin + "/share/" + currentFile.shareToken : "";

  async function handleCreateShare() {
    setSharing(true);
    try {
      const res = await api.post("/files/" + currentFile._id + "/share", {
        permission: permission,
        expiresInHours: expiresInHours === "0" ? null : expiresInHours,
      });
      setCurrentFile(res.data.file);
      props.onFileUpdate(res.data.file);
      toast.success("Share link ready");
    } catch (error) {
      toast.error("Could not create share link");
    } finally {
      setSharing(false);
    }
  }

  async function handleRevokeShare() {
    setSharing(true);
    try {
      await api.delete("/files/" + currentFile._id + "/share");
      const updated = { ...currentFile, shareEnabled: false, shareToken: null, shareExpiresAt: null };
      setCurrentFile(updated);
      props.onFileUpdate(updated);
      toast.success("Share link revoked");
    } catch (error) {
      toast.error("Could not revoke share link");
    } finally {
      setSharing(false);
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(function () {
      setCopied(false);
    }, 2000);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={props.onClose}
        className="fixed inset-0 bg-black/70 z-50"
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
          onClick={function (e) {
            e.stopPropagation();
          }}
          className="fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-panel border-l border-white/10 overflow-y-auto"
        >
          <div className="sticky top-0 bg-panel/95 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-5 py-4 z-10">
            <h3 className="font-display font-semibold text-white">File details</h3>
            <button onClick={props.onClose} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="p-5 space-y-6">
            <div className="h-44 bg-raised flex items-center justify-center overflow-hidden border border-white/10">
              {currentFile.fileCategory === "image" ? (
                <img src={currentFile.url} alt={currentFile.name} className="w-full h-full object-cover" />
              ) : currentFile.fileCategory === "video" ? (
                <video src={currentFile.url} controls className="w-full h-full object-contain bg-black" />
              ) : (
                <HardDrive size={40} className="text-gray-600" strokeWidth={1.5} />
              )}
            </div>

            <div>
              <p className="text-base font-semibold text-white break-words">{currentFile.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {formatBytes(currentFile.size)} · {currentFile.fileCategory}
              </p>
            </div>

            {props.isDuplicate ? (
              <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-2.5 text-sm text-amber-300">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>This file has one or more exact duplicates in your storage.</span>
              </div>
            ) : null}

            {currentFile.aiInsight ? (
              <div className="glass-panel p-4">
                <div className="flex items-center gap-2 text-gold text-xs font-semibold mb-2 tracking-wide">
                  <Sparkles size={13} />
                  SMART INSIGHT
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{currentFile.aiInsight}</p>
                {currentFile.tags && currentFile.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {currentFile.tags.map(function (tag) {
                      return (
                        <span key={tag} className="text-[11px] text-gray-300 bg-white/5 border border-white/10 px-2 py-0.5">
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={15} className="text-gray-500 shrink-0" />
                <span className="text-gray-400">Uploaded</span>
                <span className="text-gray-200 ml-auto">{formatDateTime(currentFile.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Hash size={15} className="text-gray-500 shrink-0" />
                <span className="text-gray-400">Type</span>
                <span className="text-gray-200 ml-auto truncate max-w-[200px]">{currentFile.fileType}</span>
              </div>
              {currentFile.shareViews > 0 ? (
                <div className="flex items-center gap-3 text-sm">
                  <Eye size={15} className="text-gray-500 shrink-0" />
                  <span className="text-gray-400">Share views</span>
                  <span className="text-gray-200 ml-auto">{currentFile.shareViews}</span>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={currentFile.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-gold hover:bg-goldsoft text-base font-semibold text-sm py-2.5 transition-colors"
              >
                <Download size={15} />
                Download
              </a>
              <button
                onClick={function () {
                  props.onToggleStar(currentFile._id);
                }}
                className={
                  "px-3.5 py-2.5 border border-white/10 hover:bg-white/5 transition-colors " +
                  (currentFile.isStarred ? "text-gold" : "text-gray-300")
                }
              >
                <Star size={16} fill={currentFile.isStarred ? "#d4af37" : "none"} />
              </button>
              <button
                onClick={function () {
                  props.onTrash(currentFile._id);
                  props.onClose();
                }}
                className="px-3.5 py-2.5 border border-white/10 hover:bg-red-500/10 hover:text-red-400 text-gray-300 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="border-t border-white/10 pt-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
                <Link2 size={15} />
                Share link
              </div>

              {currentFile.shareEnabled ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-raised border border-white/10 px-3 py-2.5">
                    <span className="text-xs text-gray-300 truncate flex-1">{shareUrl}</span>
                    <button onClick={handleCopyLink} className="text-gray-400 hover:text-gold shrink-0">
                      {copied ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="capitalize">{currentFile.sharePermission} access</span>
                    <span>{currentFile.shareExpiresAt ? timeRemaining(currentFile.shareExpiresAt) : "Never expires"}</span>
                  </div>
                  <button
                    onClick={handleRevokeShare}
                    disabled={sharing}
                    className="w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 text-sm font-medium py-2.5 transition-colors"
                  >
                    {sharing ? "Revoking..." : "Revoke link"}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Access</label>
                      <select
                        value={permission}
                        onChange={function (e) {
                          setPermission(e.target.value);
                        }}
                        className="w-full bg-raised border border-white/10 text-sm text-gray-200 px-2.5 py-2 outline-none focus:border-gold/50"
                      >
                        <option value="download">View and download</option>
                        <option value="view">View only</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Expires</label>
                      <select
                        value={expiresInHours}
                        onChange={function (e) {
                          setExpiresInHours(e.target.value);
                        }}
                        className="w-full bg-raised border border-white/10 text-sm text-gray-200 px-2.5 py-2 outline-none focus:border-gold/50"
                      >
                        <option value="0">Never</option>
                        <option value="1">1 hour</option>
                        <option value="24">1 day</option>
                        <option value="168">7 days</option>
                        <option value="720">30 days</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={handleCreateShare}
                    disabled={sharing}
                    className="w-full bg-gold hover:bg-goldsoft disabled:opacity-50 text-base font-semibold text-sm py-2.5 transition-colors"
                  >
                    {sharing ? "Creating link..." : "Create share link"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FileDetailsDrawer;
