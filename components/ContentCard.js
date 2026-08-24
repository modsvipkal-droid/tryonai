import React from "react";

// Predefined configuration for each card variant
const CARD_CONFIGS = {
  warning: {
    icon: "🚨",
    defaultTitle: "Warning & Risk Notice",
    className: "scc-warning",
  },
  alert: {
    icon: "🚨",
    defaultTitle: "Warning & Risk Notice",
    className: "scc-warning",
  },
  important: {
    icon: "⚠️",
    defaultTitle: "Important Rule",
    className: "scc-important",
  },
  "key-point": {
    icon: "🔑",
    defaultTitle: "Key Point",
    className: "scc-key-point",
  },
  "best-practice": {
    icon: "✅",
    defaultTitle: "Best Practice",
    className: "scc-best-practice",
  },
  "common-mistake": {
    icon: "❌",
    defaultTitle: "Common Mistake to Avoid",
    className: "scc-common-mistake",
  },
  tip: {
    icon: "💡",
    defaultTitle: "Pro Tip",
    className: "scc-tip",
  },
  "pro-tip": {
    icon: "💡",
    defaultTitle: "Pro Tip",
    className: "scc-tip",
  },
  note: {
    icon: "📝",
    defaultTitle: "Note",
    className: "scc-note",
  },
};

export const smartCardStyles = `
  .smart-content-card {
    border-radius: 14px;
    padding: 18px 22px;
    margin: 24px 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    font-size: 14.5px;
    line-height: 1.68;
    position: relative;
    border: 1px solid transparent;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .smart-content-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  }

  .scc-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.01em;
    margin-bottom: 8px;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.05em;
  }
  .scc-icon {
    font-size: 15px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
  }
  .scc-title {
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .scc-body {
    color: #334155;
    font-size: 14.5px;
    line-height: 1.68;
  }
  .scc-body p {
    margin: 0 0 10px;
    font-size: 14.5px;
    line-height: 1.68;
  }
  .scc-body p:last-child {
    margin-bottom: 0;
  }
  .scc-body strong {
    font-weight: 600;
  }
  .scc-body ul {
    margin: 6px 0 0;
    padding-left: 20px;
  }
  .scc-body li {
    margin-bottom: 6px;
  }
  .scc-body li:last-child {
    margin-bottom: 0;
  }

  /* 🔴 Warning / Alert (Most Important) */
  .scc-warning {
    background: #fff5f5;
    border-color: #fecaca;
    border-left: 4px solid #dc2626;
  }
  .scc-warning .scc-header {
    color: #991b1b;
  }
  .scc-warning .scc-body strong {
    color: #7f1d1d;
  }

  /* 🔴 Important Rule / Critical Info */
  .scc-important {
    background: #fefce8;
    border-color: #fef08a;
    border-left: 4px solid #d97706;
  }
  .scc-important .scc-header {
    color: #854d0e;
  }
  .scc-important .scc-body strong {
    color: #713f12;
  }

  /* 🟠 Key Point (Essential Takeaway) */
  .scc-key-point {
    background: #f0fdf4;
    border-color: #bbf7d0;
    border-left: 4px solid #00985b;
  }
  .scc-key-point .scc-header {
    color: #166534;
  }
  .scc-key-point .scc-body strong {
    color: #0f172a;
  }

  /* 🟠 Best Practice */
  .scc-best-practice {
    background: #f0fdfa;
    border-color: #99f6e4;
    border-left: 4px solid #0d9488;
  }
  .scc-best-practice .scc-header {
    color: #115e59;
  }
  .scc-best-practice .scc-body strong {
    color: #042f2e;
  }

  /* 🟠 Common Mistake */
  .scc-common-mistake {
    background: #fff1f2;
    border-color: #fecdd3;
    border-left: 4px solid #e11d48;
  }
  .scc-common-mistake .scc-header {
    color: #9f1239;
  }
  .scc-common-mistake .scc-body strong {
    color: #881337;
  }

  /* 🟢 Pro Tip */
  .scc-tip {
    background: #eff6ff;
    border-color: #bfdbfe;
    border-left: 4px solid #2563eb;
  }
  .scc-tip .scc-header {
    color: #1e40af;
  }
  .scc-tip .scc-body strong {
    color: #1e3a8a;
  }

  /* 🟢 Note */
  .scc-note {
    background: #f8fafc;
    border-color: #e2e8f0;
    border-left: 4px solid #64748b;
  }
  .scc-note .scc-header {
    color: #475569;
  }
  .scc-note .scc-body strong {
    color: #0f172a;
  }

  @media (max-width: 640px) {
    .smart-content-card {
      padding: 14px 16px;
      margin: 20px 0;
      border-radius: 12px;
      font-size: 13.5px;
    }
    .scc-header {
      font-size: 11px;
      margin-bottom: 6px;
    }
    .scc-body {
      font-size: 13.5px;
    }
  }
`;

export default function ContentCard({
  type = "note",
  title,
  icon,
  children,
  className = "",
}) {
  const config = CARD_CONFIGS[type] || CARD_CONFIGS.note;
  const displayIcon = icon || config.icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <aside
      className={`smart-content-card ${config.className} ${className}`.trim()}
      role="complementary"
      aria-label={displayTitle}
    >
      <div className="scc-header">
        <span className="scc-icon" aria-hidden="true">
          {displayIcon}
        </span>
        <span className="scc-title">{displayTitle}</span>
      </div>
      <div className="scc-body">{children}</div>
    </aside>
  );
}
