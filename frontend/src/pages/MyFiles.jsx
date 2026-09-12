import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FolderOpen, Star, Download, Trash2, FileText, Video, Music, Archive, Image as ImageIcon, File as FileIcon, Upload } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import UploadModal from "../components/UploadModal.jsx";
import FileDetailsDrawer from "../components/FileDetailsDrawer.jsx";
import api from "../api/axios.js";
import { formatBytes, formatRelativeTime } from "../utils/format.js";
import toast from "react-hot-toast";

function getIcon(category) {
  if (category === "image") return ImageIcon;
  if (category === "video") return Video;
  if (category === "audio") return Music;
  if (category === "document") return FileText;
  if (category === "archive") return Archive;
  return FileIcon;
}

function categoryLabel(category) {
  if (!category) return "File";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function MyFiles(props) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [showUpload, setShowUpload] = useState(false);
  const [activeFile, setActiveFile] = useState(null);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";

  const sortMap = {
    newest: undefined,
    oldest: undefined,
    size_desc: "size_desc",
    size_asc: "size_asc",
    name_asc: "name_asc",
  };

  async function loadFiles() {
    setLoading(true);
    try {
      const res = await api.get("/files", {
        params: { search: search, category: category, sort: sortMap[sort] },
      });
      let list = res.data.files;
      if (sort === "oldest") {
        list = [...list].reverse();
      }
      setFiles(list);
    } catch (error) {
      toast.error("Could not load files");
    } finally {
      setLoading(false);
    }
  }

  useEffect(
    function () {
      const delay = setTimeout(loadFiles, 300);
      return function () {
        clearTimeout(delay);
      };
    },
    [search, category, sort]
  );

  function openUpload() {
    setShowUpload(true);
  }

  function handleUploaded(newFile) {
    setFiles(function (prev) {
      return [newFile, ...prev];
    });
  }

  async function handleToggleStar(id) {
    try {
      const res = await api.patch("/files/" + id + "/star");
      setFiles(function (prev) {
        return prev.map(function (f) {
          return f._id === id ? res.data.file : f;
        });
      });
      setActiveFile(function (prev) {
        return prev && prev._id === id ? res.data.file : prev;
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

  const categoryTitle = category === "all" ? "My Files" : categoryLabel(category) + "s";

  return (
    <DashboardLayout onSearch={setSearch} onUploadClick={openUpload}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-white">{categoryTitle}</h1>
        <select
          value={sort}
          onChange={function (e) {
            setSort(e.target.value);
          }}
          className="bg-white/5 border border-white/10 text-sm text-gray-300 rounded-lg px-3 py-2 outline-none focus:border-brand-cyan/50 w-full sm:w-auto"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="size_desc">Largest first</option>
          <option value="size_asc">Smallest first</option>
          <option value="name_asc">Name (A to Z)</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-1.5">
          {[1, 2, 3, 4, 5, 6].map(function (n) {
            return <div key={n} className="h-14 glass-panel rounded-lg skeleton-shimmer animate-shimmer"></div>;
          })}
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderOpen size={40} className="text-gray-600 mb-4" />
          <p className="text-gray-300 font-medium">No files here yet</p>
          <p className="text-sm text-gray-500 mt-1 mb-5">Upload a file to get started</p>
          <button onClick={openUpload} className="btn-cz-upload gap-2 font-semibold text-sm px-5 py-2.5 rounded-lg">
            <Upload size={16} />
            Upload a file
          </button>
        </div>
      ) : (
        <div className="cz-card rounded-xl p-3 sm:p-4">
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-3 pb-2 text-[11px] font-medium text-gray-500 uppercase tracking-wide">
            <span>Name</span>
            <span>Type</span>
            <span>Size</span>
            <span>Modified</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="space-y-0.5">
            {files.map(function (file) {
              const Icon = getIcon(file.fileCategory);
              return (
                <div
                  key={file._id}
                  className="cz-table-row grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2 sm:gap-4 px-3 py-2.5 rounded-lg"
                >
                  <button
                    onClick={function () {
                      setActiveFile(file);
                    }}
                    className="flex items-center gap-2.5 min-w-0 text-left"
                  >
                    <span className="w-8 h-8 rounded-lg bg-raised/70 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-gray-400" />
                    </span>
                    <span className="text-sm text-gray-200 truncate" title={file.name}>
                      {file.name}
                    </span>
                  </button>
                  <span className="hidden sm:block">
                    <span className="text-[11px] font-medium text-gray-300 bg-white/5 border border-white/10 rounded px-2 py-0.5 capitalize">
                      {categoryLabel(file.fileCategory)}
                    </span>
                  </span>
                  <span className="hidden sm:block text-sm text-gray-400">{formatBytes(file.size)}</span>
                  <span className="hidden sm:block text-sm text-gray-500">{formatRelativeTime(file.createdAt)}</span>
                  <span className="flex items-center justify-end gap-1">
                    <button
                      onClick={function () {
                        handleToggleStar(file._id);
                      }}
                      title="Star"
                      className={
                        "p-1.5 rounded hover:bg-white/5 transition-colors " +
                        (file.isStarred ? "text-brand-cyan" : "text-gray-500 hover:text-brand-cyan")
                      }
                    >
                      <Star size={14} fill={file.isStarred ? "currentColor" : "none"} />
                    </button>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      title="Download"
                      className="p-1.5 rounded text-gray-500 hover:text-brand-cyan hover:bg-white/5 transition-colors"
                    >
                      <Download size={14} />
                    </a>
                    <button
                      onClick={function () {
                        handleTrash(file._id);
                      }}
                      title="Move to trash"
                      className="p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showUpload ? (
        <UploadModal onClose={function () { setShowUpload(false); }} onUploaded={handleUploaded} />
      ) : null}

      {activeFile ? (
        <FileDetailsDrawer
          file={activeFile}
          onClose={function () { setActiveFile(null); }}
          onToggleStar={handleToggleStar}
          onTrash={handleTrash}
          onFileUpdate={setActiveFile}
        />
      ) : null}
    </DashboardLayout>
  );
}

export default MyFiles;
