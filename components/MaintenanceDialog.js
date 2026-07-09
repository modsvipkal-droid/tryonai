import { useEffect, useState, useCallback } from "react";

const POLL_INTERVAL = 15000;

export default function MaintenanceDialog() {
  const [config, setConfig] = useState(null);
  const [visible, setVisible] = useState(false);

  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/maintenance");
      if (!res.ok) return;
      const data = await res.json();
      setConfig(data);
      if (typeof window !== "undefined") {
        const isAdminPage = window.location.pathname === "/manageadminbhai";
        setVisible(!!data.enabled && !isAdminPage);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    check();
    const id = setInterval(check, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [check]);

  if (!visible || !config) return null;

  return (
    <div className="maintenance-overlay">
      <div className="maintenance-dialog">
        <div className="maintenance-icon-wrap">
          <div className="maintenance-icon-ring" />
          <svg className="maintenance-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>

        <h2 className="maintenance-title">{config.title || "Server Under Maintenance"}</h2>

        <p className="maintenance-message">
          {config.message || "We are currently performing server maintenance. Please wait while we complete the update. Thank you for your patience."}
        </p>

        {config.eta && (
          <div className="maintenance-eta">
            <svg className="maintenance-eta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Estimated Time: {config.eta}</span>
          </div>
        )}

        <div className="maintenance-loader">
          <div className="maintenance-loader-dot" />
          <div className="maintenance-loader-dot" />
          <div className="maintenance-loader-dot" />
          <span className="maintenance-loader-text">Please Wait...</span>
        </div>
      </div>
    </div>
  );
}
