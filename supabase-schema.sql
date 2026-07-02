-- Chạy toàn bộ file này trong Supabase Dashboard > SQL Editor > New query > Run

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null default '',
  price numeric not null default 0,
  old_price numeric,
  image_url text default '',
  cpu text default '',
  ram text default '',
  storage text default '',
  gpu text default '',
  screen text default '',
  description text default '',
  stock int not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- Bật bảo mật theo dòng (Row Level Security)
alter table products enable row level security;

-- Ai cũng có thể XEM sản phẩm (khách hàng ghé web)
create policy "Cho phép xem sản phẩm công khai"
  on products for select
  using (true);

-- Chỉ tài khoản ĐÃ ĐĂNG NHẬP (admin) mới được thêm/sửa/xóa
create policy "Chỉ admin được thêm sản phẩm"
  on products for insert
  to authenticated
  with check (true);

create policy "Chỉ admin được sửa sản phẩm"
  on products for update
  to authenticated
  using (true);

create policy "Chỉ admin được xóa sản phẩm"
  on products for delete
  to authenticated
  using (true);

-- Vài sản phẩm mẫu để bạn thấy web chạy ngay
insert into products (name, brand, price, old_price, image_url, cpu, ram, storage, gpu, screen, description, stock, featured)
values
('ASUS ROG Strix G16', 'ASUS', 32990000, 36990000, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800', 'Intel Core i7-13650HX', '16GB DDR5', '512GB SSD NVMe', 'RTX 4060 8GB', '16" QHD 165Hz', 'Laptop gaming hiệu năng cao, tản nhiệt tốt, phù hợp game thủ và dựng đồ họa.', 12, true),
('MacBook Air M3 13"', 'Apple', 27990000, null, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'Apple M3 8-core', '8GB Unified', '256GB SSD', 'GPU 10-core', '13.6" Liquid Retina', 'Mỏng nhẹ, pin trâu, lý tưởng cho công việc văn phòng và di chuyển nhiều.', 20, true),
('Dell XPS 13 Plus', 'Dell', 34990000, 38990000, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800', 'Intel Core i7-1360P', '16GB LPDDR5', '512GB SSD', 'Intel Iris Xe', '13.4" OLED 3.5K', 'Thiết kế cao cấp, màn hình OLED sắc nét, phù hợp dân văn phòng và sáng tạo.', 8, false),
('Lenovo Legion 5 Pro', 'Lenovo', 29990000, null, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800', 'AMD Ryzen 7 7745HX', '16GB DDR5', '1TB SSD', 'RTX 4060 8GB', '16" WQXGA 165Hz', 'Cấu hình mạnh trong tầm giá, màn hình đẹp, tản nhiệt hiệu quả.', 15, false);

-- =========================================================
-- Kho lưu ảnh sản phẩm — để bạn upload ảnh trực tiếp từ máy
-- thay vì phải dán link ảnh
-- =========================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Ai cũng xem được ảnh (khách hàng ghé web cần thấy ảnh sản phẩm)
create policy "Cho phép xem ảnh công khai"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Chỉ admin (đã đăng nhập) mới được tải ảnh lên
create policy "Chỉ admin được tải ảnh lên"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

-- Chỉ admin mới được xóa ảnh cũ
create policy "Chỉ admin được xóa ảnh"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
