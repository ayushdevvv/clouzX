import React from "react";
import {
  LayoutGrid,
  Star,
  Link2,
  Copy,
  Files,
  Trash2,
  Search,
  Upload,
  Bell,
  FileText,
  Archive,
  Image as ImageIcon,
  Video,
  Layers,
  MoreVertical,
  X,
  Settings,
  ArrowRight,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { label: "Overview", icon: LayoutGrid, active: true },
  { label: "Starred", icon: Star },
  { label: "Shared", icon: Link2 },
  { label: "Duplicates", icon: Copy },
  { label: "Large files", icon: Files },
  { label: "Trash", icon: Trash2 },
];

const STAT_CARDS = [
  {
    key: "storage",
    icon: Layers,
    iconClass: "bg-brand-cyan/10 text-brand-cyan",
    label: "Total Storage",
    value: "4.2 GB",
    sub: "/ 10 GB",
    progress: 42,
  },
  {
    key: "files",
    icon: FileText,
    iconClass: "bg-brand-blue/10 text-brand-blue",
    label: "Total Files",
    value: "243",
    sub: "+12% this week",
  },
  {
    key: "shared",
    icon: Link2,
    iconClass: "bg-brand-violet/10 text-brand-violet",
    label: "Shared Files",
    value: "18",
    sub: "+3 this week",
  },
  {
    key: "large",
    icon: Files,
    iconClass: "bg-amber-400/10 text-amber-400",
    label: "Large Files",
    value: "7",
    sub: "> 100 MB",
  },
];

const RECENT_FILES = [
  { name: "Project-Notes.pdf", meta: "2.4 MB · 2h ago", tag: "Documents", icon: FileText },
  { name: "Design-Assets.zip", meta: "12.9 MB · 5h ago", tag: "Archives", icon: Archive },
  { name: "Screenshot.png", meta: "1.2 MB · 8h ago", tag: "Images", icon: ImageIcon },
  { name: "Video-Edit.mp4", meta: "48.6 MB · 1d ago", tag: "Videos", icon: Video },
];

const TIMELINE_ITEMS = [
  { label: "Today", value: "3 files", dot: "bg-emerald-400" },
  { label: "Yesterday", value: "5 files", dot: "bg-brand-cyan" },
  { label: "This Week", value: "12 files", dot: "bg-brand-violet" },
  { label: "Earlier", value: "48 files", dot: "bg-gray-500" },
];

