import { useState } from "react";
import { api, ApiClientError } from "../api/client";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import ErrorBanner from "../components/ErrorBanner";

export default function LoginPage({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;
      if (isSignUp) {
        data = await api.register(name, email, password);
      } else {
        data = await api.login(email, password);
      }

      localStorage.setItem("splitsmart_token", data.token);
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-ink overflow-hidden font-sans">
      {/* Background Decorative Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-settle/25 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-owe/15 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "12s" }} />

      {/* Main Glassmorphic Container */}
      <div className="relative w-full max-w-md mx-4 p-8 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl space-y-8 animate-slide-up">
        {/* Header Logo & Subtitle */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-settle tracking-wider uppercase">
            <Sparkles size={14} className="animate-spin-slow" />
            Settle up smarter
          </div>
          <h1 className="font-display font-extrabold text-4xl text-white tracking-tight">
            SplitSmart
          </h1>
          <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
            {isSignUp
              ? "Create your account to start managing shared expenses with friends."
              : "Sign in to access your private groups, bills, and balances."}
          </p>
        </div>

        {/* Error Banner */}
        {error && <ErrorBanner message={error} />}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/55 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/30">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-settle/40 focus:border-settle transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/55 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/30">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-settle/40 focus:border-settle transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/55 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/30">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-settle/40 focus:border-settle transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-settle to-settle-dim hover:brightness-105 active:scale-[0.99] disabled:opacity-50 text-white rounded-2xl py-4 text-sm font-semibold transition-all shadow-[0_4px_20px_rgba(0,179,126,0.3)]"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? "Create Account" : "Sign In"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Toggler */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-sm font-medium text-white/50 hover:text-white transition-colors"
          >
            {isSignUp ? (
              <>
                Already have an account? <span className="text-settle font-bold">Sign In</span>
              </>
            ) : (
              <>
                Don't have an account? <span className="text-settle font-bold">Create one</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
