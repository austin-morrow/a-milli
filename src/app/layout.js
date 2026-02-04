"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideHeader =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/onboarding";

  return (
    <html lang="en">
      <head>
        <title>Your App Title</title>
        <meta name="description" content="Your app description" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!hideHeader ? (
          <Header>{children}</Header>
        ) : (
          children
        )}
        
        {/* Floating Spotify Player */}
        <div className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
          <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/0EMOAS5Dq6CgGIORcyfXbT?utm_source=generator&theme=0"
            width="100%"
            height="90"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      </body>
    </html>
  );
}