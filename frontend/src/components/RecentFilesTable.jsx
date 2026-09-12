import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Video, Music, Archive, Image as ImageIcon, File as FileIcon } from "lucide-react";
import { formatBytes, formatRelativeTime } from "../utils/format.js";

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

function TypeBadge(props) {
  return (
    <span className="text-[11px] font-medium text-gray-300 bg-white/5 border border-white/10 rounded px-2 py-0.5 capitalize">
      {props.label}
    </span>
  );
}

function RecentFilesTable(props) {
  const files = props.files || [];

  return (
    <div className="cz-card rounded-xl p-4 sm:p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Recent Files</h3>
        <Link to="/dashboard" className="flex items-center gap-1 text-xs text-brand-cyan hover:gap-1.5 transition-all">
          View all
          <ArrowRight size={12} />
        </Link>
      </div>

      {files.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-gray-500">No files yet. Upload something to get started.</p>
        </div>
      ) : (
        <React.Fragment>
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-2 pb-2 text-[11px] font-medium text-gray-500 uppercase tracking-wide">
            <span>Name</span>
            <span>Type</span>
            <span>Size</span>
            <span>Modified</span>
          </div>
          <div className="space-y-0.5">
            {files.map(function (file) {
              const Icon = getIcon(file.fileCategory);
              return (
                <button
                  key={file._id}
                  onClick={function () {
                    if (props.onOpenDetails) props.onOpenDetails(file);
                  }}
                  className="cz-table-row w-full text-left grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto] items-center gap-2 sm:gap-4 px-2 py-2.5 rounded-lg"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-raised/70 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-gray-400" />
                    </span>
                    <span className="text-sm text-gray-200 truncate" title={file.name}>
                      {file.name}
                    </span>
                  </span>
                  <span className="hidden sm:block">
                    <TypeBadge label={categoryLabel(file.fileCategory)} />
                  </span>
                  <span className="hidden sm:block text-sm text-gray-400">{formatBytes(file.size)}</span>
                  <span className="text-xs sm:text-sm text-gray-500 text-right sm:text-left">
                    {formatRelativeTime(file.createdAt)}
                  </span>
                </button>
              );
            })}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default RecentFilesTable;
