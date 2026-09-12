import React from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ArrowRight } from "lucide-react";
import { formatBytes } from "../utils/format.js";

const CATEGORY_COLORS = {
  image: "#4fd0ff",
  video: "#8b5cf6",
  document: "#3b6ef6",
  audio: "#e8c766",
  archive: "#34d399",
  other: "#5a6478",
};

function StorageUsageCard(props) {
  const stats = props.stats;
  if (!stats) return null;

  const chartData = (stats.categoryStats || []).map(function (c) {
    return { name: c._id, value: c.totalSize, count: c.count };
  });

  return (
    <div className="cz-card rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Storage Usage</h3>
        <Link to="/dashboard/large" className="text-gray-500 hover:text-white transition-colors">
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="flex flex-col items-center mb-4">
        <div className="w-32 h-32 relative cz-donut-ring">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" innerRadius={44} outerRadius={62} paddingAngle={3} stroke="none">
                  {chartData.map(function (entry, index) {
                    return <Cell key={index} fill={CATEGORY_COLORS[entry.name] || "#5a6478"} />;
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full rounded-full border-8 border-white/5"></div>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-base font-display font-bold text-white">{formatBytes(stats.storageUsed)}</p>
            <p className="text-[11px] text-gray-500">Used</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {chartData.length === 0 ? (
          <p className="text-xs text-gray-500 text-center">No files yet</p>
        ) : (
          chartData.map(function (c) {
            return (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-gray-400 capitalize">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[c.name] || "#5a6478" }}></span>
                  {c.name}s
                </span>
                <span className="text-gray-300">{formatBytes(c.value)}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default StorageUsageCard;
