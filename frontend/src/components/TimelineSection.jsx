import React from "react";
import FileCard from "./FileCard.jsx";

const SECTION_LABELS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "thisWeek", label: "This week" },
  { key: "earlier", label: "Earlier" },
];

function TimelineSection(props) {
  const groups = props.groups;
  const duplicateHashes = props.duplicateHashes || new Set();

  return (
    <div className="space-y-8">
      {SECTION_LABELS.map(function (section) {
        const files = groups[section.key] || [];
        if (files.length === 0) return null;

        return (
          <div key={section.key}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-sm font-semibold text-gray-300 tracking-wide">{section.label}</h2>
              <div className="h-px bg-white/5 flex-1"></div>
              <span className="text-xs text-gray-600">{files.length}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {files.map(function (file) {
                return (
                  <FileCard
                    key={file._id}
                    file={file}
                    isDuplicate={duplicateHashes.has(file.fileHash)}
                    onToggleStar={props.onToggleStar}
                    onTrash={props.onTrash}
                    onOpenDetails={props.onOpenDetails}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TimelineSection;
