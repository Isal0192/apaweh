import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Lora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Personal Workspace Hub | Faisal S. Dashboard",
  description: "All-in-One Dashboard Hub: Professional Portfolio, Technical Blog Jurnal, Web App Generator Playground, and Media Sharing Hub.",
  keywords: ["Faisal S.", "Frontend Engineer", "UI/UX Expert", "Next.js", "React Portfolio", "DevOps Homelab"],
  authors: [{ name: "Faisal S.", url: "https://example.com" }],
  creator: "Faisal S.",
  metadataBase: new URL("https://example.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Personal Workspace Hub | Faisal S.",
    description: "Explore my portfolios, devops homelab logs, generate quick website codes, and access shared resource links.",
    url: "/",
    siteName: "Workspace Hub",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Workspace Hub | Faisal S.",
    description: "Explore my portfolios, devops homelab logs, and play around with web generator templates.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${lora.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
