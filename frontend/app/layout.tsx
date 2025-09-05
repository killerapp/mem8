import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { AuthGuard } from "@/components/AuthGuard";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AgenticInsights | AI-Powered Knowledge Management",
  description: "Next-generation AI knowledge management and insights platform",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.variable} bg-grid bg-scanlines`}
      >
        <Providers>
          <AuthGuard>
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
