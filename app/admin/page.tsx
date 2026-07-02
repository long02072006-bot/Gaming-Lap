"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/admin/dashboard");
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Sai email hoặc mật khẩu.");
      return;
    }
    router.push("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-xl border p-8"
        style={{ borderColor: "var(--line)", background: "var(--bg-card)" }}
      >
        <div className="mb-6 flex items-center gap-2">
          <Lock size={18} style={{ color: "var(--accent)" }} />
          <h1 className="font-display text-lg font-semibold">Đăng nhập quản trị</h1>
        </div>

        <label className="mb-1 block font-mono text-xs" style={{ color: "var(--text-dim)" }}>
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--line)", background: "var(--bg-raised)" }}
        />

        <label className="mb-1 block font-mono text-xs" style={{ color: "var(--text-dim)" }}>
          Mật khẩu
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--line)", background: "var(--bg-raised)" }}
        />

        {error && (
          <p className="mb-4 font-mono text-xs" style={{ color: "var(--red)" }}>
            {error}
          </p>
        )}

        <button
          disabled={loading}
          className="font-display w-full rounded-lg py-2.5 text-sm font-semibold disabled:opacity-50"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {loading ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>

        <p className="mt-4 font-mono text-[11px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
          Chưa có tài khoản? Tạo trong Supabase Dashboard → Authentication → Users. Xem README.md.
        </p>
      </form>
    </main>
  );
}
