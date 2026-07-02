# MÁY.VN — Web bán laptop

Web bán laptop với trang quản trị để bạn tự đăng / sửa / xóa sản phẩm bất cứ lúc nào,
dữ liệu lưu trữ vĩnh viễn (không mất khi tải lại trang).

**Công nghệ dùng:** Next.js (frontend) + Supabase (database + đăng nhập admin), host miễn phí trên Vercel.
Bạn **không cần biết code** để đưa web này lên mạng — chỉ cần làm theo đúng các bước dưới đây.

---

## Bước 1 — Tạo database miễn phí trên Supabase (10 phút)

1. Vào https://supabase.com → **Start your project** → đăng nhập bằng GitHub (tạo tài khoản GitHub miễn phí nếu chưa có, ở bước 3 bạn cũng cần nó).
2. Bấm **New Project**. Đặt tên bất kỳ, ví dụ `may-vn`. Đặt mật khẩu database (lưu lại chỗ nào đó).
3. Chọn khu vực gần Việt Nam nhất (ví dụ Singapore) → **Create new project**. Đợi khoảng 2 phút.
4. Vào menu bên trái → **SQL Editor** → **New query**.
5. Mở file `supabase-schema.sql` trong dự án → copy toàn bộ nội dung → dán vào ô SQL Editor → bấm **Run**.
   Bước này tạo bảng `products` và thêm sẵn 4 sản phẩm mẫu để bạn thấy web chạy ngay.
6. Vào **Project Settings** (biểu tượng bánh răng) → **Data API**. Bạn sẽ thấy:
   - **Project URL** — copy lại
   - **anon public key** (mục API Keys) — copy lại

## Bước 2 — Tạo tài khoản đăng nhập cho trang quản trị

1. Vào **Authentication** → **Users** → **Add user** → **Create new user**.
2. Nhập email và mật khẩu bạn muốn dùng để đăng nhập trang `/admin` sau này.
3. Bấm **Create user**. Đây là tài khoản admin để bạn đăng/sửa sản phẩm.

## Bước 3 — Đưa code lên GitHub

1. Vào https://github.com → tạo tài khoản (nếu chưa có) → **New repository** → đặt tên `may-vn` → **Create repository**.
2. Bấm **uploading an existing file** (hoặc "Add file" → "Upload files").
3. Kéo toàn bộ file/thư mục trong dự án này vào (trừ `node_modules` nếu có).
4. Bấm **Commit changes**.

## Bước 4 — Deploy lên Vercel (miễn phí, có domain riêng)

1. Vào https://vercel.com → **Sign up** → **Continue with GitHub**.
2. Bấm **Add New** → **Project** → chọn repo `may-vn` → **Import**.
3. Ở phần **Environment Variables**, thêm 2 biến (lấy từ Bước 1.6):
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
4. Bấm **Deploy**. Đợi 1–2 phút.
5. Xong! Vercel cho bạn link dạng `may-vn.vercel.app` — web của bạn, ai cũng truy cập được.

## Bước 5 — Sử dụng hằng ngày

- Khách xem hàng: vào `may-vn.vercel.app`
- Bạn đăng/sửa/xóa sản phẩm: vào `may-vn.vercel.app/admin`, đăng nhập, bấm **Thêm sản phẩm**.
- Mọi thay đổi lưu ngay vào database, hiện lên trang chủ ngay lập tức.

---

## Sau này muốn đổi giao diện / thêm tính năng

Gửi lại yêu cầu cho mình (Claude), mình sửa code, bạn upload lại lên GitHub — Vercel tự deploy lại.
Muốn domain riêng (vd `mayvn.com`): mua ở Nhân Hòa/PA Vietnam/Namecheap rồi vào Vercel → Settings → Domains.

## Chạy thử trên máy cá nhân (không bắt buộc)

```
npm install
cp .env.local.example .env.local
npm run dev
```
Mở trình duyệt tại http://localhost:3000
