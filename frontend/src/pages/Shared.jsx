import React, { useState, useEffect } from "react";
import { Link2, Copy, Check, X } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import api from "../api/axios.js";
import { formatBytes, timeRemaining } from "../utils/format.js";
import toast from "react-hot-toast";

function Shared(props) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  async function loadFiles() {
    setLoading(true);
    try {
      const res = await api.get("/files/shared");
      setFiles(res.data.files);
    } catch (error) {
      toast.error("Could not load shared files");
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    loadFiles();
  }, []);

  function handleCopy(file) {
    const url = window.location.origin + "/share/" + file.shareToken;
    navigator.clipboard.writeText(url);
    setCopiedId(file._id);
    toast.success("Link copied");
    setTimeout(function () {
      setCopiedId(null);
    }, 2000);
  }

  async function handleRevoke(id) {
    try {
      await api.delete("/files/" + id + "/share");
      setFiles(function (prev) {
        return prev.filter(function (f) {
          return f._id !== id;
        });
      });
      toast.success("Share link revoked");
    } catch (error) {
      toast.error("Could not revoke link");
    }
  }

  return (
    <DashboardLayout showUploadButton={false}>
      <h1 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">Shared files</h1>
      <p className="text-sm text-gray-500 mb-6">Files with an active public share link.</p>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map(function (n) {
            return <div key={n} className="h-20 glass-panel skeleton-shimmer animate-shimmer"></div>;
          })}
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Link2 size={40} className="text-gray-600 mb-4" />
          <p className="text-gray-300 font-medium">No shared files</p>
          <p className="text-sm text-gray-500 mt-1">Open any file's details and create a share link</p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map(function (file) {
            return (
              <div key={file._id} className="glass-panel p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatBytes(file.size)} · <span className="capitalize">{file.sharePermission}</span> access ·{" "}
                    {file.shareExpiresAt ? timeRemaining(file.shareExpiresAt) : "Never expires"}
                    {file.shareViews > 0 ? " · " + file.shareViews + " views" : ""}
                  </p>
                </div>
                <button
                  onClick={function () {
                    handleCopy(file);
                  }}
                  className="p-2 text-gray-400 hover:text-gold border border-white/10 hover:bg-white/5 transition-colors shrink-0"
                  title="Copy link"
                >
                  {copiedId === file._id ? <Check size={15} /> : <Copy size={15} />}
                </button>
                <button
                  onClick={function () {
                    handleRevoke(file._id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-400 border border-white/10 hover:bg-white/5 transition-colors shrink-0"
                  title="Revoke"
                >
                  <X size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Shared;
