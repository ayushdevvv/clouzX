import React, { useState } from "react";
import { Search, Upload, LogOut, ChevronDown, Menu, Bell, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Navbar(props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  async function handleLogout() {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  }

  function handleSearchChange(e) {
    props.onSearch(e.target.value);
  }

  const initial = user && user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="h-16 border-b border-white/10 bg-panel/80 backdrop-blur-xl flex items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4 sticky top-0 z-10">
      <button
        onClick={props.onMenuClick}
        className="text-gray-300 hover:text-white p-2 -ml-2 lg:hidden shrink-0"
      >
        <Menu size={22} />
      </button>

      <div className="cz-search flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 w-full max-w-md transition-colors">
        <Search size={16} className="text-gray-500 shrink-0" />
        <input
          type="text"
          placeholder="Search files, folders, tags..."
          onChange={handleSearchChange}
          className="bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500 w-full min-w-0"
        />
        <kbd className="hidden sm:inline text-[10px] text-gray-500 border border-white/10 rounded px-1.5 py-0.5">/</kbd>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {props.showUpload !== false ? (
          <button
            onClick={props.onUploadClick}
            className="btn-cz-upload gap-2 font-semibold text-sm px-3 sm:px-4 py-2.5 rounded-lg"
          >
            <Upload size={16} />
            <span className="hidden sm:inline">Upload</span>
          </button>
        ) : null}

        <div className="relative">
          <button
            onClick={function () {
              setNotifOpen(!notifOpen);
              setMenuOpen(false);
            }}
            className="p-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Bell size={18} />
          </button>

          {notifOpen ? (
            <div className="absolute right-0 mt-2 w-64 glass-panel-strong bg-panel/95 shadow-xl rounded-xl p-4">
              <p className="text-sm font-semibold text-white mb-1">Notifications</p>
              <p className="text-xs text-gray-500">You're all caught up. Nothing new right now.</p>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <button
            onClick={function () {
              setMenuOpen(!menuOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-1.5 border border-white/10 rounded-full pl-0.5 pr-2 py-0.5 hover:bg-raised transition-colors"
          >
            {user && user.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet flex items-center justify-center text-xs font-bold text-white">
                {initial}
              </div>
            )}
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 mt-2 w-56 glass-panel-strong bg-panel/95 shadow-xl rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
                {user && user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {initial}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user ? user.name : ""}</p>
                  <p className="text-xs text-gray-500 truncate">{user ? user.email : ""}</p>
                </div>
              </div>
              <Link
                to="/pricing"
                onClick={function () { setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-panel hover:text-white transition-colors"
              >
                <Settings size={15} />
                Plans &amp; pricing
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-panel hover:text-white transition-colors"
              >
                <LogOut size={15} />
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
