import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Turnstile } from "@marsidev/react-turnstile";
import QRCode from "qrcode";
import { watchAuthState, getFirebaseAuth } from "@/lib/firebase";
import { PageHead, OrganizationSchema, WebsiteSchema, WebPageSchema, BreadcrumbSchema, SoftwareAppSchema } from "@/components/SEO";

// Custom styles override to ensure scroll works inside .app-screen container
const bgStyle = `
  html, body {
    background: #eef7f3 !important;
    height: 100% !important;
    overflow: hidden !important;
  }
  #__next {
    height: 100% !important;
    overflow: hidden !important;
  }
  .page-shell .app-screen {
    height: 100vh !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
`;

const UPI_VPA = "biswajitbhai@fam";
const UPI_PAYEE = "TryonAI";

const PLANS = {
  korven: { label: "Korven Model", amount: "749.00", qr: "/749qrcode.jpg" },
  fx1: { label: "FX1 MODEL", amount: "1100.00", qr: "/Fx1qrdode.jpg" },
};

async function getIdToken() {
  try {
    const auth = await getFirebaseAuth();
    if (auth?.currentUser) return await auth.currentUser.getIdToken();
  } catch {}
  return null;
}

async function renderQrDataUrl(upiId, payee, amount, ref) {
  try {
    const intent = [
      "upi://pay",
      `pa=${encodeURIComponent(upiId)}`,
      `pn=${encodeURIComponent(payee)}`,
      `am=${encodeURIComponent(amount)}`,
      `cu=INR`,
      `tn=${encodeURIComponent(ref)}`,
      `tr=${encodeURIComponent(ref)}`,
    ].join("?");
    return await QRCode.toDataURL(intent, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 300,
      color: { dark: "#0f172a", light: "#ffffff" },
    });
  } catch {
    return null;
  }
}

const openUpiApp = (pkg, amount) => {
  const params = `pa=${UPI_VPA}&pn=${encodeURIComponent(UPI_PAYEE)}&am=${amount}&cu=INR&mode=04`;
  if (pkg) {
    window.location.href = `intent://pay?${params}#Intent;scheme=upi;package=${pkg};end`;
    setTimeout(() => {
      window.location.href = `upi://pay?${params}`;
    }, 1500);
  } else {
    window.location.href = `upi://pay?${params}`;
  }
};

