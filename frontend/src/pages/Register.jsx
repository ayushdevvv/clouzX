import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import BrandLink from "../components/BrandLink.jsx";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

function Register(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name: name, email: email, password: password });
      setUser(res.data.user);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      const message = error.response && error.response.data ? error.response.data.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    try {
      const res = await api.post("/auth/google", { credential: credentialResponse.credential });
      setUser(res.data.user);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Google sign in failed");
    }
  }

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 bg-radial-fade pointer-events-none"></div>

      <div className="relative w-full max-w-sm">
        <div className="flex items-center justify-center mb-8">
          <BrandLink size={30} />
        </div>

        <div className="glass-panel-strong bg-panel/70 rounded-2xl p-6 sm:p-8 shadow-card animate-fadeIn">
          <h1 className="font-display text-xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-sm text-gray-500 mb-6">Start storing files for free</p>

          <div className="mb-5">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={function () { toast.error("Google sign in failed"); }} theme="filled_black" width="100%" />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px bg-border flex-1"></div>
            <span className="text-xs text-gray-500">or continue with email</span>
            <div className="h-px bg-border flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Full name</label>
              <div className="flex items-center gap-2 cz-search rounded-xl px-3 py-2.5 transition-colors">
                <User size={15} className="text-gray-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={function (e) { setName(e.target.value); }}
                  className="bg-transparent outline-none text-sm text-gray-200 w-full"
                  placeholder="Ayush Sharma"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Email</label>
              <div className="flex items-center gap-2 cz-search rounded-xl px-3 py-2.5 transition-colors">
                <Mail size={15} className="text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={function (e) { setEmail(e.target.value); }}
                  className="bg-transparent outline-none text-sm text-gray-200 w-full"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Password</label>
              <div className="flex items-center gap-2 cz-search rounded-xl px-3 py-2.5 transition-colors">
                <Lock size={15} className="text-gray-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={function (e) { setPassword(e.target.value); }}
                  className="bg-transparent outline-none text-sm text-gray-200 w-full"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cz-upload justify-center disabled:opacity-50 text-sm font-semibold py-3 mt-2 rounded-lg transition-colors"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-cyan font-medium hover:text-white transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
