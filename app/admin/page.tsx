"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password.");
        return;
      }
      router.push("/admin/dashboard");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-forest-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-display italic text-3xl text-cream-50 mb-1">Rooted &amp; Rising</div>
          <div className="text-[10px] uppercase tracking-widest-xl text-sage-300/70">Admin Portal</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-forest-900/50 border border-cream-50/10 p-8 space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-widest-xl text-sage-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full bg-forest-950 border border-cream-50/15 text-cream-50 px-3 py-3 text-sm focus:outline-none focus:border-sage-300 transition-colors"
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sage-300 text-forest-950 py-3 text-[11px] uppercase tracking-widest-xl font-medium hover:bg-cream-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> Signing in…</> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
