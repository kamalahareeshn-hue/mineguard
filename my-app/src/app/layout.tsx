import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MineGuard AI — Smart Coal Mine Safety & Governance",
  description: "Real-time IoT sensor telemetry, CCTV computer-vision safety detection, explainable risk engine and automated compliance reporting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090A0C] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
