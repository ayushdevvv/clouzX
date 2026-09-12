import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import FileCard from "../components/FileCard.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

function Trash(props) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { updateStorageUsed } = useAuth();

  async function loadFiles() {
    setLoading(true);
    try {
      const res = await api.get("/files/trash");
      setFiles(res.data.files);
    } catch (error) {
      toast.error("Could not load trash");
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    loadFiles();
  }, []);

  async function handleRestore(id) {
    try {
      await api.patch("/files/" + id + "/restore");
      setFiles(function (prev) {
        return prev.filter(function (f) {
          return f._id !== id;
        });
      });
      toast.success("File restored");
    } catch (error) {
      toast.error("Could not restore file");
    }
  }

  function requestDelete(id) {
    setPendingDeleteId(id);
  }

  function cancelDelete() {
    setPendingDeleteId(null);
  }

  async function confirmDelete() {
    const id = pendingDeleteId;
    if (!id) return;

    setDeleting(true);

    try {
      const file = files.find(function (f) {
        return f._id === id;
      });

      await api.delete("/files/" + id);

      setFiles(function (prev) {
        return prev.filter(function (f) {
          return f._id !== id;
        });
      });

      if (file) {
        updateStorageUsed(-file.size);
      }

      toast.success("File permanently deleted");
    } catch (error) {
      const message = error.response && error.response.data ? error.response.data.message : "Could not delete file";
      toast.error(message);
    } finally {
      setDeleting(false);
      setPendingDeleteId(null);
    }
  }

  return (
    <DashboardLayout showUploadButton={false}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-6">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-white">Trash</h1>
        <p className="text-sm text-gray-500">Files stay here until you delete them permanently</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map(function (n) {
            return <div key={n} className="h-48 sm:h-56 glass-panel skeleton-shimmer animate-shimmer"></div>;
          })}
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Trash2 size={40} className="text-gray-600 mb-4" />
          <p className="text-gray-300 font-medium">Trash is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {files.map(function (file) {
            return (
              <FileCard
                key={file._id}
                file={file}
                isTrashView={true}
                onRestore={handleRestore}
                onDeletePermanent={requestDelete}
              />
            );
          })}
        </div>
      )}

      {pendingDeleteId ? (
        <ConfirmModal
          title="Delete this file forever"
          message="This cannot be undone. The file will be permanently removed from your storage."
          confirmLabel={deleting ? "Deleting..." : "Delete forever"}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      ) : null}
    </DashboardLayout>
  );
}

export default Trash;
