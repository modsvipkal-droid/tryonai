import { useState, useEffect, useRef } from "react";
import { PageHead, OrganizationSchema, WebsiteSchema, WebPageSchema, BreadcrumbSchema, SoftwareAppSchema } from "@/components/SEO";

const bgStyle = `html, body { background: #f8fafc !important; overflow: auto !important; } #__next { height: auto; min-height: 100vh; overflow: auto; }`;

function generateOrderId() {
  return "ORD" + Date.now() + Math.floor(Math.random() * 1000);
}

export default function Subscription() {
  const [showPayment, setShowPayment] = useState(false);
  const [utr, setUtr] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState("qr");
  const [orderId, setOrderId] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (showPayment) {
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
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showPayment]);

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

  return (
    <>
      <PageHead
        title="Subscription Plans"
        description="Subscribe to TryonAI for unlimited AI-powered Wingo30 predictions, premium signals, real-time pattern analysis, and advanced trading insights."
        canonical="https://wingo30.com/subscription"
      >
        <meta name="keywords" content="Wingo AI subscription, TryonAI subscription, Wingo30 premium, unlimited predictions, AI signal subscription, trading plan, prediction access, Kal mods, wingo vip, wingo analyst, wingo real ai bot, wingo colour prediction, trionAI, trillionaire" />
        <style dangerouslySetInnerHTML={{ __html: bgStyle }} />
      </PageHead>
      <OrganizationSchema />
      <WebsiteSchema />
      <WebPageSchema title="Subscription Plans | TryonAI" description="Subscribe to TryonAI for unlimited Wingo30 predictions." url="https://wingo30.com/subscription" />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Subscription", url: "https://wingo30.com/subscription" }
      ]} />
      <SoftwareAppSchema />
      <div style={{ minHeight: "100vh", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginBottom: "24px", textAlign: "center" }}>TryonAI Premium Subscription Plans</h1>
        <div className="grid-wrapper" style={showPayment ? { display: "none" } : {}}>
          <div className="card-pattern-grid"></div>
          <div className="card-overlay-dots"></div>

          <div className="bold-pattern">
            <svg viewBox="0 0 100 100">
              <path
                strokeDasharray="15 10"
                strokeWidth="10"
                stroke="#000"
                fill="none"
                d="M0,0 L100,0 L100,100 L0,100 Z"
              ></path>
            </svg>
          </div>

          <div className="card-title-area">
            <span>PREMIUM PLANE</span>
            <span className="card-tag">paid</span>
          </div>

          <div className="card-body">
            <div className="card-description">
              Our 3-Level fix win prediction Policy is designed to give users added confidence. If all three prediction levels fail, a refund is available according to our refund terms. We are committed to transparency, fairness, and providing the best possible experience for every subscriber.
            </div>

            <div className="feature-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M20,4C21.1,4 22,4.9 22,6V18C22,19.1 21.1,20 20,20H4C2.9,20 2,19.1 2,18V6C2,4.9 2.9,4 4,4H20M4,6V18H20V6H4M6,9H18V11H6V9M6,13H16V15H6V13Z"
                    ></path>
                  </svg>
                </div>
                <span className="feature-text">3-Level Strategy</span>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z"
                    ></path>
                  </svg>
                </div>
                <span className="feature-text">Sure-Shot Signal</span>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z"
                    ></path>
                  </svg>
                </div>
                <span className="feature-text">High Accuracy Performance</span>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M9.19,6.35C8.41,7.13 7.75,8.05 7.25,9H5V11H7.12C7.05,11.32 7,11.66 7,12C7,12.34 7.05,12.68 7.12,13H5V15H7.25C7.75,15.95 8.41,16.87 9.19,17.65L7.77,19.07L9.88,21.18L11.3,19.77C11.85,20.03 12.41,20.2 13,20.31V23H15V20.31C15.59,20.2 16.15,20.03 16.7,19.77L18.12,21.18L20.23,19.07L18.81,17.65C19.59,16.87 20.25,15.95 20.75,15H23V13H20.88C20.95,12.68 21,12.34 21,12C21,11.66 20.95,11.32 20.88,11H23V9H20.75C20.25,8.05 19.59,7.13 18.81,6.35L20.23,4.93L18.12,2.82L16.7,4.23C16.15,3.97 15.59,3.8 15,3.69V1H13V3.69C12.41,3.8 11.85,3.97 11.3,4.23L9.88,2.82L7.77,4.93L9.19,6.35M13,17A5,5 0 0,1 8,12A5,5 0 0,1 13,7A5,5 0 0,1 18,12A5,5 0 0,1 13,17Z"
                    ></path>
                  </svg>
                </div>
                <span className="feature-text">Wingo 30-Second Expert Predictions</span>
              </div>
            </div>

            <div className="card-actions">
              <div className="price">
                <span className="price-currency">$</span>499
                <span className="price-period">Limited</span>
              </div>

              <button className="card-button" onClick={() => setShowPayment(true)}>Get Started</button>
            </div>
          </div>

          <div className="dots-pattern">
            <svg viewBox="0 0 80 40">
              <circle fill="#000" r="3" cy="10" cx="10"></circle>
              <circle fill="#000" r="3" cy="10" cx="30"></circle>
              <circle fill="#000" r="3" cy="10" cx="50"></circle>
              <circle fill="#000" r="3" cy="10" cx="70"></circle>
              <circle fill="#000" r="3" cy="20" cx="20"></circle>
              <circle fill="#000" r="3" cy="20" cx="40"></circle>
              <circle fill="#000" r="3" cy="20" cx="60"></circle>
              <circle fill="#000" r="3" cy="30" cx="10"></circle>
              <circle fill="#000" r="3" cy="30" cx="30"></circle>
              <circle fill="#000" r="3" cy="30" cx="50"></circle>
              <circle fill="#000" r="3" cy="30" cx="70"></circle>
            </svg>
          </div>

          <div className="accent-shape"></div>
          <div className="corner-slice"></div>

          <div className="stamp">
            <span className="stamp-text">Approved</span>
          </div>
        </div>

        {showPayment && (
          <div className="pay-screen">
            {/* Header */}
            <div className="pay-screen-header">
              <div className="pay-screen-header-left">
                <button className="pay-back-btn" onClick={() => setShowPayment(false)}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h2 className="pay-screen-title">Payment</h2>
                  <p className="pay-screen-subtitle">Complete your payment</p>
                </div>
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
                  <span>Order ID: {orderId}</span>
                  <button className="pay-copy-btn" onClick={handleCopyOrderId} title="Copy Order ID">
                    {copied ? (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#FF9800">
                  <path d="M7.5 3L12 7.5 16.5 3 21 7.5 16.5 12 21 16.5 16.5 21 12 16.5 7.5 21 3 16.5 7.5 12 3 7.5z" />
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
                  <button className="pay-download-btn" title="Download QR">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

            {/* Cloudflare / Success indicator */}
            <div className="pay-verify-row">
              <div className="pay-success-check">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#16a34a" />
                  <polyline points="8 12 11 15 16 9" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="pay-success-text">Success!</span>
              </div>
              <div className="pay-cloudflare">
                <svg viewBox="0 0 80 32" width="110" height="28">
                  <path d="M56.3 16.7c.3-1.1-.1-2.1-.9-2.6-.7-.5-1.7-.4-2.5.1l-22.5.3c-.1 0-.2-.1-.2-.1 0-.1 0-.2.1-.2.3-.4.8-.7 1.3-.7l22.3-.3c2.1-.1 4.3 1.4 5 3.5l.7 2c0 .1 0 .1 0 .2 0 0 0 .1-.1.1-1 1.8-2.8 3-4.9 3H17c-.2 0-.3-.2-.3-.3.5-3.5 3.6-6.2 7.2-6.2h1.2c.5-2.3 2.5-4 4.9-4 1.2 0 2.3.4 3.1 1.1.5-.1 1-.2 1.5-.2 2.7 0 5 1.9 5.5 4.4l.2-.1z" fill="#F38020" />
                  <path d="M60.4 14.1c-.1 0-.3 0-.4.1l-.3.9c-.3 1.1.1 2.1.9 2.6.7.5 1.7.4 2.5-.1l1.1-.1c.1 0 .2.1.2.1 0 .1 0 .1-.1.2-1 1.7-2.8 2.9-4.8 2.9h-1c-.2 0-.3-.2-.3-.3.5-3.5 3.6-6.2 7.2-6.2h.1c-.8-.7-1.9-1.1-3.1-1.1-.7 0-1.4.1-2 .4z" fill="#FAAE40" />
                </svg>
                <div className="pay-cloudflare-text">
                  <span className="pay-cf-brand">CLOUDFLARE</span>
                  <span className="pay-cf-links">Privacy · Help</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button className="pay-submit-btn" onClick={() => {
              setShowToast(true);
              const msg = encodeURIComponent(`Hello Admin, I have submitted the payment request on the website.\nPlan: PRO PLANS (₹599)\nUTR ID: ${utr}\nPlease verify and activate my Wingo Signals Premium access now. Thanks!`);
              window.open(`https://t.me/kal_mods?text=${msg}`, '_blank');
              setTimeout(() => setShowToast(false), 3000);
            }}>
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
        )}
      </div>
    </>
  );
}
