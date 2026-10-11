import { Pencil, Trash2 } from "lucide-react";
import { fmt, formatDate } from "../utils/format";
import CategoryPill from "./CategoryPill";
import { IconButton } from "./ui/Button";

// Grid-mode card for one expense.
export default function ExpenseCard({ expense, onEdit, onDelete }) {
  return (
    <article className="flex h-full flex-col gap-2.5 rounded-xl border border-line bg-paper p-3.5 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <CategoryPill category={expense.category} />
        <span className="text-xs text-muted">{formatDate(expense.date)}</span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold break-words">{expense.description}</h3>
        {expense.vendor && <p className="mt-0.5 text-xs text-muted">{expense.vendor}</p>}
        {expense.notes && <p className="mt-1.5 line-clamp-2 text-xs text-muted">{expense.notes}</p>}
      </div>

      <div className="flex items-end justify-between gap-2 border-t border-line pt-2.5">
        <div>
          <strong className="font-mono text-base font-semibold">{fmt(expense.amount)}</strong>
          <div className="text-xs text-muted">{expense.payment}</div>
        </div>
        <div className="flex gap-0.5">
          <IconButton title="Edit" aria-label={`Edit ${expense.description}`} onClick={() => onEdit(expense)}>
            <Pencil size={16} />
          </IconButton>
          <IconButton danger title="Delete" aria-label={`Delete ${expense.description}`} onClick={() => onDelete(expense)}>
            <Trash2 size={16} />
          </IconButton>
        </div>
      </div>
    </article>
  );
}
