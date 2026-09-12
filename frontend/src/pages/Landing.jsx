import React from "react";
import { Link } from "react-router-dom";
import {
  CloudUpload,
  Folder,
  Search,
  Link2,
  Layers,
  Copy,
  Twitter,
  Github,
} from "lucide-react";
import MarketingNavbar from "../components/MarketingNavbar.jsx";
import OverviewPreview from "../components/OverviewPreview.jsx";

const FEATURES = [
  {
    icon: Folder,
    title: "File Timeline",
    desc: "See your files in chronological order and never lose track.",
    preview: "timeline",
  },
  {
    icon: Search,
    title: "Powerful Search",
    desc: "Find files instantly with smart search and filters.",
    preview: "search",
  },
  {
    icon: Link2,
    title: "Secure Sharing",
    desc: "Share files with secure links, with full control.",
    preview: "sharing",
  },
  {
    icon: Layers,
    title: "Large File Insights",
    desc: "Spot your biggest files and manage storage better.",
    preview: "insights",
  },
  {
    icon: Copy,
    title: "Duplicate Detection",
    desc: "Find and remove duplicates and save space.",
    preview: "duplicates",
  },
];

function FeaturePreview(props) {
  const kind = props.kind;

  if (kind === "timeline") {
    return (
      <div className="space-y-1.5">
        {[
          { label: "Today", value: "3 files", dot: "bg-brand-cyan" },
          { label: "Yesterday", value: "5 files", dot: "bg-brand-blue" },
          { label: "This Week", value: "12 files", dot: "bg-brand-violet" },
          { label: "Earlier", value: "48 files", dot: "bg-gray-500" },
        ].map(function (item) {
          return (
            <div key={item.label} className="flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-md px-2 py-1.5">
              <span className={"w-1.5 h-1.5 rounded-full shrink-0 " + item.dot}></span>
              <span className="text-[11px] text-gray-300 flex-1">{item.label}</span>
              <span className="text-[11px] text-gray-500">{item.value}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (kind === "search") {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-md px-2.5 py-1.5">
          <Search size={11} className="text-gray-500 shrink-0" />
          <span className="text-[11px] text-gray-500 truncate">Search files, folders, tags...</span>
        </div>
        {[
          { name: "project design.pdf", tag: "Documents" },
          { name: "meeting notes.docx", tag: "Documents" },
          { name: "banner.png", tag: "Images" },
        ].map(function (item) {
          return (
            <div key={item.name} className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-md px-2.5 py-1.5">
              <span className="text-[11px] text-gray-300 truncate">{item.name}</span>
              <span className="text-[10px] text-gray-500 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 shrink-0">
                {item.tag}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  if (kind === "sharing") {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2 bg-white/[0.03] border border-white/10 rounded-md px-2.5 py-1.5">
          <span className="text-[11px] text-gray-400 truncate">https://clouzx.app/s/7f3e...</span>
          <Copy size={11} className="text-gray-500 shrink-0" />
        </div>
        <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-md px-2.5 py-1.5">
          <span className="text-[11px] text-gray-300">View only</span>
        </div>
        <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-md px-2.5 py-1.5">
          <span className="text-[11px] text-gray-300">Expires in 7 days</span>
        </div>
      </div>
    );
  }

  if (kind === "insights") {
    return (
      <div className="space-y-2.5">
        {[
          { label: "> 1 GB", value: "2 files", width: "30%" },
          { label: "500 MB - 1 GB", value: "4 files", width: "55%" },
          { label: "100 MB - 500 MB", value: "9 files", width: "80%" },
        ].map(function (item) {
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-gray-400">{item.label}</span>
                <span className="text-gray-500">{item.value}</span>
              </div>
              <div className="h-1.5 w-full progress-track rounded-full overflow-hidden">
                <div className="h-1.5 progress-fill rounded-full" style={{ width: item.width }}></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (kind === "duplicates") {
    return (
      <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-md px-3 py-3">
        <span className="w-9 h-9 rounded-lg bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center shrink-0">
          <Copy size={16} className="text-brand-violet" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] text-gray-200">3 duplicate groups</p>
          <p className="text-[11px] text-gray-500">1.2 GB recoverable</p>
        </div>
      </div>
    );
  }

  return null;
}

function Landing(props) {
  return (
    <div className="min-h-screen bg-base text-white overflow-x-hidden">
      <div className="fixed inset-0 bg-radial-fade pointer-events-none"></div>

      <MarketingNavbar />

      <section id="overview" className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 xl:pt-20 pb-24 sm:pb-32 scroll-mt-24">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 xl:gap-16 items-center">
          <div>
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 mb-6 animate-fadeIn"
              style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
              Modern Cloud Storage
            </span>
            <h1
              className="font-display text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.08] animate-fadeIn"
              style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
            >
              Your files, <span className="text-gradient-brand">understood.</span>
            </h1>
            <p
              className="text-gray-400 mt-6 text-base sm:text-lg leading-relaxed max-w-md animate-fadeIn"
              style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
            >
              CLOUZX helps you store, organize, find and share your files with intelligent insights and
              modern tools.
            </p>
            <div
              className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 animate-fadeIn"
              style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
            >
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 btn-cz-upload text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                <CloudUpload size={16} />
                Get Started
              </Link>
              <a
                href="#features"
                className="flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 px-6 py-3 rounded-lg font-medium text-sm text-gray-200 transition-colors"
              >
                Explore CLOUZX
              </a>
            </div>
          </div>

          <div className="animate-fadeIn" style={{ animationDelay: "250ms", animationFillMode: "backwards" }}>
            <OverviewPreview />
          </div>
        </div>
      </section>

      <section id="features" className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-24 sm:pb-32 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 animate-fadeIn" style={{ animationFillMode: "backwards" }}>
          <span className="inline-block text-xs font-semibold tracking-[0.2em] text-brand-cyan uppercase bg-brand-cyan/10 border border-brand-cyan/20 rounded-full px-3.5 py-1.5 mb-5">
            Everything you need
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
            Built for modern <span className="text-gradient-brand">workflows</span>
          </h2>
          <p className="text-gray-400 mt-4 text-sm sm:text-base leading-relaxed">
            Powerful features to keep your files organized, secure and always within reach.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {FEATURES.map(function (feature, index) {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="cz-card rounded-2xl p-6 flex flex-col animate-fadeIn"
                style={{ animationDelay: index * 80 + "ms", animationFillMode: "backwards" }}
              >
                <div className="cz-icon-tile mb-4 bg-gradient-to-br from-brand-cyan/15 to-brand-violet/15 text-brand-cyan">
                  <Icon size={18} />
                </div>
                <h3 className="font-display text-base font-bold text-white mb-1.5">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{feature.desc}</p>

                <div className="mt-auto">
                  <FeaturePreview kind={feature.preview} />
                </div>
              </div>
            );
          })}
        </div>
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

export default Landing;
