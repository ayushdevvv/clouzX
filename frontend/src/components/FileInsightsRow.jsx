import React from "react";
import { Link } from "react-router-dom";
import { Files, Copy, PieChart, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatBytes } from "../utils/format.js";

function FileInsightsRow(props) {
  const stats = props.stats;
  if (!stats) return null;

  const mostUsed = (stats.categoryStats || [])[0];
  const percentOfStorage =
    mostUsed && stats.storageUsed > 0 ? Math.round((mostUsed.totalSize / stats.storageUsed) * 100) : 0;

  const hasGrowth = stats.growthPercent !== null && stats.growthPercent !== undefined;
  const GrowthIcon = !hasGrowth || stats.growthPercent === 0 ? Minus : stats.growthPercent > 0 ? TrendingUp : TrendingDown;
  const growthColor =
    !hasGrowth || stats.growthPercent === 0 ? "text-gray-400" : stats.growthPercent > 0 ? "text-emerald-400" : "text-red-400";

  const cards = [
    {
      key: "large",
      icon: Files,
      iconBg: "bg-blue-500/10 text-blue-400",
      value: String(stats.largeFilesCount || 0),
      valueSuffix: " files",
      label: "Large Files",
      sub: "> " + formatBytes(stats.largeFileThresholdBytes || 5242880),
      to: "/dashboard/large",
    },
    {
      key: "duplicates",
      icon: Copy,
      iconBg: "bg-amber-500/10 text-amber-400",
      value: String(stats.duplicateGroupCount || 0),
      valueSuffix: " groups",
      label: "Duplicate Groups",
      sub: stats.duplicateWastedBytes > 0 ? formatBytes(stats.duplicateWastedBytes) + " recoverable" : "None found",
      to: "/dashboard/duplicates",
    },
    {
      key: "mostused",
      icon: PieChart,
      iconBg: "bg-brand-violet/10 text-brand-violet",
      value: mostUsed && mostUsed._id ? mostUsed._id.charAt(0).toUpperCase() + mostUsed._id.slice(1) + "s" : "—",
      valueSuffix: "",
      label: "Most Used Type",
      sub: mostUsed ? percentOfStorage + "% of storage" : "No files yet",
      to: null,
    },
    {
      key: "growth",
      icon: GrowthIcon,
      iconBg: "bg-emerald-500/10 " + growthColor,
      value: hasGrowth ? (stats.growthPercent > 0 ? "+" : "") + stats.growthPercent + "%" : "—",
      valueSuffix: "",
      label: "Growth",
      sub: "vs last week",
      to: null,
    },
  ];

  return (
    <div className="cz-card rounded-xl p-4 sm:p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">File Insights</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map(function (card) {
          const Icon = card.icon;
          const Wrapper = card.to ? Link : "div";
          const wrapperProps = card.to ? { to: card.to } : {};
          return (
            <Wrapper
              key={card.key}
              {...wrapperProps}
              className={"p-3.5 rounded-lg bg-white/[0.02] border border-white/5" + (card.to ? " hover:border-white/15 transition-colors" : "")}
            >
              <div className={"cz-icon-tile mb-2.5 w-9 h-9 " + card.iconBg}>
                <Icon size={16} />
              </div>
              <p className="text-base font-display font-bold text-white truncate">
                {card.value}
                {card.valueSuffix ? <span className="text-xs font-normal text-gray-500">{card.valueSuffix}</span> : null}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{card.label}</p>
              <p className="text-[11px] text-gray-600 mt-0.5">{card.sub}</p>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}

export default FileInsightsRow;
