import React from "react";
import { Link } from "react-router-dom";
import { Layers, FileText, Link2, Files } from "lucide-react";
import { formatBytes } from "../utils/format.js";

function StatCardsRow(props) {
  const stats = props.stats;
  if (!stats) return null;

  const percentUsed = stats.storageLimit > 0 ? Math.min(100, (stats.storageUsed / stats.storageLimit) * 100) : 0;

  const cards = [
    {
      key: "storage",
      icon: Layers,
      iconBg: "bg-brand-cyan/10 text-brand-cyan",
      label: "Total Storage",
      value: formatBytes(stats.storageUsed),
      sub: "/ " + formatBytes(stats.storageLimit),
      progress: percentUsed,
      to: null,
    },
    {
      key: "files",
      icon: FileText,
      iconBg: "bg-brand-blue/10 text-brand-blue",
      label: "Total Files",
      value: String(stats.totalFiles || 0),
      sub: stats.filesThisWeek > 0 ? "+" + stats.filesThisWeek + " this week" : "No new files this week",
      to: null,
    },
    {
      key: "shared",
      icon: Link2,
      iconBg: "bg-brand-violet/10 text-brand-violet",
      label: "Shared Files",
      value: String(stats.sharedFilesCount || 0),
      sub:
        stats.sharedThisWeekCount > 0
          ? "+" + stats.sharedThisWeekCount + " this week"
          : "None updated this week",
      to: "/dashboard/shared",
    },
    {
      key: "large",
      icon: Files,
      iconBg: "bg-amber-400/10 text-amber-400",
      label: "Large Files",
      value: String(stats.largeFilesCount || 0),
      sub: "> " + formatBytes(stats.largeFileThresholdBytes || 5242880),
      to: "/dashboard/large",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map(function (card) {
        const Icon = card.icon;
        const Wrapper = card.to ? Link : "div";
        const wrapperProps = card.to ? { to: card.to } : {};

        return (
          <Wrapper
            key={card.key}
            {...wrapperProps}
            className="cz-card rounded-xl p-4 sm:p-5 hover:border-white/20 transition-colors"
          >
            <div className={"cz-icon-tile mb-3 " + card.iconBg}>
              <Icon size={18} />
            </div>
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className="text-lg sm:text-xl font-display font-bold text-white">
              {card.value}
              {card.sub && card.key === "storage" ? (
                <span className="text-xs font-normal text-gray-500"> {card.sub}</span>
              ) : null}
            </p>
            {card.key === "storage" ? (
              <div className="h-1.5 w-full progress-track rounded-full overflow-hidden mt-2.5">
                <div className="h-1.5 progress-fill rounded-full" style={{ width: card.progress + "%" }}></div>
              </div>
            ) : (
              <p className="text-[11px] text-gray-500 mt-1">{card.sub}</p>
            )}
          </Wrapper>
        );
      })}
    </div>
  );
}

export default StatCardsRow;
