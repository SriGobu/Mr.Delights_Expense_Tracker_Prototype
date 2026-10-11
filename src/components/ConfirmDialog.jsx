import { Trash2 } from "lucide-react";
import Button from "./ui/Button";

export default function ConfirmDialog({ title, message, confirmLabel = "Delete", onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-[rgba(10,20,12,0.55)] p-3.5 backdrop-blur-[2px] print:hidden"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-[380px] rounded-[14px] bg-paper p-[22px] text-center shadow-[0_25px_80px_rgba(0,0,0,0.3)]"
      >
        <div className="mx-auto grid size-11 place-items-center rounded-full bg-[#fbe3e0] text-danger">
          <Trash2 size={22} />
        </div>
        <h3 className="mt-2.5 mb-1.5 font-serif text-xl font-normal">{title}</h3>
        <p className="text-[13.5px] text-muted">{message}</p>
        <div className="mt-[18px] flex flex-wrap justify-center gap-2">
          <Button onClick={onCancel}>Keep it</Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}