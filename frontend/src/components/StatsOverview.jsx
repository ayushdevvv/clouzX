import React from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Copy, HardDrive, TrendingUp, Files } from "lucide-react";
import { formatBytes } from "../utils/format.js";

const CATEGORY_COLORS = {
  image: "#d4af37",
  video: "#5b8def",
  document: "#7c8ff0",
  audio: "#e8c766",
  archive: "#8b95a8",
  other: "#4a5468",
};

function StatsOverview(props) {
  const stats = props.stats;

  if (!stats) return null;

  const chartData = (stats.categoryStats || []).map(function (c) {
    return { name: c._id, value: c.totalSize, count: c.count };
  });

  const percentUsed = stats.storageLimit > 0 ? Math.min(100, (stats.storageUsed / stats.storageLimit) * 100) : 0;

  return (
    <div className="grid lg:grid-cols-3 gap-4 mb-8">
      <div className="glass-panel p-5 flex items-center gap-5">
        <div className="w-24 h-24 shrink-0 relative">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" innerRadius={30} outerRadius={44} paddingAngle={2} stroke="none">
                  {chartData.map(function (entry, index) {
                    return <Cell key={index} fill={CATEGORY_COLORS[entry.name] || "#4a5468"} />;
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full rounded-full border-4 border-white/5"></div>
          )}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <HardDrive size={16} className="text-gold" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-1">Storage used</p>
          <p className="text-lg font-display font-bold text-white">
            {formatBytes(stats.storageUsed)} <span className="text-sm font-normal text-gray-500">/ {formatBytes(stats.storageLimit)}</span>
          </p>
          <div className="h-1.5 w-full progress-track mt-2">
            <div className="h-1.5 progress-fill" style={{ width: percentUsed + "%" }}></div>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {chartData.slice(0, 3).map(function (c) {
              return (
                <span key={c.name} className="flex items-center gap-1 text-[11px] text-gray-400 capitalize">
                  <span className="w-1.5 h-1.5" style={{ backgroundColor: CATEGORY_COLORS[c.name] || "#4a5468" }}></span>
                  {c.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <Link to="/dashboard/duplicates" className="glass-panel p-5 hover:border-gold/30 transition-colors group">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 bg-amber-500/10 flex items-center justify-center">
            <Copy size={16} className="text-amber-400" />
          </div>
          <TrendingUp size={14} className="text-gray-600 group-hover:text-gold transition-colors" />
        </div>
        <p className="text-2xl font-display font-bold text-white">{stats.duplicateGroupCount || 0}</p>
        <p className="text-xs text-gray-500 mt-1">
          Duplicate groups found
          {stats.duplicateWastedBytes > 0 ? " · " + formatBytes(stats.duplicateWastedBytes) + " wasted" : ""}
        </p>
      </Link>

      <Link to="/dashboard/large" className="glass-panel p-5 hover:border-gold/30 transition-colors group">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 bg-blue-500/10 flex items-center justify-center">
            <Files size={16} className="text-blue-400" />
          </div>
          <TrendingUp size={14} className="text-gray-600 group-hover:text-gold transition-colors" />
        </div>
        <p className="text-2xl font-display font-bold text-white">{stats.largeFilesCount || 0}</p>
        <p className="text-xs text-gray-500 mt-1">Large files over 5 MB</p>
      </Link>
    </div>
  );
}

export default StatsOverview;
