# 🔄 PDF ↔ Ảnh Converter

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Lovable](https://img.shields.io/badge/Built_with-Lovable-black?style=for-the-badge)

🔗 **Trải nghiệm trực tiếp:** [file-image-converting.lovable.app](https://file-image-converting.lovable.app)

## 💡 Bài toán & Giải pháp

Nhu cầu chuyển đổi qua lại giữa **PDF và ảnh** (scan hồ sơ thành ảnh, gộp nhiều ảnh thành 1 file PDF để nộp...) là việc rất phổ biến, nhưng phần lớn công cụ online miễn phí hiện nay đều yêu cầu **upload file lên server** của bên thứ ba để xử lý — tiềm ẩn rủi ro với các tài liệu chứa thông tin cá nhân hoặc nội dung nhạy cảm (hợp đồng, giấy tờ tùy thân, hồ sơ công việc...).

**PDF ↔ Ảnh Converter** giải quyết đúng vấn đề đó bằng cách xử lý **hoàn toàn ngay trên trình duyệt của người dùng** — file không bao giờ rời khỏi máy, không có server nào lưu trữ hay nhìn thấy nội dung file.

## 👤 Vai trò của tôi
Tôi tự nhận diện nhu cầu này từ chính trải nghiệm cá nhân khi cần chuyển đổi tài liệu nhanh mà ngại upload lên các trang converter lạ. Tôi viết PRD, tự thiết kế và xây dựng toàn bộ sản phẩm bằng kỹ thuật **Vibe Coding** trên nền tảng Lovable — từ việc lựa chọn giải pháp xử lý file client-side, thiết kế trải nghiệm, đến publish sản phẩm.

## 🎥 Demo

![Mô phỏng app](M%C3%B4%20ph%E1%BB%8Fng%20app.png)

## ✨ Các tính năng chính (Key Features)
- **📄 PDF → Ảnh:** Chuyển từng trang PDF thành ảnh, chọn định dạng xuất PNG hoặc JPG/JPEG, tùy chỉnh chất lượng ảnh (quality slider).
- **🖼️ Ảnh → PDF:** Gộp nhiều ảnh (PNG, JPG, WEBP, kể cả **HEIC/HEIF** từ iPhone) thành 1 file PDF duy nhất, chọn nhiều file cùng lúc.
- **📦 Tải kết quả hàng loạt:** Xuất nhiều file/nhiều trang cùng lúc dưới dạng ZIP.
- **🔒 Bảo mật 100%:** Không upload, không server, không thu thập dữ liệu — mọi thứ diễn ra ngay trên thiết bị của người dùng.
- **📱 Giao diện đơn giản, kéo-thả trực tiếp:** Chỉ cần kéo file vào là xử lý ngay, không cần đăng ký tài khoản.

## 🧠 System Architecture & Design Decision
Điểm đặc biệt của sản phẩm này là **không có backend**. Toàn bộ logic xử lý file chạy trực tiếp trong trình duyệt bằng các thư viện JavaScript client-side:
- **`pdf-lib` & `pdfjs-dist`:** Đọc, render và tạo file PDF ngay trên trình duyệt.
- **`heic2any`:** Chuyển đổi định dạng ảnh HEIC/HEIF (định dạng mặc định của iPhone) sang định dạng phổ thông.
- **`jszip`:** Đóng gói nhiều file kết quả thành 1 file ZIP để tải về cùng lúc.

Thiết kế "zero-backend" này vừa giải quyết triệt để bài toán bảo mật, vừa giúp chi phí vận hành gần như bằng 0 — không cần server, không cần database.

## ⚙️ Hướng dẫn chạy Local (Dành cho Technical Review)

**1. Clone repository**
```bash
git clone https://github.com/nhungle-work/file-image-converting.git
cd file-image-converting
```

**2. Cài đặt Dependencies**
```bash
npm install
```

**3. Khởi chạy ứng dụng**
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: `http://localhost:5173`

*Không cần cấu hình biến môi trường (.env) — sản phẩm không sử dụng backend/database.*

---
*Lưu ý nội bộ: Dự án này được phát triển bằng kỹ thuật Vibe Coding trên nền tảng [Lovable](https://lovable.dev/).*
