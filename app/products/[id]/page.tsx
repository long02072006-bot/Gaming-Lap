"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient, Product } from "@/lib/supabase";
import { formatVND } from "@/lib/format";
import Header from "@/components/Header";
import { ArrowLeft, Cpu, HardDrive, MemoryStick, Monitor, Zap } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main>
        <Header />
        <div className="mx-auto max-w-6xl px-5 py-20 text-center font-mono text-sm" style={{ color: "var(--text-dim)" }}>
          Đang tải…
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main>
        <Header />
        <div className="mx-auto max-w-6xl px-5 py-20 text-center" style={{ color: "var(--text-dim)" }}>
          Không tìm thấy sản phẩm này.
          <div className="mt-4">
            <Link href="/" className="underline" style={{ color: "var(--accent)" }}>
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const specs = [
    { icon: Cpu, label: "CPU", value: product.cpu },
    { icon: MemoryStick, label: "RAM", value: product.ram },
    { icon: HardDrive, label: "Ổ cứng", value: product.storage },
    { icon: Zap, label: "Card đồ họa", value: product.gpu },
    { icon: Monitor, label: "Màn hình", value: product.screen },
  ].filter((s) => s.value);

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-6xl px-5 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm hover:text-white"
          style={{ color: "var(--text-dim)" }}
        >
          <ArrowLeft size={14} /> Tất cả sản phẩm
        </Link>

        <div className="grid gap-10 md:grid-cols-2">
          <div
            className="aspect-[4/3] overflow-hidden rounded-xl border"
            style={{ borderColor: "var(--line)", background: "var(--bg-raised)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image_url || "https://placehold.co/800x600/1f2229/9aa0ac?text=Laptop"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wider" style={{ color: "var(--accent)" }}>
              {product.brand}
            </p>
            <h1 className="font-display mt-2 text-3xl font-bold">{product.name}</h1>

            <div className="mt-5 flex items-end gap-3">
              <span className="font-display text-3xl font-bold">{formatVND(product.price)}</span>
              {product.old_price && product.old_price > product.price && (
                <span className="font-mono text-base line-through" style={{ color: "var(--text-dim)" }}>
                  {formatVND(product.old_price)}
                </span>
              )}
            </div>

            <p
              className="mt-1 font-mono text-sm"
              style={{ color: product.stock > 0 ? "var(--green)" : "var(--red)" }}
            >
              {product.stock > 0 ? `Còn hàng · ${product.stock} sản phẩm` : "Tạm hết hàng"}
            </p>

            {product.description && (
              <p className="mt-5 leading-relaxed" style={{ color: "var(--text-dim)" }}>
                {product.description}
              </p>
            )}

            {/* Spec sheet */}
            <div
              className="mt-6 divide-y rounded-xl border"
              style={{ borderColor: "var(--line)" }}
            >
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 px-4 py-3" style={{ borderColor: "var(--line)" }}>
                  <Icon size={16} style={{ color: "var(--accent)" }} />
                  <span className="w-28 font-mono text-xs" style={{ color: "var(--text-dim)" }}>
                    {label}
                  </span>
                  <span className="font-mono text-sm">{value}</span>
                </div>
              ))}
            </div>

            <button
              disabled={product.stock <= 0}
              className="font-display mt-6 w-full rounded-lg py-3 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {product.stock > 0 ? "Liên hệ mua hàng" : "Hết hàng"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
