import { Search } from "lucide-react";
import { PAYMENT_METHODS } from "../constants/appConstants";
import Button from "./ui/Button";
import { Input, Select } from "./ui/Field";

export const SORTS = [
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
  { id: "amount-desc", label: "Amount: high to low" },
  { id: "amount-asc", label: "Amount: low to high" },
];

export const EMPTY_FILTERS = {
  search: "",
  category: "",
  payment: "",
  from: "",
  to: "",
  sort: "date-desc",
};

// Date input with its label inside the box, so the compact row stays one line tall.
function DateBox({ label, ...rest }) {
  return (
    <label className="flex min-h-[38px] items-center gap-2 rounded-[9px] border border-edge bg-white pl-[11px] text-[12.5px] font-semibold text-ink/80 focus-within:border-brand-2 focus-within:ring-[3px] focus-within:ring-brand-2/15">
      {label}
      <input
        type="date"
        aria-label={label}
        className="min-w-0 flex-1 bg-transparent py-1.5 pr-2 text-base font-normal text-ink outline-none sm:text-sm"
        {...rest}
      />
    </label>
  );
}

// Compact one-row filter bar (search + dropdowns), like the Inventory page.
//   filters   current values (see EMPTY_FILTERS)
//   onChange  (patch) => void, e.g. onChange({ category: "Marketing" })
//   onClear   resets search / category / payment / dates
export default function ExpenseFilters({
  filters,
  onChange,
  onClear,
  hasFilters,
  categories,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-full min-w-0 2xl:min-w-[220px] 2xl:flex-1">
        <Search
          size={15}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
        />
        <Input
          className="pl-9!"
          placeholder="Search description, vendor, notes…"
          aria-label="Search expenses"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
        <Select
          className="sm:w-[150px]"
          aria-label="Filter by category"
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </Select>

        <Select
          className="sm:w-[140px]"
          aria-label="Filter by payment method"
          value={filters.payment}
          onChange={(e) => onChange({ payment: e.target.value })}
        >
          <option value="">All payments</option>
          {PAYMENT_METHODS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </Select>

        <DateBox
          label="From"
          value={filters.from}
          max={filters.to || undefined}
          onChange={(e) => onChange({ from: e.target.value })}
        />
        <DateBox
          label="To"
          value={filters.to}
          min={filters.from || undefined}
          onChange={(e) => onChange({ to: e.target.value })}
        />

        <Select
          className="col-span-2 sm:col-span-1 sm:w-[170px]"
          aria-label="Sort expenses"
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value })}
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </Select>
      </div>

      {hasFilters && (
        <Button variant="link" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
