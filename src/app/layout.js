import { createClient } from '@/lib/supabase/server'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/app/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({ children }) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let workspaceName = null;

  if (user) {
    const { data: workspaceMember } = await supabase
      .from('workspace_members')
      .select('workspaces(name)')
      .eq('user_id', user.id)
      .single()

    workspaceName = workspaceMember?.workspaces?.name
  }

  return (
    <html lang="en">
      <head>
        <title>A Milli</title>
        <meta name="description" content="Your app description" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout workspaceName={workspaceName}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}