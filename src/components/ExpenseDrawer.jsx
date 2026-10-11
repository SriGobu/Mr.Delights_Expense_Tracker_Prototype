import { useEffect } from "react";
import { X } from "lucide-react";
import { IconButton } from "./ui/Button";

// Right-side drawer (same pattern as the ERP's Inventory add/edit drawer).
// Children should fill the height, e.g. <ExpenseForm /> which has its own scroll area + footer.
export default function ExpenseDrawer({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-end bg-[rgba(10,20,12,0.45)] print:hidden"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex h-full w-full flex-col bg-paper shadow-[-8px_0_40px_rgba(0,0,0,0.12)] sm:max-w-md"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-6 sm:py-5">
          <h2 className="font-serif text-lg font-normal">{title}</h2>
          <IconButton onClick={onClose} aria-label="Close">
            <X size={20} />
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  );
}
