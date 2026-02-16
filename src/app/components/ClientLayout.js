"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";

export default function ClientLayout({ children, workspaceName }) {
  const pathname = usePathname();

  const hideHeader =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/onboarding";

  return (
    <>
      {!hideHeader ? (
        <Header workspaceName={workspaceName}>{children}</Header>
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
    </>
  );
}
