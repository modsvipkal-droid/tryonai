import "@/styles/globals.css";
import "@/styles/loading.css";
import { useCallback, useState } from "react";
import LoadingScreen from "@/components/loading";

export default function App({ Component, pageProps }) {
  const [showIntroLoader, setShowIntroLoader] = useState(true);
  const handleIntroComplete = useCallback(() => {
    setShowIntroLoader(false);
  }, []);

  return (
    <>
      <Component {...pageProps} />
      {showIntroLoader && <LoadingScreen onComplete={handleIntroComplete} />}
    </>
  );
}
