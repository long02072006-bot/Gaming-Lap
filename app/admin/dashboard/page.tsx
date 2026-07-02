"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient, Product } from "@/lib/supabase";
import { formatVND } from "@/lib/format";
import { LogOut, Plus, Pencil, Trash2, X } from "lucide-react";

const EMPTY_FORM = {
  name: "",
  brand: "",
  price: "",
  old_price: "",
  image_url: "",
  cpu: "",
  ram: "",
  storage: "",
  gpu: "",
  screen: "",
  description: "",
  stock: "",
  featured: false,
};

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/admin");
        return;
      }
      loadProducts();
    });
  }, [supabase, router, loadProducts]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin");
  }

  function openNewForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(p: Product) {
    setForm({
      name: p.name,
      brand: p.brand,
      price: String(p.price),
      old_price: p.old_price ? String(p.old_price) : "",
      image_url: p.image_url,
      cpu: p.cpu,
      ram: p.ram,
      storage: p.storage,
      gpu: p.gpu,
      screen: p.screen,
      description: p.description,
      stock: String(p.stock),
      featured: p.featured,
    });
    setEditingId(p.id);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      brand: form.brand,
      price: Number(form.price) || 0,
      old_price: form.old_price ? Number(form.old_price) : null,
      image_url: form.image_url,
      cpu: form.cpu,
      ram: form.ram,
      storage: form.storage,
      gpu: form.gpu,
      screen: form.screen,
      description: form.description,
      stock: Number(form.stock) || 0,
      featured: form.featured,
    };

    if (editingId) {
      await supabase.from("products").update(payload).eq("id", editingId);
    } else {
      await supabase.from("products").insert(payload);
    }

    setSaving(false);
    setShowForm(false);
    loadProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa sản phẩm này? Không thể hoàn tác.")) return;
    await supabase.from("products").delete().eq("id", id);
    loadProducts();
  }

  return (
    <main className="min-h-screen">
      <header
        className="sticky top-0 z-20 flex items-center justify-between border-b px-5 py-4"
        style={{ borderColor: "var(--line)", background: "rgba(20,22,26,0.9)" }}
      >
        <h1 className="font-display text-lg font-semibold">Quản trị sản phẩm</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={openNewForm}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            <Plus size={16} /> Thêm sản phẩm
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--line)", color: "var(--text-dim)" }}
          >
            <LogOut size={14} /> Đăng xuất
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8">
        {loading ? (
          <p className="font-mono text-sm" style={{ color: "var(--text-dim)" }}>
            Đang tải…
          </p>
        ) : products.length === 0 ? (
          <p className="font-mono text-sm" style={{ color: "var(--text-dim)" }}>
            Chưa có sản phẩm nào. Nhấn “Thêm sản phẩm” để bắt đầu.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--line)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b font-mono text-xs uppercase tracking-wide" style={{ borderColor: "var(--line)", color: "var(--text-dim)" }}>
                  <th className="px-4 py-3 text-left">Sản phẩm</th>
                  <th className="px-4 py-3 text-left">Giá</th>
                  <th className="px-4 py-3 text-left">Tồn kho</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b last:border-0" style={{ borderColor: "var(--line)" }}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.name}</p>
                      <p className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>{p.brand}</p>
                    </td>
                    <td className="px-4 py-3 font-mono">{formatVND(p.price)}</td>
                    <td className="px-4 py-3 font-mono" style={{ color: p.stock > 0 ? "var(--green)" : "var(--red)" }}>
                      {p.stock}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditForm(p)}
                          className="rounded-lg border p-2"
                          style={{ borderColor: "var(--line)" }}
                          aria-label="Sửa"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="rounded-lg border p-2"
                          style={{ borderColor: "var(--line)", color: "var(--red)" }}
                          aria-label="Xóa"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 py-8">
          <form
            onSubmit={handleSave}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border p-6"
            style={{ borderColor: "var(--line)", background: "var(--bg-card)" }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">
                {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h2>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Đóng">
                <X size={18} style={{ color: "var(--text-dim)" }} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Tên sản phẩm *" full>
                <input required className={inputCls} style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Hãng">
                <input className={inputCls} style={inputStyle} value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </Field>
              <Field label="Ảnh (URL)">
                <input className={inputCls} style={inputStyle} value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              </Field>
              <Field label="Giá bán (VNĐ) *">
                <input required type="number" className={inputCls} style={inputStyle} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </Field>
              <Field label="Giá gốc (nếu giảm giá)">
                <input type="number" className={inputCls} style={inputStyle} value={form.old_price} onChange={(e) => setForm({ ...form, old_price: e.target.value })} />
              </Field>
              <Field label="Tồn kho">
                <input type="number" className={inputCls} style={inputStyle} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </Field>
              <Field label="CPU">
                <input className={inputCls} style={inputStyle} value={form.cpu} onChange={(e) => setForm({ ...form, cpu: e.target.value })} />
              </Field>
              <Field label="RAM">
                <input className={inputCls} style={inputStyle} value={form.ram} onChange={(e) => setForm({ ...form, ram: e.target.value })} />
              </Field>
              <Field label="Ổ cứng">
                <input className={inputCls} style={inputStyle} value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })} />
              </Field>
              <Field label="Card đồ họa">
                <input className={inputCls} style={inputStyle} value={form.gpu} onChange={(e) => setForm({ ...form, gpu: e.target.value })} />
              </Field>
              <Field label="Màn hình" full>
                <input className={inputCls} style={inputStyle} value={form.screen} onChange={(e) => setForm({ ...form, screen: e.target.value })} />
              </Field>
              <Field label="Mô tả" full>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={inputCls}
                  style={inputStyle}
                />
              </Field>
            </div>

            <button
              disabled={saving}
              className="font-display mt-5 w-full rounded-lg py-2.5 text-sm font-semibold disabled:opacity-50"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {saving ? "Đang lưu…" : editingId ? "Lưu thay đổi" : "Thêm sản phẩm"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

const inputCls = "w-full rounded-lg border px-3 py-2 text-sm outline-none";
const inputStyle = { borderColor: "var(--line)", background: "var(--bg-raised)" };

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${full ? "col-span-2" : ""}`}>
      <span className="mb-1 block font-mono text-xs" style={{ color: "var(--text-dim)" }}>
        {label}
      </span>
      {children}
    </label>
  );
}
