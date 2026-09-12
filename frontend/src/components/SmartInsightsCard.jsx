import React from "react";
import { Link } from "react-router-dom";
import { Lightbulb, ArrowRight } from "lucide-react";
import { formatBytes } from "../utils/format.js";

function buildInsight(stats) {
  if (!stats || !stats.totalFiles) {
    return { text: "Upload your first file to start seeing insights here.", to: null };
  }

  const parts = [];

  if (stats.duplicateGroupCount > 0) {
    parts.push(
      "You have " +
        stats.duplicateGroupCount +
        " duplicate group" +
        (stats.duplicateGroupCount === 1 ? "" : "s") +
        (stats.duplicateWastedBytes > 0 ? " (" + formatBytes(stats.duplicateWastedBytes) + " recoverable)" : "")
    );
  }

  if (stats.largeFilesCount > 0) {
    parts.push(
      (parts.length ? "and " : "You have ") +
        stats.largeFilesCount +
        " large file" +
        (stats.largeFilesCount === 1 ? "" : "s") +
        " (> " +
        formatBytes(stats.largeFileThresholdBytes || 5242880) +
        ")"
    );
  }

  if (parts.length === 0) {
    return { text: "Your storage looks clean — no duplicates or oversized files right now.", to: null };
  }

  return { text: parts.join(" ") + ".", to: stats.duplicateGroupCount > 0 ? "/dashboard/duplicates" : "/dashboard/large" };
}

function SmartInsightsCard(props) {
  const insight = buildInsight(props.stats);

  return (
    <div className="cz-card rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-brand-cyan/10 flex items-center justify-center">
            <Lightbulb size={14} className="text-brand-cyan" />
          </span>
          Smart Insights
        </h3>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed mb-3">{insight.text}</p>
      {insight.to ? (
        <Link to={insight.to} className="flex items-center gap-1 text-xs font-medium text-brand-cyan hover:gap-1.5 transition-all">
          View details
          <ArrowRight size={12} />
        </Link>
      ) : null}
    </div>
  );
}

export default SmartInsightsCard;
