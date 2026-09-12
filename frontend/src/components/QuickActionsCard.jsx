import React from "react";
import { Link } from "react-router-dom";
import { Upload, Link2, Copy, ChevronRight } from "lucide-react";

function QuickActionsCard(props) {
  const actions = [
    {
      key: "upload",
      icon: Upload,
      label: "Upload File",
      onClick: props.onUploadClick,
      primary: true,
    },
    {
      key: "shared",
      icon: Link2,
      label: "Manage Shared Links",
      to: "/dashboard/shared",
    },
    {
      key: "duplicates",
      icon: Copy,
      label: "Review Duplicates",
      to: "/dashboard/duplicates",
    },
  ];

  return (
    <div className="cz-card rounded-xl p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
      <div className="space-y-1.5">
        {actions.map(function (action) {
          const Icon = action.icon;
          const content = (
            <React.Fragment>
              <span
                className={
                  "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 " +
                  (action.primary ? "bg-gradient-to-br from-brand-cyan to-brand-violet text-white" : "bg-white/5 text-gray-300")
                }
              >
                <Icon size={16} />
              </span>
              <span className="text-sm text-gray-200 flex-1 text-left">{action.label}</span>
              <ChevronRight size={15} className="text-gray-600" />
            </React.Fragment>
          );

          if (action.to) {
            return (
              <Link
                key={action.key}
                to={action.to}
                className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={action.key}
              onClick={action.onClick}
              className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActionsCard;
