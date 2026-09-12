import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutGrid, Star, Trash2, Image, FileText, Video, Music, Archive, X, Copy, Files, Link2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { formatBytes } from "../utils/format.js";
import BrandLink from "./BrandLink.jsx";
import UpgradeProCard from "./UpgradeProCard.jsx";

function Sidebar(props) {
  const { user } = useAuth();

  const storageUsed = user ? user.storageUsed : 0;
  const storageLimit = user ? user.storageLimit : 1;
  const percentUsed = Math.min(100, (storageUsed / storageLimit) * 100);

  const navItems = [
    { to: "/dashboard", label: "Overview", icon: LayoutGrid, end: true },
    { to: "/dashboard/starred", label: "Starred", icon: Star, end: false },
    { to: "/dashboard/shared", label: "Shared", icon: Link2, end: false },
    { to: "/dashboard/duplicates", label: "Duplicates", icon: Copy, end: false },
    { to: "/dashboard/large", label: "Large files", icon: Files, end: false },
    { to: "/dashboard/trash", label: "Trash", icon: Trash2, end: false },
  ];

  const categoryItems = [
    { to: "/dashboard?category=image", label: "Images", icon: Image },
    { to: "/dashboard?category=video", label: "Videos", icon: Video },
    { to: "/dashboard?category=document", label: "Documents", icon: FileText },
    { to: "/dashboard?category=audio", label: "Audio", icon: Music },
    { to: "/dashboard?category=archive", label: "Archives", icon: Archive },
  ];

  function handleNavClick() {
    props.onClose();
  }

  return (
    <React.Fragment>
      {props.isOpen ? (
        <div onClick={props.onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"></div>
      ) : null}

      <aside
        className={
          "w-72 sm:w-64 shrink-0 bg-panel/95 lg:bg-panel border-r border-white/10 h-screen flex flex-col fixed top-0 left-0 z-40 transition-transform duration-300 lg:sticky lg:translate-x-0 " +
          (props.isOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <BrandLink size={26} />
          <button onClick={props.onClose} className="text-gray-400 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-5 px-3.5">
          <p className="text-[11px] font-semibold text-gray-600 px-2.5 mb-2 tracking-widest uppercase">Library</p>
          <ul className="space-y-1 mb-6">
            {navItems.map(function (item) {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={handleNavClick}
                    className={function (navData) {
                      const isActive = navData.isActive;
                      return (
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all " +
                        (isActive ? "cz-nav-active" : "text-gray-400 hover:bg-white/5 hover:text-gray-200")
                      );
                    }}
                  >
                    <Icon size={17} />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <p className="text-[11px] font-semibold text-gray-600 px-2.5 mb-2 tracking-widest uppercase">File types</p>
          <ul className="space-y-1">
            {categoryItems.map(function (item) {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    onClick={handleNavClick}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all"
                  >
                    <Icon size={17} />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3.5 border-t border-white/10 space-y-3 shrink-0">
          <UpgradeProCard compact />

          <div className="px-1">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Storage</span>
              <span>
                {formatBytes(storageUsed)} of {formatBytes(storageLimit)}
              </span>
            </div>
            <div className="h-1.5 w-full progress-track rounded-full overflow-hidden">
              <div className="h-1.5 progress-fill rounded-full" style={{ width: percentUsed + "%" }}></div>
            </div>
          </div>
        </div>
      </aside>
    </React.Fragment>
  );
}

export default Sidebar;
