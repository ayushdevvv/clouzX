import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

function UpgradeProCard(props) {
  const compact = props.compact;

  if (compact) {
    return (
      <Link
        to="/pricing"
        className="cz-upgrade-card block p-3.5 hover:brightness-110 transition-all group"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles size={14} className="text-brand-cyan" />
          <p className="text-xs font-semibold text-white">Upgrade to Pro</p>
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed mb-2.5">
          More storage, advanced insights and more.
        </p>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-cyan group-hover:gap-1.5 transition-all">
          Coming soon
          <ArrowRight size={12} />
        </span>
      </Link>
    );
  }

  return (
    <Link to="/pricing" className="cz-upgrade-card block p-5 hover:brightness-110 transition-all group">
      <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-3">
        <Sparkles size={16} className="text-brand-cyan" />
      </div>
      <p className="text-sm font-semibold text-white mb-1">CLOUZX Pro</p>
      <p className="text-xs text-gray-400 leading-relaxed mb-3">
        Bigger storage limits, deeper file insights and priority support are on the way.
      </p>
      <span className="flex items-center gap-1 text-xs font-semibold text-brand-cyan group-hover:gap-1.5 transition-all">
        See pricing · Coming soon
        <ArrowRight size={13} />
      </span>
    </Link>
  );
}

export default UpgradeProCard;
