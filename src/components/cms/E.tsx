/**
 * <E fieldKey="hero.title"> — Inline CMS editable wrapper.
 * In normal mode (non-edit): renders children as-is, zero overhead.
 * In edit mode (AdminVisualEditor): hover border + click → floating popover editor.
 */
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEditMode } from "@/contexts/EditModeContext";
import { getPageDef } from "@/lib/contentSchema";

// ── Floating edit popover ─────────────────────────────────────────────────────

function EditPopover({
  label,
  value,
  isLong,
  rect,
  onChange,
  onClose,
}: {
  label: string;
  value: string;
  isLong: boolean;
  rect: DOMRect;
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  const popoverH = isLong ? 220 : 148;
  const spaceBelow = window.innerHeight - rect.bottom;

  const top =
    spaceBelow >= popoverH + 16
      ? rect.bottom + 10
      : rect.top - popoverH - 10;

  const left = Math.min(
    Math.max(rect.left, 8),
    window.innerWidth - 328 - 8
  );

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid #C4903E",
    borderRadius: 10,
    padding: "9px 12px",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
    lineHeight: 1.55,
    color: "#1C3A52",
    boxSizing: "border-box",
    resize: "vertical" as const,
  };

  return createPortal(
    <>
      {/* Backdrop — close on click outside */}
      <div
        style={{ position: "fixed", inset: 0, zIndex: 99990 }}
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.97 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top,
          left,
          width: 328,
          background: "white",
          borderRadius: 18,
          boxShadow:
            "0 12px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
          zIndex: 99991,
          padding: "16px 16px 14px",
          border: "1px solid rgba(196,144,62,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
        onClickCapture={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 11,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#C4903E",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#1C3A52",
              }}
            >
              {label}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              color: "#94a3b8",
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 4,
              borderRadius: 6,
              display: "flex",
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Input / Textarea */}
        {isLong ? (
          <textarea
            autoFocus
            rows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
          />
        ) : (
          <input
            autoFocus
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
          />
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 11,
          }}
        >
          <span style={{ fontSize: 11, color: "#94a3b8" }}>
            Sauvegarde automatique ✓
          </span>
          <button
            onClick={onClose}
            style={{
              background: "#1C3A52",
              color: "white",
              border: "none",
              borderRadius: 9,
              padding: "6px 16px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Terminé
          </button>
        </div>
      </motion.div>
    </>,
    document.body
  );
}

// ── Editable wrapper ──────────────────────────────────────────────────────────

interface EProps {
  /** Dot-notation key matching contentSchema (e.g. "hero.title") */
  fieldKey: string;
  children: React.ReactNode;
}

export function E({ fieldKey, children }: EProps) {
  const ctx = useEditMode();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Non-edit mode: zero overhead passthrough
  if (!ctx.isEditMode) return <>{children}</>;

  // Resolve field metadata from schema
  const pageDef = ctx.pageKey ? getPageDef(ctx.pageKey) : null;
  const fieldDef = pageDef?.fields.find((f) => f.key === fieldKey);
  const isLong = fieldDef?.type === "long" || fieldDef?.type === "textarea";
  const label = fieldDef?.label ?? fieldKey;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = wrapperRef.current;
    if (!el) return;
    setRect(el.getBoundingClientRect());
    setEditValue(ctx.getFieldValue(fieldKey));
    setOpen(true);
  };

  const handleChange = (value: string) => {
    setEditValue(value);
    ctx.updateField(fieldKey, value); // live preview — updates React Query cache
  };

  const highlighted = hovered || open;

  return (
    <>
      <span
        ref={wrapperRef}
        onClickCapture={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          cursor: "pointer",
          outline: highlighted ? "2px dashed #C4903E" : "2px dashed transparent",
          outlineOffset: 3,
          borderRadius: 3,
          background: open ? "rgba(196,144,62,0.07)" : "transparent",
          transition: "outline-color 0.12s ease, background 0.12s ease",
          display: "inline",
        }}
      >
        {children}
      </span>

      <AnimatePresence>
        {open && rect && (
          <EditPopover
            key="popover"
            label={label}
            value={editValue}
            isLong={isLong}
            rect={rect}
            onChange={handleChange}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
