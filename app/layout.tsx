import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Gaming Lap — Laptop gaming chính hãng, giá tốt",
  description: "Cửa hàng laptop gaming chuyên nghiệp — cấu hình rõ ràng, giá minh bạch.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jbMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
