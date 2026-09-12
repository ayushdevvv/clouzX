import React from "react";
import { Link } from "react-router-dom";
import BrandLink from "./BrandLink.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function MarketingNavbar(props) {
  const { user } = useAuth();

  return (
    <header className="relative max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-6">
      <BrandLink size={28} />

      <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
        <Link to="/#features" className="hover:text-white transition-colors">
          Features
        </Link>
        <Link to="/#overview" className="hover:text-white transition-colors">
          Overview
        </Link>
        <Link to="/pricing" className="hover:text-white transition-colors">
          Pricing
        </Link>
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        {user ? (
          <Link to="/dashboard" className="text-sm font-semibold btn-cz-upload px-4 py-2 rounded-lg">
            Go to dashboard
          </Link>
        ) : (
          <React.Fragment>
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white px-3 sm:px-4 py-2">
              Log In
            </Link>
            <Link to="/register" className="text-sm font-semibold btn-cz-upload px-3 sm:px-4 py-2 rounded-lg transition-colors">
              Get Started
            </Link>
          </React.Fragment>
        )}
      </div>
    </header>
  );
}

export default MarketingNavbar;
