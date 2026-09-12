import React, { useState, useRef } from "react";
import { X, UploadCloud, File as FileIcon } from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

function UploadModal(props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);
  const { updateStorageUsed } = useAuth();

  function handleDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }

  function handleFileSelect(e) {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }

  async function handleUpload() {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);
    setProgress(0);

    try {
      const res = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: function (progressEvent) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      updateStorageUsed(res.data.file.size);
      toast.success("File uploaded");
      props.onUploaded(res.data.file);
      setSelectedFile(null);
      setUploading(false);
      setProgress(0);
      props.onClose();
    } catch (error) {
      const message = error.response && error.response.data ? error.response.data.message : "Upload failed";
      toast.error(message);
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="glass-panel-strong bg-panel/90 w-full max-w-md animate-fadeIn">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="font-display font-semibold text-white">Upload a file</h3>
          <button onClick={props.onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={function () {
              inputRef.current.click();
            }}
            className={
              "border-2 border-dashed h-44 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors " +
              (dragging ? "border-gold bg-raised" : "border-white/15 hover:border-gray-500")
            }
          >
            <input type="file" ref={inputRef} onChange={handleFileSelect} className="hidden" />
            {selectedFile ? (
              <React.Fragment>
                <FileIcon size={28} className="text-gold" />
                <p className="text-sm text-gray-200 px-4 text-center truncate max-w-full">{selectedFile.name}</p>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <UploadCloud size={28} className="text-gray-500" />
                <p className="text-sm text-gray-400">Drag and drop, or click to browse</p>
                <p className="text-xs text-gray-600">Max file size 50 MB</p>
              </React.Fragment>
            )}
          </div>

          {uploading ? (
            <div className="mt-4">
              <div className="h-1.5 w-full progress-track">
                <div className="h-1.5 progress-fill transition-all" style={{ width: progress + "%" }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{progress}%</p>
            </div>
          ) : null}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="btn-cz-upload gap-2 w-full mt-5 font-semibold py-2.5"
          >
            <UploadCloud size={16} />
            {uploading ? "Uploading..." : "Upload file"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
