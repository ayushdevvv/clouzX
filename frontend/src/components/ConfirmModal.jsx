import React from "react";
import { AlertTriangle } from "lucide-react";

function ConfirmModal(props) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="glass-panel-strong bg-panel/90 w-full max-w-sm p-6 animate-fadeIn">
        <div className="w-10 h-10 bg-raised flex items-center justify-center mb-4">
          <AlertTriangle size={20} className="text-red-400" />
        </div>

        <h3 className="font-display font-semibold text-white text-lg mb-2">{props.title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-6">{props.message}</p>

        <div className="flex items-center gap-3">
          <button
            onClick={props.onCancel}
            className="flex-1 border border-white/15 hover:bg-white/5 text-gray-300 font-medium text-sm py-2.5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={props.onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-400 text-base font-semibold text-sm py-2.5 transition-colors"
          >
            {props.confirmLabel || "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
