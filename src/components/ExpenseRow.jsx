import { Pencil, Trash2 } from "lucide-react";
import { fmt, formatDate } from "../utils/format";
import CategoryPill from "./CategoryPill";
import { IconButton } from "./ui/Button";

// One column template shared by the DataView header and every row, so they always line up.
export const LIST_COLS = "@3xl:grid-cols-[92px_112px_minmax(0,1fr)_160px_110px_76px]";

export const LIST_COLUMNS = [
  { label: "Date" },
  { label: "Amount" },
  { label: "Description" },
  { label: "Category" },
  { label: "Payment" },
  { label: "Actions", className: "text-right" },
];

// List-mode row. Narrow areas get a compact two-line layout; wide areas get the column grid.
export default function ExpenseRow({ expense, listCols = LIST_COLS, onEdit, onDelete }) {
  const actions = (
    <div className="flex justify-end gap-0.5">
      <IconButton title="Edit" aria-label={`Edit ${expense.description}`} onClick={() => onEdit(expense)}>
        <Pencil size={16} />
      </IconButton>
      <IconButton danger title="Delete" aria-label={`Delete ${expense.description}`} onClick={() => onDelete(expense)}>
        <Trash2 size={16} />
      </IconButton>
    </div>
  );

  return (
    <div className="px-5 py-3 hover:bg-sand-2">
      {/* Compact */}
      <div className="flex items-start gap-3 @3xl:hidden">
        <div className="min-w-0 flex-1">
          <b className="block truncate text-sm font-semibold">{expense.description}</b>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
            <CategoryPill category={expense.category} />
            <span>
              {formatDate(expense.date)} · {expense.payment}
            </span>
          </div>
          {expense.vendor && <small className="mt-1 block truncate text-xs text-muted">{expense.vendor}</small>}
        </div>
        <div className="shrink-0 text-right">
          <strong className="font-mono text-sm font-semibold">{fmt(expense.amount)}</strong>
          <div className="mt-1">{actions}</div>
        </div>
      </div>

      {/* Wide */}
      <div className={`hidden items-center gap-3 @3xl:grid ${listCols}`}>
        <span className="text-[13px] whitespace-nowrap text-muted">{formatDate(expense.date)}</span>
        <strong className="font-mono text-[13.5px] font-semibold">{fmt(expense.amount)}</strong>
        <div className="min-w-0">
          <b className="block truncate text-sm font-semibold">{expense.description}</b>
          {expense.vendor && <small className="block truncate text-xs text-muted">{expense.vendor}</small>}
        </div>
        <div>
          <CategoryPill category={expense.category} />
        </div>
        <span className="text-[13px] whitespace-nowrap">{expense.payment}</span>
        {actions}
      </div>
    </div>
  );
}
