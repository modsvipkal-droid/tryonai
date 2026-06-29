import { useEffect, useRef, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { watchAuthState } from "@/lib/firebase";

// ─── Icons ─────────────────────────────────────────────────────────────────────
function Icon({ name, className = "" }) {
  const icons = {
    back: <path d="M15.5 4.75 8.25 12l7.25 7.25" />,
    upload: (
      <>
        <path d="M12 16.5V7.5" />
        <path d="m8.25 11.25 3.75-3.75 3.75 3.75" />
        <path d="M4.75 16.75a3 3 0 0 0 3 3h8.5a3 3 0 0 0 3-3" />
      </>
    ),
    file: (
      <>
        <path d="M7.75 3.75h5.5l4 4v12.5a1 1 0 0 1-1 1H7.75a1 1 0 0 1-1-1V4.75a1 1 0 0 1 1-1Z" />
        <path d="M13.25 3.75v4h4" />
      </>
    ),
    check: <path d="m4.75 12 5.25 5.25 9.25-9.5" />,
    x: (
      <>
        <path d="m6.75 6.75 10.5 10.5" />
        <path d="m17.25 6.75-10.5 10.5" />
      </>
    ),
    trash: (
      <>
        <path d="M5.75 7.75h12.5M9.75 3.75h4.5M9.75 11.25v5M14.25 11.25v5M6.75 7.75l1 11.5h8.5l1-11.5" />
      </>
    ),
    refresh: (
      <>
        <path d="M18.25 12a6.25 6.25 0 0 1-9.61 5.28" />
        <path d="M5.75 12A6.25 6.25 0 0 1 15.36 6.72" />
        <path d="m15.75 3.75 0 3.25-3.25 0" />
        <path d="m8.25 20.25 0-3.25 3.25 0" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3.75 4.75 7v5.5c0 3.5 3.1 6.7 7.25 7.75C16.15 19.2 19.25 16 19.25 12.5V7Z" />
      </>
    ),
    alert: (
      <>
        <circle cx="12" cy="12" r="8.25" />
        <path d="M12 8.25v4.5" />
        <circle cx="12" cy="15.25" r=".75" fill="currentColor" stroke="none" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="8.25" />
        <path d="M12 11.25v4.5" />
        <circle cx="12" cy="8.75" r=".75" fill="currentColor" stroke="none" />
      </>
    ),
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      {icons[name]}
    </svg>
  );
}

// ─── Get Firebase ID token for API auth ────────────────────────────────────────
async function getIdToken() {
  try {
    const { getFirebaseAuth } = await import("@/lib/firebase");
    const auth = await getFirebaseAuth();
    if (auth?.currentUser) {
      return await auth.currentUser.getIdToken();
    }
  } catch {}
  return null;
}

// ─── Format date helper ───────────────────────────────────────────────────────
function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Upload State Machine ──────────────────────────────────────────────────────
// idle | previewing | uploading | success | error

export default function LogicPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);

  const [uploadState, setUploadState] = useState("idle"); // idle | previewing | uploading | success | error
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeLogic, setActiveLogic] = useState(null);
  const [loadingLogic, setLoadingLogic] = useState(false);

  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);

  // ─── Auth gate ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    let unsub = () => {};
    watchAuthState(async (u) => {
      if (!active) return;
      if (!u) {
        router.replace("/login");
        return;
      }
      try {
        const { isUnlimited } = await import("@/lib/storage");
        const unlimited = await isUnlimited(u.email);
        if (!unlimited) {
          router.replace("/subscription");
          return;
        }
      } catch {
        router.replace("/subscription");
        return;
      }
      setUser(u);
      setAuthReady(true);
    })
      .then((fn) => { unsub = fn; })
      .catch(() => { if (active) router.replace("/login"); });
    return () => { active = false; unsub(); };
  }, [router]);

  // ─── Load active logic ─────────────────────────────────────────────────────
  const loadLogicStatus = useCallback(async () => {
    setLoadingLogic(true);
    try {
      const token = await getIdToken();
      const res = await fetch("/api/logic/status", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setActiveLogic(data.hasLogic ? data.logic : null);
    } catch {
      setActiveLogic(null);
    } finally {
      setLoadingLogic(false);
    }
  }, []);

  useEffect(() => {
    if (authReady && user) loadLogicStatus();
  }, [authReady, user, loadLogicStatus]);

  // ─── File validation (client-side pre-check) ───────────────────────────────
  function clientValidate(file) {
    if (!file) return "No file selected.";
    if (!file.name.toLowerCase().endsWith(".trionai")) {
      return `Invalid file type "${file.name.split(".").pop()}". Only .trionai files are accepted.`;
    }
    if (file.size === 0) return "File is empty.";
    if (file.size > 5 * 1024 * 1024) return "File exceeds 5 MB limit.";
    return null;
  }

  // ─── Handle file selection ─────────────────────────────────────────────────
  function handleFile(file) {
    const err = clientValidate(file);
    if (err) {
      setErrorMsg(err);
      setUploadState("error");
      return;
    }

    if (activeLogic) {
      setPendingFile(file);
      setShowReplaceModal(true);
      return;
    }

    setSelectedFile(file);
    setUploadState("previewing");
    setErrorMsg("");
  }

  // ─── Upload to server ──────────────────────────────────────────────────────
  async function doUpload(file) {
    setUploadState("uploading");
    setProgress(0);
    setErrorMsg("");

    // Animate progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 85) { clearInterval(interval); return p; }
        return p + Math.random() * 15;
      });
    }, 120);

    try {
      const token = await getIdToken();
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/logic/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });

      clearInterval(interval);
      setProgress(100);

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Upload failed. Please try again.");
        setUploadState("error");
        return;
      }

      setActiveLogic(data.logic);
      setUploadState("success");
    } catch (err) {
      clearInterval(interval);
      setErrorMsg("Network error. Please check your connection and try again.");
      setUploadState("error");
    }
  }

  // ─── Drag & drop ──────────────────────────────────────────────────────────
  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }
  function handleDragLeave() {
    setDragOver(false);
  }
  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  }

  // ─── Browse button ─────────────────────────────────────────────────────────
  function handleBrowseClick() {
    fileInputRef.current?.click();
  }
  function handleFileInput(e) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  // ─── Replace confirm ───────────────────────────────────────────────────────
  function handleReplaceConfirm() {
    setShowReplaceModal(false);
    const file = pendingFile;
    setPendingFile(null);
    setSelectedFile(file);
    setUploadState("previewing");
    setErrorMsg("");
  }

  // ─── Delete logic ──────────────────────────────────────────────────────────
  async function handleDeleteConfirm() {
    setDeleting(true);
    try {
      const token = await getIdToken();
      const res = await fetch("/api/logic/delete", {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setActiveLogic(null);
        setUploadState("idle");
      }
    } catch {}
    setDeleting(false);
    setShowDeleteModal(false);
  }

  // ─── Reset state ───────────────────────────────────────────────────────────
  function handleReset() {
    setUploadState("idle");
    setSelectedFile(null);
    setErrorMsg("");
    setProgress(0);
  }

  if (!authReady || !user) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fffe" }}>
        <div className="logic-spinner" style={{ borderTopColor: "#00985b", borderColor: "rgba(0,152,91,0.2)" }} />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Custom Logic Upload – TryonAI</title>
        <meta name="description" content="Upload your custom .trionai logic file to enable personalized AI predictions on TryonAI." />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".trionai"
        style={{ display: "none" }}
        onChange={handleFileInput}
      />

      {/* Replace modal */}
      {showReplaceModal && (
        <div className="logic-modal-overlay" onClick={() => setShowReplaceModal(false)}>
          <div className="logic-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logic-modal-icon warning">
              <Icon name="refresh" />
            </div>
            <h3 className="logic-modal-title">Replace Current Logic?</h3>
            <p className="logic-modal-body">
              Your existing active logic will be replaced. This action cannot be undone. Your new logic will become active immediately.
            </p>
            <div className="logic-modal-actions">
              <button className="logic-modal-cancel" onClick={() => setShowReplaceModal(false)}>
                Cancel
              </button>
              <button className="logic-modal-confirm replace" onClick={handleReplaceConfirm}>
                Replace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="logic-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="logic-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logic-modal-icon danger">
              <Icon name="trash" />
            </div>
            <h3 className="logic-modal-title">Delete Logic?</h3>
            <p className="logic-modal-body">
              Your uploaded logic will be permanently deleted. You will need to re-upload a .trionai file before generating predictions again.
            </p>
            <div className="logic-modal-actions">
              <button className="logic-modal-cancel" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
                Cancel
              </button>
              <button className="logic-modal-confirm delete" onClick={handleDeleteConfirm} disabled={deleting}>
                {deleting ? <span className="logic-spinner" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="logic-page-shell">
        <div className="logic-page">
          {/* ── Header ── */}
          <div className="logic-header">
            <button className="logic-header-back" onClick={() => router.push("/")} aria-label="Back">
              <Icon name="back" />
            </button>
            <div className="logic-header-info">
              <h1 className="logic-header-title">Custom Logic Upload</h1>
              <p className="logic-header-sub">Secure · Encrypted · Private</p>
            </div>
            <span className="logic-header-badge">Pro</span>
          </div>

          {/* ── Page content ── */}
          <div className="logic-content">

            {/* ── Active Logic Card ── */}
            {loadingLogic ? (
              <div className="logic-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
                <span className="logic-spinner" style={{ borderTopColor: "#00985b", borderColor: "rgba(0,152,91,0.2)" }} />
              </div>
            ) : activeLogic ? (
              <div className="logic-active-card">
                <div className="logic-active-header">
                  <div className="logic-active-name-row">
                    <div className="logic-active-file-icon">
                      <Icon name="shield" />
                    </div>
                    <div>
                      <p className="logic-active-name">{activeLogic.name}</p>
                      <p className="logic-active-file">{activeLogic.fileName}</p>
                    </div>
                  </div>
                  <div className="logic-status-badge">
                    <span className="logic-status-dot" />
                    Active
                  </div>
                </div>

                <div className="logic-active-details">
                  <div className="logic-detail-item">
                    <p className="logic-detail-label">Version</p>
                    <p className="logic-detail-value accent">{activeLogic.version}</p>
                  </div>
                  <div className="logic-detail-item">
                    <p className="logic-detail-label">Compatibility</p>
                    <p className="logic-detail-value">{activeLogic.compatibility}</p>
                  </div>
                  <div className="logic-detail-item">
                    <p className="logic-detail-label">Uploaded</p>
                    <p className="logic-detail-value" style={{ fontSize: 11, whiteSpace: "normal" }}>
                      {formatDate(activeLogic.uploadDate)}
                    </p>
                  </div>
                  <div className="logic-detail-item">
                    <p className="logic-detail-label">Last Used</p>
                    <p className="logic-detail-value" style={{ fontSize: 11, whiteSpace: "normal" }}>
                      {activeLogic.lastUsed ? formatDate(activeLogic.lastUsed) : "Not yet used"}
                    </p>
                  </div>
                </div>

                <div className="logic-actions">
                  <button
                    className="logic-replace-btn"
                    onClick={() => {
                      setUploadState("idle");
                      setTimeout(() => fileInputRef.current?.click(), 50);
                    }}
                  >
                    <Icon name="refresh" />
                    Replace Logic
                  </button>
                  <button className="logic-delete-btn" onClick={() => setShowDeleteModal(true)}>
                    <Icon name="trash" />
                    Delete Logic
                  </button>
                </div>
              </div>
            ) : (
              <div className="logic-card" style={{ padding: 0 }}>
                <div className="logic-empty">
                  <div className="logic-empty-icon">
                    <Icon name="shield" />
                  </div>
                  <h3>No Logic Uploaded</h3>
                  <p>Upload a .trionai file to enable AI predictions. Each account has its own private logic.</p>
                </div>
              </div>
            )}

            {/* ── Upload Card ── */}
            <div className="logic-card">
              <p className="logic-card-title">
                <span className="logic-card-title-icon">
                  <Icon name="upload" />
                </span>
                {activeLogic ? "Replace Logic File" : "Upload Logic File"}
              </p>

              {/* Result animations */}
              {uploadState === "success" && (
                <div className="logic-result-anim">
                  <div className="logic-success-circle">
                    <Icon name="check" />
                  </div>
                  <p className="logic-result-title">Logic Imported!</p>
                  <p className="logic-result-msg">
                    Your custom logic is now active and ready to power predictions.
                  </p>
                  <button
                    className="logic-browse-btn"
                    style={{ marginTop: 8 }}
                    onClick={handleReset}
                  >
                    Upload Another
                  </button>
                </div>
              )}

              {uploadState === "error" && (
                <div className="logic-result-anim">
                  <div className="logic-error-circle">
                    <Icon name="x" />
                  </div>
                  <p className="logic-result-title">Import Failed</p>
                  <p className="logic-result-msg error">{errorMsg || "Invalid TrionAI Logic File"}</p>
                  <button
                    className="logic-browse-btn"
                    style={{ marginTop: 8, background: "linear-gradient(135deg, #ff2e39, #ff5561)", boxShadow: "0 4px 16px rgba(255,46,57,0.3)" }}
                    onClick={handleReset}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {(uploadState === "idle" || uploadState === "previewing" || uploadState === "uploading") && (
                <>
                  {/* Drop zone */}
                  <div
                    className={`logic-upload-zone ${dragOver ? "drag-over" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={uploadState === "idle" ? handleBrowseClick : undefined}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleBrowseClick()}
                    aria-label="Drop .trionai file here or click to browse"
                  >
                    <div className="logic-upload-icon">
                      <Icon name="upload" />
                    </div>
                    <p className="logic-upload-title">
                      {dragOver ? "Drop it here!" : "Drag & Drop your logic file"}
                    </p>
                    <p className="logic-upload-subtitle">
                      Only accepts digitally signed TrionAI logic files
                    </p>
                    <div className="logic-upload-ext">
                      ✦ .trionai
                    </div>
                    {uploadState === "idle" && (
                      <button
                        className="logic-browse-btn"
                        onClick={(e) => { e.stopPropagation(); handleBrowseClick(); }}
                        type="button"
                      >
                        <Icon name="file" />
                        Browse File
                      </button>
                    )}
                  </div>

                  {/* File preview */}
                  {(uploadState === "previewing" || uploadState === "uploading") && selectedFile && (
                    <div className="logic-preview">
                      <div className="logic-preview-icon">
                        <Icon name="file" />
                      </div>
                      <div className="logic-preview-info">
                        <p className="logic-preview-name">{selectedFile.name}</p>
                        <p className="logic-preview-meta">
                          {(selectedFile.size / 1024).toFixed(1)} KB · .trionai
                        </p>
                      </div>
                      {uploadState === "previewing" && (
                        <button
                          className="logic-browse-btn"
                          style={{ padding: "10px 18px", fontSize: 13 }}
                          onClick={() => doUpload(selectedFile)}
                        >
                          Import
                        </button>
                      )}
                      {uploadState === "uploading" && (
                        <span className="logic-spinner" style={{ borderTopColor: "#00985b", borderColor: "rgba(0,152,91,0.2)", flexShrink: 0 }} />
                      )}
                    </div>
                  )}

                  {/* Progress bar */}
                  {uploadState === "uploading" && (
                    <div className="logic-progress-wrap">
                      <div className="logic-progress-info">
                        <span className="logic-progress-filename">{selectedFile?.name}</span>
                        <span className="logic-progress-pct">{Math.round(progress)}%</span>
                      </div>
                      <div className="logic-progress-bar">
                        <div className="logic-progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Supported Formats ── */}
            <div className="logic-formats-card">
              <p className="logic-card-title">
                <span className="logic-card-title-icon">
                  <Icon name="info" />
                </span>
                Supported File Format
              </p>

              <div className="logic-formats-grid">
                <div className="logic-format-item allowed">
                  <span className="logic-format-icon">✓</span>
                  .trionai
                </div>
                <div className="logic-format-item blocked">
                  <span className="logic-format-icon">✕</span>
                  .json
                </div>
                <div className="logic-format-item blocked">
                  <span className="logic-format-icon">✕</span>
                  .txt
                </div>
                <div className="logic-format-item blocked">
                  <span className="logic-format-icon">✕</span>
                  .js / .ts
                </div>
                <div className="logic-format-item blocked">
                  <span className="logic-format-icon">✕</span>
                  .zip
                </div>
                <div className="logic-format-item blocked">
                  <span className="logic-format-icon">✕</span>
                  .exe
                </div>
              </div>
            </div>

            {/* ── Security Info ── */}
            <div className="logic-card">
              <p className="logic-card-title">
                <span className="logic-card-title-icon">
                  <Icon name="shield" />
                </span>
                Security & Privacy
              </p>
              {[
                { text: "AES-256-GCM encrypted storage per user" },
                { text: "Logic never exposed through network or DevTools" },
                { text: "Each account is fully isolated — no shared logic" },
                { text: "Only prediction results are returned to the frontend" },
                { text: "Server-side validation with signature + integrity checks" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 0",
                    borderBottom: i < 4 ? "1px solid rgba(0,152,91,0.07)" : "none",
                    fontSize: 13,
                    color: "#0f1f18",
                  }}
                >
                  <span style={{
                    width: 20, height: 20, borderRadius: 6,
                    background: "rgba(0,152,91,0.1)", color: "#00985b",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontSize: 11, fontWeight: 700,
                  }}>✓</span>
                  {item.text}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