function OverviewPreview(props) {
  return (
    <div className="relative">
      {/* Floating: File Insights - top-left corner of the panel */}
      <div className="hidden xl:block absolute -top-14 -left-14 w-48 glass-panel-strong bg-panel/95 rounded-xl p-3.5 shadow-card z-20 animate-fadeIn">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-300">
            <FileText size={13} className="text-brand-cyan" />
            File Insights
          </div>
          <X size={12} className="text-gray-600" />
        </div>
        <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/10 rounded-lg p-2">
          <span className="w-7 h-7 rounded-md bg-raised/70 flex items-center justify-center shrink-0">
            <FileText size={13} className="text-gray-400" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] text-gray-200 truncate">Project-Notes.pdf</p>
            <p className="text-[10px] text-gray-500 truncate">Documents · PDF</p>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mt-2">Academic · Notes · PDF</p>
      </div>

      {/* Floating: Secure Sharing - top-right corner of the panel */}
      <div className="hidden xl:block absolute -top-14 -right-14 w-52 glass-panel-strong bg-panel/95 rounded-xl p-3.5 shadow-card z-20 animate-fadeIn">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-300">
            <Link2 size={13} className="text-brand-violet" />
            Secure Sharing
          </div>
          <X size={12} className="text-gray-600" />
        </div>
        <p className="text-[11px] text-emerald-400 font-medium mb-1">Link active</p>
        <p className="text-[10px] text-gray-500 mb-2.5">Anyone with the link can view</p>
        <button className="flex items-center gap-1.5 text-[11px] text-gray-300 border border-white/10 rounded-lg px-2.5 py-1.5 w-full justify-center hover:bg-white/5 transition-colors">
          <Settings size={11} />
          Manage
        </button>
      </div>

      {/* Floating: Screenshot.png - bottom-right corner of the panel */}
      <div className="hidden xl:flex absolute -bottom-14 -right-14 w-44 items-center gap-2.5 glass-panel-strong bg-panel/95 rounded-xl p-3 shadow-card z-20 animate-fadeIn">
        <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-cyan/20 to-brand-violet/20 border border-white/10 flex items-center justify-center shrink-0">
          <ImageIcon size={15} className="text-brand-cyan" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] text-gray-200 truncate">Screenshot.png</p>
          <p className="text-[10px] text-gray-500">1.2 MB</p>
        </div>
      </div>

      {/* Main overview panel - mirrors the real dashboard: navbar + sidebar + stat cards + recent files + timeline */}
      <div className="glass-panel-strong bg-panel/80 shadow-glow-brand rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 border-b border-white/5">
          <img src="/logo-mark.png" alt="clouzX" className="w-5 h-5 object-contain shrink-0" draggable={false} />
          <div className="cz-search hidden sm:flex items-center gap-2 rounded-lg px-2.5 py-1.5 flex-1 max-w-[220px]">
            <Search size={12} className="text-gray-500 shrink-0" />
            <span className="text-[11px] text-gray-500 truncate">Search files, folders, tags...</span>
          </div>
          <div className="flex-1 sm:flex-none"></div>
          <span className="hidden sm:flex items-center gap-1.5 btn-cz-upload text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shrink-0">
            <Upload size={12} />
            Upload
          </span>
          <Bell size={15} className="text-gray-400 shrink-0" />
          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            A
          </span>
        </div>

        <div className="flex">
          <div className="hidden sm:flex w-32 shrink-0 flex-col justify-between border-r border-white/5 p-2.5">
            <div className="space-y-1">
              {SIDEBAR_ITEMS.map(function (item) {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={
                      "flex items-center gap-2 text-[11px] px-2 py-1.5 rounded-md " +
                      (item.active ? "cz-nav-active" : "text-gray-500")
                    }
                  >
                    <ItemIcon size={12} />
                    {item.label}
                  </div>
                );
              })}
            </div>

            <div className="px-1">
              <div className="flex items-center justify-between text-[9px] text-gray-500 mb-1.5">
                <span>Storage</span>
                <span>4.2/10 GB</span>
              </div>
              <div className="h-1 w-full progress-track rounded-full overflow-hidden">
                <div className="h-1 progress-fill rounded-full" style={{ width: "42%" }}></div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-display text-sm font-bold text-white">
                  Good morning<span className="text-gradient-brand">, Ayush</span>
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">Here's what's happening with your files today.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {STAT_CARDS.map(function (card) {
                const Icon = card.icon;
                return (
                  <div key={card.key} className="cz-card rounded-lg p-2.5">
                    <div className={"w-6 h-6 rounded-md flex items-center justify-center mb-1.5 " + card.iconClass}>
                      <Icon size={12} />
                    </div>
                    <p className="text-[9px] text-gray-500 mb-0.5">{card.label}</p>
                    <p className="text-xs font-display font-bold text-white">
                      {card.value}
                      {card.key === "storage" ? <span className="text-[9px] font-normal text-gray-500"> {card.sub}</span> : null}
                    </p>
                    {card.key === "storage" ? (
                      <div className="h-1 w-full progress-track rounded-full overflow-hidden mt-1.5">
                        <div className="h-1 progress-fill rounded-full" style={{ width: card.progress + "%" }}></div>
                      </div>
                    ) : (
                      <p className="text-[9px] text-emerald-400 mt-0.5">{card.sub}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="cz-card rounded-lg p-2.5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-semibold text-gray-300">Recent Files</p>
                  <span className="flex items-center gap-1 text-[10px] text-brand-cyan">
                    View all
                    <ArrowRight size={9} />
                  </span>
                </div>
                <div className="space-y-1.5">
                  {RECENT_FILES.map(function (file) {
                    const FileIcon = file.icon;
                    return (
                      <div key={file.name} className="flex items-center gap-2 py-0.5">
                        <span className="w-6 h-6 rounded-md bg-raised/70 flex items-center justify-center shrink-0">
                          <FileIcon size={11} className="text-gray-400" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10.5px] text-gray-200 truncate">{file.name}</p>
                          <p className="text-[9px] text-gray-500 truncate">
                            {file.meta} <span className="text-gray-600">·</span> {file.tag}
                          </p>
                        </div>
                        <MoreVertical size={11} className="text-gray-600 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="cz-card rounded-lg p-2.5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-semibold text-gray-300">Timeline</p>
                  <span className="flex items-center gap-1 text-[10px] text-brand-cyan">
                    View all
                    <ArrowRight size={9} />
                  </span>
                </div>
                <div className="relative pl-3">
                  <div className="absolute left-[3px] top-1 bottom-1 w-px bg-white/10"></div>
                  <div className="space-y-2">
                    {TIMELINE_ITEMS.map(function (item) {
                      return (
                        <div key={item.label} className="relative">
                          <span
                            className={"absolute -left-3 top-1 w-1.5 h-1.5 rounded-full " + item.dot}
                            style={{ boxShadow: "0 0 0 2px #060d1a" }}
                          ></span>
                          <p className="text-[10.5px] text-gray-200">{item.label}</p>
                          <p className="text-[9px] text-gray-500">{item.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewPreview;
