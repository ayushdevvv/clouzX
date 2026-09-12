import React from "react";
import { ArrowRight } from "lucide-react";
import { formatBytes } from "../utils/format.js";

const SECTIONS = [
  { key: "today", label: "Today", dot: "bg-emerald-400" },
  { key: "yesterday", label: "Yesterday", dot: "bg-brand-cyan" },
  { key: "thisWeek", label: "This Week", dot: "bg-brand-violet" },
  { key: "earlier", label: "Earlier", dot: "bg-gray-500" },
];

function TimelinePanel(props) {
  const summary = props.summary || {};

  return (
    <div className="cz-card rounded-xl p-4 sm:p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Timeline</h3>
        <a href="#browse-files" className="flex items-center gap-1 text-xs text-brand-cyan hover:gap-1.5 transition-all">
          View all
          <ArrowRight size={12} />
        </a>
      </div>

      <div className="relative pl-4">
        <div className="absolute left-[5px] top-1 bottom-1 w-px bg-white/10"></div>
        <div className="space-y-4">
          {SECTIONS.map(function (section) {
            const data = summary[section.key] || { count: 0, size: 0 };
            return (
              <div key={section.key} className="relative">
                <span
                  className={"absolute -left-4 top-1.5 w-2 h-2 rounded-full " + section.dot}
                  style={{ boxShadow: "0 0 0 3px #060d1a" }}
                ></span>
                <p className="text-sm font-medium text-gray-200">{section.label}</p>
                <p className="text-xs text-gray-500">
                  {data.count} file{data.count === 1 ? "" : "s"} · {formatBytes(data.size)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TimelinePanel;
