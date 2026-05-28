/**
 * <E fieldKey="hero.title"> — Inline CMS editable wrapper.
 * Normal mode: zero overhead passthrough.
 * Edit mode: gold outline on hover + click → activates field in sidebar.
 * Preview mode: passthrough (no indicators).
 */
import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { useEditMode } from "@/contexts/EditModeContext";

interface EProps {
  fieldKey: string;
  children: React.ReactNode;
}

export function E({ fieldKey, children }: EProps) {
  const ctx = useEditMode();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);

  const isActive = ctx.activeFieldKey === fieldKey;

  // Scroll element into view when activated from sidebar
  useEffect(() => {
    if (isActive && wrapperRef.current) {
      const el = wrapperRef.current;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < 80 || rect.bottom > vh - 60) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [isActive]);

  // Passthrough in normal / preview mode
  if (!ctx.isEditMode || ctx.previewMode) return <>{children}</>;

  const highlighted = hovered || isActive;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    ctx.setActiveFieldKey(isActive ? null : fieldKey);
  };

  return (
    <span
      ref={wrapperRef}
      onClickCapture={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        position: "relative",
        outline: isActive
          ? "2px solid #C4903E"
          : highlighted
          ? "2px dashed rgba(196,144,62,0.8)"
          : "2px dashed transparent",
        outlineOffset: 4,
        borderRadius: 4,
        background: isActive ? "rgba(196,144,62,0.07)" : "transparent",
        transition: "outline-color 0.12s, background 0.12s",
        display: "inline",
      }}
    >
      {children}

      {/* Edit badge */}
      {highlighted && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: -10,
            right: -8,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: isActive ? "#C4903E" : "rgba(196,144,62,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 200,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <Pencil size={10} color="white" strokeWidth={2.5} />
        </span>
      )}
    </span>
  );
}
