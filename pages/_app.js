import "@/styles/globals.css";
import "@/styles/loading.css";
import "@/styles/developer.css";
import { useCallback, useState, useEffect, createContext } from "react";
import Head from "next/head";
import Script from "next/script";
import LoadingScreen from "@/components/loading";
import MaintenanceDialog from "@/components/MaintenanceDialog";

export const LoaderContext = createContext(true);

export default function App({ Component, pageProps }) {
  const [showIntroLoader, setShowIntroLoader] = useState(false);

  const handleIntroComplete = useCallback(() => {
    try {
      sessionStorage.setItem("trion_intro_seen", "1");
    } catch {}
    setShowIntroLoader(false);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const isPublicDoc = [
        "/terms",
        "/refund",
        "/privacy",
        "/contact",
        "/wingotips",
        "/wingosignal",
        "/wingo30",
        "/wingo",
        "/wingo-tool",
        "/wingo-prediction",
        "/wingo-kya-hai",
        "/wingo-ai-prediction",
        "/developer",
        "/subscription",
      ].some((p) => pathname.startsWith(p));

      try {
        const seen = sessionStorage.getItem("trion_intro_seen") === "1";
        if (!seen && !isPublicDoc && pathname === "/") {
          setShowIntroLoader(true);
        } else {
          setShowIntroLoader(false);
        }
      } catch {
        setShowIntroLoader(false);
      }
    }
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
          await fetch("/api/track", {
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
      <Head>
        <meta name="author" content="TryonAI" />
        <meta name="publisher" content="TryonAI" />
        <meta name="language" content="English" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="1 days" />
      </Head>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-QCS58YBCWF" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-QCS58YBCWF');`}
      </Script>
      <LoaderContext.Provider value={showIntroLoader}>
        <Component {...pageProps} />
      </LoaderContext.Provider>
      {showIntroLoader && <LoadingScreen onComplete={handleIntroComplete} />}
      <MaintenanceDialog />
    </>
  );
}

