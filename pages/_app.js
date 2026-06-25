import "@/styles/globals.css";
import "@/styles/loading.css";
import { useCallback, useState, useEffect } from "react";
import LoadingScreen from "@/components/loading";

export default function App({ Component, pageProps }) {
  const [showIntroLoader, setShowIntroLoader] = useState(true);
  const handleIntroComplete = useCallback(() => {
    setShowIntroLoader(false);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      // Skip API routes
      if (pathname.startsWith("/api/")) return;

      const sessionKey = "_has_visited_session";
      const isNewSession = !sessionStorage.getItem(sessionKey);
      if (isNewSession) {
        sessionStorage.setItem(sessionKey, "1");
      }

      const trackVisit = async () => {
        try {
          await fetch("/api/admin/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              path: pathname,
              referrer: document.referrer,
              userAgent: navigator.userAgent,
              isNew: isNewSession,
            }),
          });
        } catch (e) {
          // ignore
        }
      };

      trackVisit();
    }
  }, [Component]);

  return (
    <>
      <Component {...pageProps} />
      {showIntroLoader && <LoadingScreen onComplete={handleIntroComplete} />}
    </>
  );
}

