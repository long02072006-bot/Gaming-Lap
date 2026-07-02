import Link from "next/link";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur"
      style={{ borderColor: "var(--line)", background: "rgba(20,22,26,0.85)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Gaming Lap" className="glow h-10 w-10 rounded-md object-cover" />
          <span className="font-display text-lg font-semibold tracking-tight">
            GAMING<span style={{ color: "var(--accent)" }}>LAP</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm" style={{ color: "var(--text-dim)" }}>
          <Link href="/" className="hover:text-white transition-colors">
            Sản phẩm
          </Link>
          <Link href="/admin" className="hover:text-white transition-colors">
            Quản trị
          </Link>
        </nav>
      </div>
    </header>
  );
}
