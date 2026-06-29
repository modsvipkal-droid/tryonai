import "@/styles/globals.css";
import "@/styles/loading.css";
import "@/styles/logic.css";
import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
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
      <Head>
        <meta name="author" content="TryonAI" />
        <meta name="publisher" content="TryonAI" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
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
      <Component {...pageProps} />
      {showIntroLoader && <LoadingScreen onComplete={handleIntroComplete} />}
    </>
  );
}

