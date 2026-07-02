import Link from "next/link";
import { formatVND } from "@/lib/format";
import type { Product } from "@/lib/supabase";

export default function ProductCard({ product }: { product: Product }) {
  const discount =
    product.old_price && product.old_price > product.price
      ? Math.round(100 - (product.price / product.old_price) * 100)
      : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border transition-transform hover:-translate-y-1"
      style={{ borderColor: "var(--line)", background: "var(--bg-card)" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "var(--bg-raised)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image_url || "https://placehold.co/600x450/1f2229/9aa0ac?text=Laptop"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount > 0 && (
          <span
            className="absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-semibold font-mono"
            style={{ background: "var(--amber)", color: "#1a1200" }}
          >
            -{discount}%
          </span>
        )}
        {product.stock <= 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/60 font-display text-sm tracking-wide">
            HẾT HÀNG
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--accent)" }}>
            {product.brand}
          </p>
          <h3 className="font-display text-base font-semibold leading-snug">{product.name}</h3>
        </div>

        {/* Signature spec strip */}
        <div className="flex flex-wrap gap-1.5 font-mono text-[11px]" style={{ color: "var(--text-dim)" }}>
          {product.cpu && <span className="rounded border px-1.5 py-0.5" style={{ borderColor: "var(--line)" }}>{product.cpu}</span>}
          {product.ram && <span className="rounded border px-1.5 py-0.5" style={{ borderColor: "var(--line)" }}>{product.ram}</span>}
          {product.gpu && <span className="rounded border px-1.5 py-0.5" style={{ borderColor: "var(--line)" }}>{product.gpu}</span>}
        </div>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="font-display text-lg font-bold">{formatVND(product.price)}</p>
            {product.old_price && product.old_price > product.price && (
              <p className="font-mono text-xs line-through" style={{ color: "var(--text-dim)" }}>
                {formatVND(product.old_price)}
              </p>
            )}
          </div>
          {product.stock > 0 && (
            <span className="font-mono text-[11px]" style={{ color: "var(--green)" }}>
              còn {product.stock}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
