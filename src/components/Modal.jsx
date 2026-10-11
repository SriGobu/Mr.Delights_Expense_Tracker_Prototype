import { useEffect } from "react";
import { X } from "lucide-react";
import { IconButton } from "./ui/Button";

export default function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-[rgba(10,20,12,0.55)] p-3.5 backdrop-blur-[2px] print:hidden"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[calc(100dvh-28px)] w-full overflow-y-auto rounded-[14px] bg-paper shadow-[0_25px_80px_rgba(0,0,0,0.3)] ${wide ? "max-w-[900px]" : "max-w-[520px]"}`}
      >
        <div className="flex items-center justify-between px-[18px] pt-3.5 pb-1">
          <h3 className="font-serif text-xl font-normal">{title}</h3>
          <IconButton onClick={onClose} aria-label="Close">
            <X size={20} />
          </IconButton>
        </div>
        <div className="px-[18px] pt-1.5 pb-[18px]">{children}</div>
      </div>
    </div>
  );
}