export default function Subscription() {
  const router = useRouter();
  const model = router.query.model === "fx1" ? "fx1" : "korven";
  const plan = PLANS[model];
  const [utr, setUtr] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastSuccess, setToastSuccess] = useState(false);
  const [toastModel, setToastModel] = useState("");
  const [activeTab, setActiveTab] = useState("qr");
  const [orderId, setOrderId] = useState("");
  const [orderAmount, setOrderAmount] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [copied, setCopied] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [creating, setCreating] = useState(false);
  const [verifyState, setVerifyState] = useState(null); // null | "PENDING" | "VERIFIED" | "FAILED"
  const [verifyMsg, setVerifyMsg] = useState("");
  const orderIdRef = useRef("");
  const timerRef = useRef(null);
  const pollRef = useRef(null);
  const authUserRef = useRef(null);
  const verifyingRef = useRef(false);

  const createOrder = async (email) => {
    if (creating) return;
    setCreating(true);
    setVerifyState(null);
    setVerifyMsg("");
    try {
      const token = await getIdToken();
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ model }),
      });
      const data = await res.json();
      if (!res.ok) {
        setVerifyMsg(data?.error || "Could not start payment. Please try again.");
        setShowToast(true);
        setToastSuccess(false);
        return;
      }
      orderIdRef.current = data.orderId;
      setOrderId(data.orderId);
      setOrderAmount(String(data.amount));
      const localQr = await renderQrDataUrl(
        data.upiId || UPI_VPA,
        data.gatewayOrderId || data.orderId,
        String(data.amount),
        data.gatewayOrderId || data.orderId
      );
      // Prefer the locally-rendered QR (always crisp, never expires), fall back to the gateway CDN image.
      setQrUrl(localQr || data.qrUrl || "");
      setTimeLeft(600);
      return data.orderId;
    } catch {
      setVerifyMsg("Network error while starting payment.");
      setShowToast(true);
      setToastSuccess(false);
    } finally {
      setCreating(false);
    }
  };

  const verifyOrder = async () => {
    const orderIdValue = orderIdRef.current;
    if (!orderIdValue || verifyingRef.current) return;
    verifyingRef.current = true;
    try {
      const token = await getIdToken();
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ orderId: orderIdValue, utr: utr.trim() || undefined }),
      });
      const data = await res.json();
      if (data?.verified) {
        setVerifyState("VERIFIED");
        setToastModel(data.modelName || data.modelId || plan.label);
        setShowToast(true);
        setToastSuccess(true);
        if (pollRef.current) clearInterval(pollRef.current);
      } else {
        setVerifyState(data?.status || "PENDING");
        if (data?.status === "FAILED") {
          setVerifyMsg(data?.error || "Payment verification failed.");
          setShowToast(true);
          setToastSuccess(false);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      }
    } catch {
      // transient; keep polling
    } finally {
      verifyingRef.current = false;
    }
  };

  useEffect(() => {
    let active = true;
    let unsub = () => {};

    watchAuthState((user) => {
      if (!active) return;
      if (!user) {
        setChecking(false);
        router.replace("/login");
        return;
      }
      authUserRef.current = user;
      setAuthReady(true);
      setChecking(false);
    })
      .then((fn) => { unsub = fn; })
      .catch(() => { if (active) { setChecking(false); } });

    return () => { active = false; unsub(); };
  }, [router]);

  useEffect(() => {
    if (!authReady) return;
    createOrder(authUserRef.current?.email);

    setTimeLeft(600);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, model]);

  useEffect(() => {
    if (orderIdRef.current && authReady) {
      verifyOrder();
      pollRef.current = setInterval(verifyOrder, 6000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, authReady]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "payment_qr.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitUtr = () => {
    verifyOrder();
    setShowToast(true);
    setToastSuccess(false);
    setTimeout(() => {
      if (verifyState === "VERIFIED") {
        setToastSuccess(true);
        setToastModel(plan.label);
      }
    }, 2500);
  };

  return (
    <>
      <PageHead
        title="Subscription – Korven ₹749 & FX1 ₹1,100"
        description="Choose a TRION AI premium model: the Korven model at ₹749 or the FX1 model at ₹1,100, both with lifetime unlimited predictions and dashboard access."
        canonical="https://wingo30.com/subscription"
      >
        <meta name="keywords" content="TRION AI subscription, Korven model, FX1 model, Wingo30 premium, unlimited predictions, AI signal subscription" />
        <style dangerouslySetInnerHTML={{ __html: bgStyle }} />
      </PageHead>
      <OrganizationSchema />
      <WebsiteSchema />
      <WebPageSchema title="TRION AI Subscription – Korven ₹749 & FX1 ₹1,100" description="Choose a TRION AI premium model with lifetime unlimited predictions and dashboard access." url="https://wingo30.com/subscription" />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Subscription", url: "https://wingo30.com/subscription" }
      ]} />
      <SoftwareAppSchema />

      <div className="page-shell">
        <div className="app-screen" style={{ background: "#f8fafc", paddingBottom: "40px" }}>
          
          <div className="pay-screen" style={{ boxShadow: "none", borderRadius: 0, background: "#fcfefe" }}>
            
            {/* Header */}
            <div className="pay-screen-header">
              <div className="pay-screen-header-left">
                <h2 className="pay-screen-title">Payment</h2>
                <p className="pay-screen-subtitle">Complete your payment</p>
              </div>
              <div className="pay-secure-badge">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>100% Secure</span>
              </div>
            </div>

            {/* Amount Card */}
            <div className="pay-amount-card">
              <div className="pay-amount-card-bg"></div>
              <div className="pay-wave-bottom">
                <svg viewBox="0 24 150 28" preserveAspectRatio="none">
                  <style>{`@keyframes m{from{transform:translateX(-90px)}to{transform:translateX(85px)}}.l0{animation:m 11s linear infinite 0s}.l1{animation:m 14s linear infinite -2s}`}</style>
                  <defs>
                    <linearGradient id="wave-grad">
                      <stop stopColor="#00995c" />
                      <stop offset="1" stopColor="#00d47a" />
                    </linearGradient>
                    <path id="w" d="M -160 40 Q -116 24 -72 40 Q -28 56 16 40 Q 60 24 104 40 Q 148 56 192 40 L 192 80 L -160 80 Z" />
                  </defs>
                  <g>
                    <use href="#w" x="48" y="0" fill="url(#wave-grad)" opacity="0.3" className="l0" />
                    <use href="#w" x="70" y="3" fill="url(#wave-grad)" opacity="0.4" className="l1" />
                  </g>
                </svg>
              </div>
              <div className="pay-amount-left">
                <span className="pay-amount-label">Amount to Pay ({plan.label})</span>
                <div className="pay-amount-value">
                  <span className="pay-rupee">₹</span>
                  <span className="pay-price">{orderAmount || "..."}</span>
                </div>
                <div className="pay-order-row">
                  <span>Order ID: <strong>{orderId || "Loading..."}</strong></span>
                  <button className="pay-copy-btn" onClick={handleCopyOrderId} title="Copy Order ID" disabled={!orderId}>
                    {copied ? (
                      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="pay-expires-row">
                  Expires in: <span className="pay-expires-time">{formatTime(timeLeft)}</span>
                </div>
              </div>
              <div className="pay-amount-right">
                <div className="pay-secure-pill">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Secure payment</span>
                </div>
                <div className="pay-plan-badge">
                  <span className="pay-plan-badge-label">PREMIUM AI</span>
                  <span className="pay-plan-badge-sub">life time access</span>
                </div>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <h3 className="pay-method-title">Choose Payment Method</h3>
            <div className="pay-method-tabs">
              <button
                className={`pay-method-tab ${activeTab === "qr" ? "active" : ""}`}
                onClick={() => setActiveTab("qr")}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="6" height="6" rx="1" />
                  <rect x="16" y="2" width="6" height="6" rx="1" />
                  <rect x="2" y="16" width="6" height="6" rx="1" />
                  <rect x="16" y="16" width="4" height="4" rx="0.5" />
                  <path d="M12 2h2v4h-2zM2 12h4v2H2zM12 12h2v4h-2zM18 12h4v2h-4z" />
                </svg>
                QR Code
              </button>
              <button
                className={`pay-method-tab ${activeTab === "upi" ? "active" : ""}`}
                onClick={() => setActiveTab("upi")}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15l4-10h4l4 10" stroke="#FF9800" strokeWidth="2.5" />
                  <path d="M8 11h8" stroke="#4CAF50" strokeWidth="2.5" />
                </svg>
                UPI
              </button>
            </div>

            {/* QR Code Section */}
            {activeTab === "qr" && (
              <div className="pay-qr-section">
                <div className="pay-qr-section-header">
                  <div>
                    <h4 className="pay-qr-title">Scan & Pay</h4>
                    <div className="pay-qr-title-line"></div>
                  </div>
                  <button className="pay-download-btn" onClick={handleDownloadQR} title="Download QR">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                  </button>
                </div>

                <div className="pay-qr-container">
                  <div className="pay-qr-frame">
                    <div className="pay-qr-corner pay-qr-corner-tl"></div>
                    <div className="pay-qr-corner pay-qr-corner-tr"></div>
                    <div className="pay-qr-corner pay-qr-corner-bl"></div>
                    <div className="pay-qr-corner pay-qr-corner-br"></div>
                    {qrUrl ? (
                      <img src={qrUrl} alt="Payment QR Code" className="pay-qr-image" width="168" height="168" loading="eager" decoding="async" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="pay-qr-image" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#94a3b8" }}>Generating QR...</div>
                    )}
                  </div>
                </div>

                <p className="pay-qr-instruction">Scan this QR using any UPI app</p>

                <div className="pay-auto-verify">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Payment is auto-verified in the background. No UTR needed unless autopay fails.</span>
                </div>
              </div>
            )}

            {/* UPI Section */}
            {activeTab === "upi" && (
              <div className="pay-upi-section">
                <div className="pay-upi-apps-row">
                  <div className={`pay-upi-app ${!orderId ? "pay-upi-app-disabled" : ""}`} title="Google Pay" onClick={() => orderId && openUpiApp("com.google.android.apps.nbu.paisa.user", orderAmount)}>
                    <img src="/google-pay-logo.webp" alt="Google Pay" width="36" height="36" loading="lazy" />
                    <span>Google Pay</span>
                  </div>
                  <div className={`pay-upi-app ${!orderId ? "pay-upi-app-disabled" : ""}`} title="Paytm" onClick={() => orderId && openUpiApp("net.one97.paytm", orderAmount)}>
                    <img src="/paytm-india-logo.webp" alt="Paytm" width="36" height="36" loading="lazy" />
                    <span>Paytm</span>
                  </div>
                  <div className={`pay-upi-app ${!orderId ? "pay-upi-app-disabled" : ""}`} title="PhonePe" onClick={() => orderId && openUpiApp("com.phonepe.app", orderAmount)}>
                    <img src="/phonepe-india-logo.webp" alt="PhonePe" width="36" height="36" loading="lazy" />
                    <span>PhonePe</span>
                  </div>
                  <div className={`pay-upi-app ${!orderId ? "pay-upi-app-disabled" : ""}`} title="Super Pay" onClick={() => orderId && openUpiApp(null, orderAmount)}>
                    <img src="/super-app-logo-india.webp" alt="Super Pay" width="36" height="36" loading="lazy" />
                    <span>Super Pay</span>
                  </div>
                </div>
                <p className="pay-upi-instruction">Select your preferred UPI app to complete payment</p>
              </div>
            )}

            {/* UTR Submission */}
            <div className="pay-utr-section">
              <div className="pay-utr-header">
                <h4 className="pay-utr-title">Submit UTR Number</h4>
                <p className="pay-utr-hint">Enter 12-digit payment reference if aut...</p>
              </div>
              <div className="pay-utr-input-row">
                <input
                  id="utrInput"
                  type="text"
                  className="pay-utr-input"
                  placeholder="562412895621"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  maxLength={30}
                />
              </div>
            </div>

            {/* Real Cloudflare Turnstile Verification */}
            <div className="pay-verify-row" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "8px", background: "#ffffff", border: "1px solid #e2e8f0", margin: "12px 16px 0", borderRadius: "10px" }}>
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAAP14_N4A4w4_4v4"}
                onSuccess={setTurnstileToken}
                onExpire={() => setTurnstileToken(null)}
                onError={() => setTurnstileToken(null)}
                options={{ theme: "light", size: "normal" }}
                scriptLoading="async"
              />
            </div>

            {/* Submit Button */}
            <button 
              className="pay-submit-btn" 
              onClick={handleSubmitUtr}
              disabled={!turnstileToken || !orderId}
              style={{ opacity: turnstileToken && orderId ? 1 : 0.6, cursor: turnstileToken && orderId ? "pointer" : "not-allowed" }}
            >
              {verifyState === "VERIFIED" ? "Payment Successful ✓" : "Submit UTR"}
            </button>

            {/* Security Footer */}
            <div className="pay-security-footer">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#94a3b8">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
              </svg>
              <span>Your payment details are secure with us.</span>
            </div>

            {/* Toast */}
            {showToast && (
              <>
                <div className="payment-toast-overlay" onClick={() => setShowToast(false)} />
                <div className="payment-toast">
                  <svg width="16" height="96" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 8 0 Q 4 4.8, 8 9.6 T 8 19.2 Q 4 24, 8 28.8 T 8 38.4 Q 4 43.2, 8 48 T 8 57.6 Q 4 62.4, 8 67.2 T 8 76.8 Q 4 81.6, 8 86.4 T 8 96 L 0 96 L 0 0 Z" fill="#66cdaa" stroke="#66cdaa" strokeWidth="2" strokeLinecap="round"></path>
                  </svg>
                  <div className="payment-toast-body">
                    <p className="payment-toast-title">{toastSuccess ? "Payment Successful ✓" : verifyMsg || "Processing your payment..."}</p>
                    <p className="payment-toast-msg">{toastSuccess ? `${toastModel} Unlocked` : "Checking payment status"}</p>
                  </div>
                  <button className="payment-toast-close" onClick={() => setShowToast(false)}>
                    <svg className="w-7 h-7" fill="none" stroke="mediumseagreen" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}