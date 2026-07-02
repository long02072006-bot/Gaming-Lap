"use client";

import { useEffect, useState } from "react";
import { createClient, Product } from "@/lib/supabase";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProducts(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main>
      <Header />

      {/* Hero */}
      <section className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Cấu hình rõ ràng — Giá minh bạch
          </p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
            Laptop chính hãng,{" "}
            <span style={{ color: "var(--accent)" }}>đúng thứ bạn cần.</span>
          </h1>
          <p className="mt-4 max-w-xl" style={{ color: "var(--text-dim)" }}>
            Không quảng cáo hoa mỹ. Chỉ có thông số thật, giá thật, và tồn kho cập nhật theo thời gian thực.
          </p>

          <div
            className="mt-8 flex max-w-md items-center gap-2 rounded-lg border px-3 py-2"
            style={{ borderColor: "var(--line)", background: "var(--bg-card)" }}
          >
            <Search size={16} style={{ color: "var(--text-dim)" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên hoặc hãng…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-dim)]"
            />
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-semibold">
            {query ? `Kết quả cho "${query}"` : "Toàn bộ sản phẩm"}
          </h2>
          <span className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>
            {filtered.length} sản phẩm
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-xl"
                style={{ background: "var(--bg-card)" }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="rounded-xl border py-20 text-center"
            style={{ borderColor: "var(--line)", color: "var(--text-dim)" }}
          >
            Không tìm thấy sản phẩm nào phù hợp.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t py-8 text-center font-mono text-xs" style={{ borderColor: "var(--line)", color: "var(--text-dim)" }}>
        © {new Date().getFullYear()} MÁY.VN — Web demo tự dựng với Next.js + Supabase.
      </footer>
    </main>
  );
}
