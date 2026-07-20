import { useState, useEffect, useRef } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { PageHead, OrganizationSchema, WebsiteSchema, WebPageSchema, BreadcrumbSchema, SoftwareAppSchema } from "@/components/SEO";

// Custom styles override to ensure scroll works inside .app-screen container
const bgStyle = `
  html, body {
    background: #eef7f3 !important;
    overflow: auto !important;
    height: auto !important;
    min-height: 100vh;
  }
  #__next {
    height: auto !important;
    min-height: 100vh;
    overflow: auto !important;
  }
`;

function generateOrderId() {
  return "ORD" + Date.now() + Math.floor(Math.random() * 1000);
}

export default function Subscription() {
  const [utr, setUtr] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState("qr");
  const [orderId, setOrderId] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [copied, setCopied] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setOrderId(generateOrderId());
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
  }, []);

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
    link.href = "/799qr.jpg";
    link.download = "payment_qr.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <PageHead
        title="Payment | TryonAI"
        description="Complete your payment to unlock TryonAI premium plans."
        canonical="https://wingo30.com/subscription"
      >
        <meta name="keywords" content="Wingo AI subscription, TryonAI subscription, Wingo30 premium, unlimited predictions, AI signal subscription" />
        <style dangerouslySetInnerHTML={{ __html: bgStyle }} />
      </PageHead>
      <OrganizationSchema />
      <WebsiteSchema />
      <WebPageSchema title="Payment | TryonAI" description="Complete your payment to unlock TryonAI premium plans." url="https://wingo30.com/subscription" />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Subscription", url: "https://wingo30.com/subscription" }
      ]} />
      <SoftwareAppSchema />

      <div className="page-shell">
        <div className="app-screen" style={{ minHeight: "100vh", background: "#f8fafc", paddingBottom: "40px" }}>
          
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
              <div className="pay-amount-left">
                <span className="pay-amount-label">Amount to Pay</span>
                <div className="pay-amount-value">
                  <span className="pay-rupee">₹</span>
                  <span className="pay-price">599.00</span>
                </div>
                <div className="pay-order-row">
                  <span>Order ID: <strong>{orderId}</strong></span>
                  <button className="pay-copy-btn" onClick={handleCopyOrderId} title="Copy Order ID">
                    {copied ? (
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                  <span className="pay-plan-badge-sub">30 days 35/day access</span>
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
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                    <img src="/799qr.jpg" alt="Payment QR Code" className="pay-qr-image" width="200" height="200" loading="lazy" />
                  </div>
                </div>

                <p className="pay-qr-instruction">Scan this QR using any UPI app</p>

                <div className="pay-auto-verify">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                  <div className="pay-upi-app" title="Google Pay">
                    <img src="/google-pay-logo.webp" alt="Google Pay" width="40" height="40" loading="lazy" />
                    <span>Google Pay</span>
                  </div>
                  <div className="pay-upi-app" title="Paytm">
                    <img src="/paytm-india-logo.webp" alt="Paytm" width="40" height="40" loading="lazy" />
                    <span>Paytm</span>
                  </div>
                  <div className="pay-upi-app" title="PhonePe">
                    <img src="/phonepe-india-logo.webp" alt="PhonePe" width="40" height="40" loading="lazy" />
                    <span>PhonePe</span>
                  </div>
                  <div className="pay-upi-app" title="Super Pay">
                    <img src="/super-app-logo-india.webp" alt="Super Pay" width="40" height="40" loading="lazy" />
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
            <div className="pay-verify-row" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "12px", background: "#ffffff", border: "1px solid #e2e8f0" }}>
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
              onClick={() => {
                setShowToast(true);
                const msg = encodeURIComponent(`Hello Admin, I have submitted the payment request on the website.\nPlan: PRO PLANS (₹599)\nUTR ID: ${utr}\nPlease verify and activate my Wingo Signals Premium access now. Thanks!`);
                window.open(`https://t.me/kal_mods?text=${msg}`, '_blank');
                setTimeout(() => setShowToast(false), 3000);
              }}
              disabled={!turnstileToken}
              style={{ opacity: turnstileToken ? 1 : 0.6, cursor: turnstileToken ? "pointer" : "not-allowed" }}
            >
              Submit UTR
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
                    <p className="payment-toast-title">Success !</p>
                    <p className="payment-toast-msg">hey!<br />PROCESSING YOUR UTR</p>
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
