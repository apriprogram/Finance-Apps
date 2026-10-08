import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Catat Keuangan",
  description: "Aplikasi pencatat keuangan mobile first untuk wallet, transaksi, budget, tabungan, hutang, laporan, export, dan scan struk.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#f8fafb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={[poppins.variable, poppins.className].join(" ")}>{children}</body>
    </html>
  );
}
