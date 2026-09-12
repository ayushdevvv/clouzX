import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, Sparkles, AlertCircle, FileText, Video, Music, Archive, File as FileIcon } from "lucide-react";
import api from "../api/axios.js";
import Logo from "../components/Logo.jsx";
import { formatBytes, formatDate, timeRemaining } from "../utils/format.js";

function getIcon(category) {
  if (category === "video") return Video;
  if (category === "audio") return Music;
  if (category === "document") return FileText;
  if (category === "archive") return Archive;
  return FileIcon;
}

function SharePage(props) {
  const { token } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(
    function () {
      async function loadFile() {
        try {
          const res = await api.get("/public/share/" + token);
          setFile(res.data.file);
        } catch (err) {
          const message = err.response && err.response.data ? err.response.data.message : "This link is not available";
          setError(message);
        } finally {
          setLoading(false);
        }
      }
      loadFile();
    },
    [token]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/10 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center px-4 text-center">
        <div className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center mb-5">
          <AlertCircle size={24} className="text-gray-500" />
        </div>
        <h1 className="font-display text-xl font-bold text-white mb-2">Link unavailable</h1>
        <p className="text-sm text-gray-500 max-w-sm mb-6">{error}</p>
        <Link to="/" className="text-gold text-sm font-medium">
          Go to clouzX
        </Link>
      </div>
    );
  }

  const Icon = getIcon(file.fileCategory);

  return (
    <div className="min-h-screen bg-base flex flex-col items-center px-4 py-12">
      <div className="mb-8">
        <Logo size={28} />
      </div>

      <div className="w-full max-w-lg glass-panel-strong bg-panel/60 p-6 sm:p-8">
        <div className="h-56 bg-raised border border-white/10 flex items-center justify-center overflow-hidden mb-6">
          {file.fileCategory === "image" ? (
            <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
          ) : file.fileCategory === "video" ? (
            <video src={file.url} controls className="w-full h-full object-contain bg-black" />
          ) : (
            <Icon size={44} className="text-gray-600" strokeWidth={1.5} />
          )}
        </div>

        <h1 className="text-lg font-semibold text-white break-words">{file.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {formatBytes(file.size)} · Shared {formatDate(file.createdAt)}
          {file.shareExpiresAt ? " · " + timeRemaining(file.shareExpiresAt) : ""}
        </p>

        {file.aiInsight ? (
          <div className="mt-5 bg-white/5 border border-white/10 p-4">
            <div className="flex items-center gap-2 text-gold text-xs font-semibold mb-2 tracking-wide">
              <Sparkles size={13} />
              SMART INSIGHT
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{file.aiInsight}</p>
          </div>
        ) : null}

        {file.sharePermission === "download" ? (
          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 w-full flex items-center justify-center gap-2 bg-gold hover:bg-goldsoft text-base font-semibold text-sm py-3 transition-colors"
          >
            <Download size={16} />
            Download file
          </a>
        ) : (
          <p className="mt-6 text-center text-xs text-gray-500">The owner has restricted this link to viewing only.</p>
        )}
      </div>

      <p className="text-xs text-gray-600 mt-8">Shared securely with clouzX</p>
    </div>
  );
}

export default SharePage;
