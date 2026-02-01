"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/app/components/Header'
import { usePathname } from "next/navigation";
import { metadata } from "@/app/metadata";


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

  const hideHeader = pathname === "/login" || pathname === "/signup" || pathname === "/onboarding";

  return (
    <html lang="en">
       <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       {!hideHeader && <Header />}
        {children}
      </body>
    </html>
  );
}
