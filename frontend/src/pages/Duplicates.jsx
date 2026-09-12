import React, { useState, useEffect } from "react";
import { Copy, Trash2, AlertTriangle } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatBytes, formatRelativeTime } from "../utils/format.js";
import toast from "react-hot-toast";

function Duplicates(props) {
  const [groups, setGroups] = useState([]);
  const [totalWasted, setTotalWasted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pendingTrashId, setPendingTrashId] = useState(null);
  const { updateStorageUsed } = useAuth();

  async function loadDuplicates() {
    setLoading(true);
    try {
      const res = await api.get("/files/duplicates");
      setGroups(res.data.groups);
      setTotalWasted(res.data.totalWastedBytes);
    } catch (error) {
      toast.error("Could not load duplicates");
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    loadDuplicates();
  }, []);

  function requestTrash(id) {
    setPendingTrashId(id);
  }

  async function confirmTrash() {
    const id = pendingTrashId;
    if (!id) return;

    try {
      await api.patch("/files/" + id + "/trash");
      setGroups(function (prev) {
        return prev
          .map(function (group) {
            return {
              ...group,
              files: group.files.filter(function (f) {
                return f._id !== id;
              }),
            };
          })
          .filter(function (group) {
            return group.files.length > 1;
          });
      });
      toast.success("Moved to trash");
    } catch (error) {
      toast.error("Could not move file to trash");
    } finally {
      setPendingTrashId(null);
    }
  }

  return (
    <DashboardLayout showUploadButton={false}>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-white">Duplicates</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Files with identical content, grouped by hash. Nothing is deleted automatically, review and remove copies yourself.
      </p>

      {totalWasted > 0 ? (
        <div className="glass-panel p-4 mb-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle size={16} className="text-amber-400" />
          </div>
          <p className="text-sm text-gray-300">
            You could free up <span className="text-white font-semibold">{formatBytes(totalWasted)}</span> by removing duplicate copies.
          </p>
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(function (n) {
            return <div key={n} className="h-28 glass-panel skeleton-shimmer animate-shimmer"></div>;
          })}
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Copy size={40} className="text-gray-600 mb-4" />
          <p className="text-gray-300 font-medium">No duplicates found</p>
          <p className="text-sm text-gray-500 mt-1">Every file in your storage is unique</p>
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map(function (group) {
            return (
              <div key={group.hash} className="glass-panel p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-200">
                    {group.count} identical copies
                  </span>
                  <span className="text-xs text-amber-400">{formatBytes(group.wastedBytes)} wasted</span>
                </div>
                <div className="space-y-2">
                  {group.files.map(function (file, index) {
                    return (
                      <div key={file._id} className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-2.5">
                        <span className="text-sm text-gray-200 truncate flex-1">{file.name}</span>
                        {index === 0 ? (
                          <span className="text-[10px] text-gray-500 border border-white/10 px-1.5 py-0.5 shrink-0">
                            Original
                          </span>
                        ) : null}
                        <span className="text-xs text-gray-500 shrink-0 hidden sm:inline">{formatRelativeTime(file.createdAt)}</span>
                        <button
                          onClick={function () {
                            requestTrash(file._id);
                          }}
                          className="text-gray-400 hover:text-red-400 shrink-0"
                          title="Move to trash"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pendingTrashId ? (
        <ConfirmModal
          title="Move this copy to trash"
          message="You can restore it from trash later if you change your mind."
          confirmLabel="Move to trash"
          onCancel={function () {
            setPendingTrashId(null);
          }}
          onConfirm={confirmTrash}
        />
      ) : null}
    </DashboardLayout>
  );
}

export default Duplicates;
