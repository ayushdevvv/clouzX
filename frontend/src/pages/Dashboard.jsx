import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FolderOpen, Upload } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import TimelineSection from "../components/TimelineSection.jsx";
import StatCardsRow from "../components/StatCardsRow.jsx";
import RecentFilesTable from "../components/RecentFilesTable.jsx";
import TimelinePanel from "../components/TimelinePanel.jsx";
import FileInsightsRow from "../components/FileInsightsRow.jsx";
import StorageUsageCard from "../components/StorageUsageCard.jsx";
import QuickActionsCard from "../components/QuickActionsCard.jsx";
import SmartInsightsCard from "../components/SmartInsightsCard.jsx";
import UpgradeProCard from "../components/UpgradeProCard.jsx";
import UploadModal from "../components/UploadModal.jsx";
import FileDetailsDrawer from "../components/FileDetailsDrawer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import toast from "react-hot-toast";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard(props) {
  const { user } = useAuth();
  const [groups, setGroups] = useState({ today: [], yesterday: [], thisWeek: [], earlier: [] });
  const [stats, setStats] = useState(null);
  const [duplicateHashes, setDuplicateHashes] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [activeFile, setActiveFile] = useState(null);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";

  async function loadTimeline() {
    setLoading(true);
    try {
      const res = await api.get("/files/timeline", { params: { search: search, category: category } });
      setGroups(res.data.groups);
    } catch (error) {
      toast.error("Could not load files");
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const res = await api.get("/files/stats");
      setStats(res.data);
    } catch (error) {
      // stats are non critical, fail silently
    }
  }

  async function loadDuplicateHashes() {
    try {
      const res = await api.get("/files/duplicates");
      const hashes = new Set();
      res.data.groups.forEach(function (g) {
        hashes.add(g.hash);
      });
      setDuplicateHashes(hashes);
    } catch (error) {
      // non critical
    }
  }

  useEffect(
    function () {
      const delay = setTimeout(loadTimeline, 300);
      return function () {
        clearTimeout(delay);
      };
    },
    [search, category]
  );

  useEffect(function () {
    loadStats();
    loadDuplicateHashes();
  }, []);

  function findFileInGroups(id) {
    for (const key of Object.keys(groups)) {
      const found = groups[key].find(function (f) {
        return f._id === id;
      });
      if (found) return found;
    }
    return null;
  }

  function handleUploaded(newFile) {
    setGroups(function (prev) {
      return { ...prev, today: [newFile, ...prev.today] };
    });
    loadStats();
    loadDuplicateHashes();
  }

  function updateFileInGroups(id, updater) {
    setGroups(function (prev) {
      const next = {};
      Object.keys(prev).forEach(function (key) {
        next[key] = prev[key].map(function (f) {
          return f._id === id ? updater(f) : f;
        });
      });
      return next;
    });
  }

  async function handleToggleStar(id) {
    try {
      const res = await api.patch("/files/" + id + "/star");
      updateFileInGroups(id, function () {
        return res.data.file;
      });
      setActiveFile(function (prev) {
        return prev && prev._id === id ? res.data.file : prev;
      });
    } catch (error) {
      toast.error("Could not update file");
    }
  }

  function removeFileFromGroups(id) {
    setGroups(function (prev) {
      const next = {};
      Object.keys(prev).forEach(function (key) {
        next[key] = prev[key].filter(function (f) {
          return f._id !== id;
        });
      });
      return next;
    });
  }

  async function handleTrash(id) {
    try {
      await api.patch("/files/" + id + "/trash");
      removeFileFromGroups(id);
      loadStats();
      toast.success("Moved to trash");
    } catch (error) {
      toast.error("Could not move file to trash");
    }
  }

  function handleOpenDetails(file) {
    setActiveFile(file);
  }

  function handleFileUpdate(updated) {
    updateFileInGroups(updated._id, function () {
      return updated;
    });
  }

  function openUpload() {
    setShowUpload(true);
  }

  const isOverview = category === "all" && !search;
  const categoryLabel = category === "all" ? "Overview" : category.charAt(0).toUpperCase() + category.slice(1) + "s";
  const totalFiles = Object.values(groups).reduce(function (sum, arr) {
    return sum + arr.length;
  }, 0);

  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const firstName = user && user.name ? user.name.split(" ")[0] : "";

  return (
    <DashboardLayout onSearch={setSearch} onUploadClick={openUpload}>
      {isOverview ? (
        <React.Fragment>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
                {getGreeting()}
                {firstName ? <span className="text-gradient-brand">, {firstName}</span> : null}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Here's what's happening with your files today.</p>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 shrink-0">{dateLabel}</p>
          </div>

          <StatCardsRow stats={stats} />

          <div className="grid lg:grid-cols-[1fr_320px] gap-4 sm:gap-6 mb-6">
            <div className="grid md:grid-cols-[1fr_280px] gap-4 sm:gap-6">
              <RecentFilesTable files={(stats && stats.recentFiles) || []} onOpenDetails={handleOpenDetails} />
              <TimelinePanel summary={stats && stats.timelineSummary} />
            </div>

            <div className="space-y-4 sm:space-y-6">
              <StorageUsageCard stats={stats} />
              <QuickActionsCard onUploadClick={openUpload} />
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-4 sm:gap-6 mb-2">
            <FileInsightsRow stats={stats} />
            <div className="space-y-4 sm:space-y-6">
              <SmartInsightsCard stats={stats} />
              <UpgradeProCard />
            </div>
          </div>

          <h2 id="browse-files" className="font-display text-lg font-bold text-white mt-8 mb-4 scroll-mt-20">
            Browse Files
          </h2>
        </React.Fragment>
      ) : (
        <h1 className="font-display text-xl sm:text-2xl font-bold text-white mb-6">{categoryLabel}</h1>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
            return <div key={n} className="h-48 sm:h-56 glass-panel skeleton-shimmer animate-shimmer"></div>;
          })}
        </div>
      ) : totalFiles === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderOpen size={40} className="text-gray-600 mb-4" />
          <p className="text-gray-300 font-medium">No files here yet</p>
          <p className="text-sm text-gray-500 mt-1 mb-5">Upload a file to get started</p>
          <button onClick={openUpload} className="btn-cz-upload gap-2 font-semibold text-sm px-5 py-2.5 rounded-lg">
            <Upload size={16} />
            Upload a file
          </button>
        </div>
      ) : (
        <TimelineSection
          groups={groups}
          duplicateHashes={duplicateHashes}
          onToggleStar={handleToggleStar}
          onTrash={handleTrash}
          onOpenDetails={handleOpenDetails}
        />
      )}

      {showUpload ? (
        <UploadModal onClose={function () { setShowUpload(false); }} onUploaded={handleUploaded} />
      ) : null}

      {activeFile ? (
        <FileDetailsDrawer
          file={activeFile}
          isDuplicate={duplicateHashes.has(activeFile.fileHash)}
          onClose={function () { setActiveFile(null); }}
          onToggleStar={handleToggleStar}
          onTrash={handleTrash}
          onFileUpdate={handleFileUpdate}
        />
      ) : null}
    </DashboardLayout>
  );
}

export default Dashboard;
