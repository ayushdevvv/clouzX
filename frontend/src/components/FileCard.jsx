import React from "react";
import { motion } from "framer-motion";
import {
  Star,
  Trash2,
  Download,
  RotateCcw,
  XCircle,
  FileText,
  Video,
  Music,
  Archive,
  File as FileIcon,
  Link2,
  Info,
} from "lucide-react";
import { formatBytes, formatRelativeTime } from "../utils/format.js";

function getIcon(category) {
  if (category === "video") return Video;
  if (category === "audio") return Music;
  if (category === "document") return FileText;
  if (category === "archive") return Archive;
  return FileIcon;
}

function FileCard(props) {
  const file = props.file;
  const Icon = getIcon(file.fileCategory);
  const isTrashView = props.isTrashView;

  function handleCardClick(e) {
    if (e.target.closest("[data-stop-propagation]")) return;
    if (props.onOpenDetails) props.onOpenDetails(file);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="group relative cz-card rounded-xl hover:border-brand-cyan/40 hover:shadow-card transition-colors duration-300 cursor-pointer overflow-hidden"
    >
      <div className="h-36 bg-raised/60 flex items-center justify-center overflow-hidden border-b border-white/5 relative">
        {file.fileCategory === "image" ? (
          <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <Icon size={34} className="text-gray-500" strokeWidth={1.5} />
        )}

        <div className="absolute top-2 left-2 flex items-center gap-1">
          <span className="text-[10px] font-medium bg-black/60 backdrop-blur-sm text-gray-300 px-2 py-0.5 border border-white/10 capitalize">
            {file.fileCategory}
          </span>
        </div>

        {file.shareEnabled ? (
          <div className="absolute top-2 right-2">
            <span className="flex items-center gap-1 text-[10px] font-medium bg-gradient-to-br from-brand-cyan to-brand-violet text-white rounded px-2 py-0.5">
              <Link2 size={10} />
              Shared
            </span>
          </div>
        ) : null}

        {props.isDuplicate ? (
          <div className="absolute bottom-2 left-2">
            <span className="text-[10px] font-medium bg-amber-500/90 text-black rounded px-2 py-0.5">Duplicate</span>
          </div>
        ) : null}
      </div>

      <div className="p-3">
        <p className="text-sm font-medium text-gray-200 truncate" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {formatBytes(file.size)} · {formatRelativeTime(file.createdAt)}
        </p>

        {file.tags && file.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1 mt-2">
            {file.tags.slice(0, 3).map(function (tag) {
              return (
                <span key={tag} className="text-[10px] text-gray-400 bg-white/5 border border-white/10 px-1.5 py-0.5">
                  {tag}
                </span>
              );
            })}
          </div>
        ) : null}

        <div data-stop-propagation className="flex items-center gap-1 mt-3 pt-3 border-t border-white/5">
          {isTrashView ? (
            <React.Fragment>
              <button
                onClick={function () {
                  props.onRestore(file._id);
                }}
                title="Restore"
                className="flex-1 flex items-center justify-center py-1.5 text-gray-400 hover:text-gold hover:bg-white/5 transition-colors"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={function () {
                  props.onDeletePermanent(file._id);
                }}
                title="Delete forever"
                className="flex-1 flex items-center justify-center py-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
              >
                <XCircle size={15} />
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <button
                onClick={function () {
                  props.onOpenDetails(file);
                }}
                title="Details"
                className="flex-1 flex items-center justify-center py-1.5 text-gray-400 hover:text-gold hover:bg-white/5 transition-colors"
              >
                <Info size={15} />
              </button>
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                onClick={function (e) {
                  e.stopPropagation();
                }}
                title="Download"
                className="flex-1 flex items-center justify-center py-1.5 text-gray-400 hover:text-gold hover:bg-white/5 transition-colors"
              >
                <Download size={15} />
              </a>
              <button
                onClick={function () {
                  props.onToggleStar(file._id);
                }}
                title="Star"
                className={
                  "flex-1 flex items-center justify-center py-1.5 hover:bg-white/5 transition-colors " +
                  (file.isStarred ? "text-gold" : "text-gray-400 hover:text-gold")
                }
              >
                <Star size={15} fill={file.isStarred ? "#d4af37" : "none"} />
              </button>
              <button
                onClick={function () {
                  props.onTrash(file._id);
                }}
                title="Move to trash"
                className="flex-1 flex items-center justify-center py-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </React.Fragment>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default FileCard;
