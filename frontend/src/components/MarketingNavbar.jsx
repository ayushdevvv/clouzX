import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import BrandLink from "./BrandLink.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_LINKS = [
  { label: "Features", to: "/#features" },
  { label: "Overview", to: "/#overview" },
  { label: "Pricing", to: "/pricing" },
];

function MarketingNavbar(props) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="relative w-full z-30">
      <div className="relative w-full flex items-center justify-between px-4 sm:px-8 lg:px-12 py-5 sm:py-6">
        <div className="flex items-center min-w-0 shrink-0">
          <BrandLink size={26} />
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map(function (link) {
            return (
              <Link key={link.label} to={link.to} className="hover:text-white transition-colors whitespace-nowrap">
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="text-sm font-semibold btn-cz-upload px-4 py-2 rounded-lg whitespace-nowrap">
                Go to dashboard
              </Link>
            ) : (
              <React.Fragment>
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2 whitespace-nowrap">
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold btn-cz-upload px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  Get Started
                </Link>
              </React.Fragment>
            )}
          </div>

          <button
            onClick={function () {
              setMenuOpen(!menuOpen);
            }}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-gray-300 shrink-0"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="md:hidden absolute top-full left-0 right-0 bg-base border-t border-white/10 px-4 sm:px-8 py-4 animate-fadeIn">
          <nav className="flex flex-col gap-1 text-sm text-gray-300 mb-4">
            {NAV_LINKS.map(function (link) {
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={closeMenu}
                  className="px-2 py-2.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-2">
            {user ? (
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="text-sm font-semibold btn-cz-upload px-4 py-2.5 rounded-lg justify-center"
              >
                Go to dashboard
              </Link>
            ) : (
              <React.Fragment>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="text-sm font-medium text-gray-300 border border-white/10 px-4 py-2.5 rounded-lg text-center"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="text-sm font-semibold btn-cz-upload px-4 py-2.5 rounded-lg justify-center"
                >
                  Get Started
                </Link>
              </React.Fragment>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default MarketingNavbar;
