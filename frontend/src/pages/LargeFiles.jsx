import React, { useState, useEffect } from "react";
import { Files } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import FileDetailsDrawer from "../components/FileDetailsDrawer.jsx";
import api from "../api/axios.js";
import { formatBytes, formatRelativeTime } from "../utils/format.js";
import toast from "react-hot-toast";

function LargeFiles(props) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFile, setActiveFile] = useState(null);

  async function loadFiles() {
    setLoading(true);
    try {
      const res = await api.get("/files/large");
      setFiles(res.data.files);
    } catch (error) {
      toast.error("Could not load large files");
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    loadFiles();
  }, []);

  async function handleToggleStar(id) {
    try {
      const res = await api.patch("/files/" + id + "/star");
      setFiles(function (prev) {
        return prev.map(function (f) {
          return f._id === id ? { ...f, isStarred: res.data.file.isStarred } : f;
        });
      });
      setActiveFile(function (prev) {
        return prev && prev._id === id ? { ...prev, isStarred: res.data.file.isStarred } : prev;
      });
    } catch (error) {
      toast.error("Could not update file");
    }
  }

  async function handleTrash(id) {
    try {
      await api.patch("/files/" + id + "/trash");
      setFiles(function (prev) {
        return prev.filter(function (f) {
          return f._id !== id;
        });
      });
      toast.success("Moved to trash");
    } catch (error) {
      toast.error("Could not move file to trash");
    }
  }

  return (
    <DashboardLayout showUploadButton={false}>
      <h1 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">Large files</h1>
      <p className="text-sm text-gray-500 mb-6">Sorted by size, largest first. Files over 5 MB are flagged large.</p>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(function (n) {
            return <div key={n} className="h-16 glass-panel skeleton-shimmer animate-shimmer"></div>;
          })}
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Files size={40} className="text-gray-600 mb-4" />
          <p className="text-gray-300 font-medium">No files yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map(function (file) {
            return (
              <button
                key={file._id}
                onClick={function () {
                  setActiveFile(file);
                }}
                className="w-full text-left glass-panel p-4 hover:border-gold/30 transition-colors flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
                    {file.isLarge ? (
                      <span className="text-[10px] text-amber-400 border border-amber-500/30 px-1.5 py-0.5 shrink-0">
                        Large
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatBytes(file.size)} · {formatRelativeTime(file.createdAt)}
                  </p>
                  <div className="h-1 w-full progress-track mt-2 max-w-xs">
                    <div className="h-1 progress-fill" style={{ width: Math.max(file.percentOfTotal, 2) + "%" }}></div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 shrink-0">{file.percentOfTotal}% of storage</span>
              </button>
            );
          })}
        </div>
      )}

      {activeFile ? (
        <FileDetailsDrawer
          file={activeFile}
          onClose={function () {
            setActiveFile(null);
          }}
          onToggleStar={handleToggleStar}
          onTrash={handleTrash}
          onFileUpdate={function (updated) {
            setActiveFile(updated);
          }}
        />
      ) : null}
    </DashboardLayout>
  );
}

export default LargeFiles;
