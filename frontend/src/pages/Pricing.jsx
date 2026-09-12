import React from "react";
import { Link } from "react-router-dom";
import { Check, Twitter, Github } from "lucide-react";
import MarketingNavbar from "../components/MarketingNavbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

function Pricing(props) {
  const { user } = useAuth();

  const freeFeatures = [
    "1 GB of storage included",
    "Upload, star and organize files by type",
    "Automatic time-based file timeline",
    "AI-assisted tags and file insights",
    "Duplicate file detection",
    "Secure shareable links with expiry control",
    "Trash with recovery",
  ];

  const proFeatures = [
    "Expanded storage limits",
    "Deeper storage & usage analytics",
    "Priority processing for uploads",
    "Priority support",
  ];

  function handleProClick() {
    toast("CLOUZX Pro isn't available yet — we'll let you know when it launches.");
  }

  return (
    <div className="min-h-screen bg-base text-white overflow-x-hidden">
      <div className="fixed inset-0 bg-radial-fade pointer-events-none"></div>

      <MarketingNavbar />

      <section className="relative max-w-2xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-8 text-center">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide text-gray-300 uppercase mb-4 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
          Early access
        </span>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
          Simple, honest <span className="text-gradient-brand">pricing.</span>
        </h1>
        <p className="text-gray-400 mt-4 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
          CLOUZX is completely free while we're in early access. No trial, no card required. Pro is on the way.
        </p>
      </section>

      <section className="relative max-w-3xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
          <div className="glass-panel-strong rounded-2xl p-5 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display text-base font-bold text-white">Free</h2>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5">
                Currently active
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">Everything you need to store and organize your files today.</p>
            <p className="font-display text-2xl font-bold text-white mb-1">
              $0 <span className="text-xs font-normal text-gray-500">/ forever, during early access</span>
            </p>
            <ul className="space-y-2 my-5 flex-1">
              {freeFeatures.map(function (feature) {
                return (
                  <li key={feature} className="flex items-start gap-2 text-xs text-gray-300">
                    <Check size={13} className="text-brand-cyan shrink-0 mt-0.5" />
                    {feature}
                  </li>
                );
              })}
            </ul>
            <Link
              to={user ? "/dashboard" : "/register"}
              className="flex items-center justify-center gap-2 btn-cz-upload font-semibold text-xs px-5 py-2.5 rounded-lg"
            >
              {user ? "Go to dashboard" : "Create free account"}
            </Link>
          </div>

          <div className="cz-upgrade-card rounded-2xl p-5 sm:p-6 flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display text-base font-bold text-white">CLOUZX Pro</h2>
              <span className="text-[10px] font-semibold text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 rounded-full px-2 py-0.5">
                Coming soon
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">For people and teams who outgrow the free tier.</p>
            <p className="font-display text-2xl font-bold text-white mb-1">
              TBA <span className="text-xs font-normal text-gray-500">/ pricing not announced</span>
            </p>
            <ul className="space-y-2 my-5 flex-1">
              {proFeatures.map(function (feature) {
                return (
                  <li key={feature} className="flex items-start gap-2 text-xs text-gray-300">
                    <Check size={13} className="text-brand-violet shrink-0 mt-0.5" />
                    {feature}
                  </li>
                );
              })}
            </ul>
            <button
              onClick={handleProClick}
              className="flex items-center justify-center gap-2 border border-white/15 text-gray-300 font-semibold text-xs px-5 py-2.5 rounded-lg cursor-not-allowed opacity-80 hover:opacity-100 transition-opacity"
            >
              Coming soon
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-600 mt-6">
          No payment is collected today. We'll announce CLOUZX Pro pricing before anything changes on your account.
        </p>
      </section>

      <footer className="relative border-t border-white/10 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">CLOUZX © 2026</p>
          <div className="flex items-center gap-5">
            <a
              href="https://x.com/ayushxdevz"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors"
            >
              <Twitter size={15} />
              X
            </a>
            <a
              href="https://github.com/ayushdevvv/clouzX"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors"
            >
              <Github size={15} />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Pricing;
