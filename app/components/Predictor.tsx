"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { watchAuthState } from "@/lib/firebase";

interface PredictionData {
  period: string;
  prediction: "BIG" | "SMALL";
  confidence: number;
  serverTimestamp: number;
}

interface PredictorProps {
  userEmail?: string;
}

export default function Predictor({ userEmail: initialEmail }: PredictorProps) {
  const [detectedEmail, setDetectedEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentRequired, setPaymentRequired] = useState<boolean>(false);
  const [formattedTime, setFormattedTime] = useState<string>("");

  const activeEmail = initialEmail || detectedEmail;

  // Automatically detect logged-in Firebase user if userEmail prop is not provided
  useEffect(() => {
    if (initialEmail) return;

    let unsub = () => {};
    watchAuthState((firebaseUser) => {
      setDetectedEmail(firebaseUser?.email || "");
    }).then((cleanup) => {
      if (typeof cleanup === "function") unsub = cleanup;
    });

    return () => unsub();
  }, [initialEmail]);

  const handleFetchPrediction = async () => {
    setLoading(true);
    setErrorMessage(null);
    setPaymentRequired(false);

    try {
      // Calls server-side route that checks database directly
      const response = await fetch("/api/get-prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: activeEmail || undefined }),
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));

      // 403 Forbidden: Database check failed on the server
      if (response.status === 403) {
        setPrediction(null);
        setPaymentRequired(true);
        setErrorMessage(data.error || "Payment Required: Please subscribe to view predictions.");
        return;
      }

      // 401 Unauthorized: Not logged in
      if (response.status === 401) {
        setPrediction(null);
        setErrorMessage("Please login to your account first.");
        return;
      }

      // Any other error
      if (!response.ok || !data.success) {
        setPrediction(null);
        setErrorMessage(data.error || "Unable to fetch prediction at this time.");
        return;
      }

      // Success: ONLY render what the server authoritatively returned
      setPrediction(data.data);
      if (data.data?.serverTimestamp) {
        setFormattedTime(new Date(data.data.serverTimestamp).toLocaleTimeString());
      }
    } catch {
      setErrorMessage("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-white">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-emerald-400">AI Prediction Engine</h2>
          <p className="text-xs text-slate-400">Server-Authenticated Neural Signal</p>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          PRO v3.2
        </span>
      </div>

      {/* ERROR / PAYMENT WALL BANNER */}
      {paymentRequired && (
        <div className="p-4 mb-5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-center">
          <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full bg-rose-500/20 text-rose-400 text-xl font-bold">
            🔒
          </div>
          <h3 className="text-sm font-bold text-rose-300">Access Restricted</h3>
          <p className="text-xs text-rose-400/90 mt-1 mb-3">{errorMessage}</p>
          <Link
            href="/subscription"
            className="inline-block px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg hover:brightness-110 transition shadow-lg shadow-emerald-900/30"
          >
            Upgrade to Premium Access
          </Link>
        </div>
      )}

      {errorMessage && !paymentRequired && (
        <div className="p-3 mb-4 bg-amber-950/40 border border-amber-800/50 rounded-xl text-xs text-amber-300 text-center">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* AUTHORIZED PREDICTION DISPLAY */}
      {prediction && !paymentRequired && (
        <div className="p-4 mb-5 bg-slate-950 border border-emerald-500/30 rounded-xl">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span>Period: <strong className="text-slate-200">{prediction.period}</strong></span>
            <span>Win Rate: <strong className="text-emerald-400">{prediction.confidence}%</strong></span>
          </div>

          <div className="py-4 text-center">
            <span className="text-xs text-slate-400 uppercase tracking-widest block mb-1">Result Signal</span>
            <span
              className={`text-4xl font-extrabold tracking-wider ${
                prediction.prediction === "BIG" ? "text-amber-400" : "text-cyan-400"
              }`}
            >
              {prediction.prediction}
            </span>
          </div>

          {formattedTime && (
            <div className="text-[10px] text-center text-slate-500">
              Validated at {formattedTime}
            </div>
          )}
        </div>
      )}

      {/* ACTION BUTTON */}
      <button
        onClick={handleFetchPrediction}
        disabled={loading}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition duration-200 shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Verifying & Calculating...
          </>
        ) : (
          "⚡ Get Next Prediction"
        )}
      </button>
    </div>
  );
}
