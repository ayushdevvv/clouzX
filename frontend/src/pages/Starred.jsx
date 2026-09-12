import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import FileCard from "../components/FileCard.jsx";
import UploadModal from "../components/UploadModal.jsx";
import FileDetailsDrawer from "../components/FileDetailsDrawer.jsx";
import api from "../api/axios.js";
import toast from "react-hot-toast";

function Starred(props) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [activeFile, setActiveFile] = useState(null);

  async function loadFiles() {
    setLoading(true);
    try {
      const res = await api.get("/files", { params: { search: search, starred: "true" } });
      setFiles(res.data.files);
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
    [search]
  );

  function handleUploaded(newFile) {
    if (newFile.isStarred) {
      setFiles(function (prev) {
        return [newFile, ...prev];
      });
    }
  }

  async function handleToggleStar(id) {
    try {
      await api.patch("/files/" + id + "/star");
      setFiles(function (prev) {
        return prev.filter(function (f) {
          return f._id !== id;
        });
      });
      setActiveFile(null);
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
    <DashboardLayout onSearch={setSearch} onUploadClick={function () { setShowUpload(true); }}>
      <h1 className="font-display text-xl sm:text-2xl font-bold text-white mb-6">Starred</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map(function (n) {
            return <div key={n} className="h-48 sm:h-56 glass-panel skeleton-shimmer animate-shimmer"></div>;
          })}
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Star size={40} className="text-gray-600 mb-4" />
          <p className="text-gray-300 font-medium">No starred files</p>
          <p className="text-sm text-gray-500 mt-1">Star a file to find it here quickly</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {files.map(function (file) {
            return (
              <FileCard
                key={file._id}
                file={file}
                onToggleStar={handleToggleStar}
                onTrash={handleTrash}
                onOpenDetails={setActiveFile}
              />
            );
          })}
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

export default Starred;
