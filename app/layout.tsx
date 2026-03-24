import type { Metadata, Viewport } from "next";
import "./globals.css";

// 1. GLOBAL METADATA (SEO & Branding)
export const metadata: Metadata = {
  title: "Jedo Technologies | Aviation Tyre Hub",
  description: "Specialized aircraft tyre sourcing and fleet intelligence for training fleets in India.",
  icons: {
    icon: "/favicon.ico", // Ensure you have a favicon in your public folder
  },
};

// 2. GLOBAL VIEWPORT (Fixed the Mobile Scaling Error)
// This replaces the old 'viewport' inside metadata and fixes the build errors.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        {children}
      </body>
    </html>
  );
}