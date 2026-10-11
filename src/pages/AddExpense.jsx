import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";
import { useToast } from "../context/ToastContext";
import { useViewMode } from "../hooks/useViewMode";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { BATCH } from "../constants/appConstants";
import { downloadCSV, fmt, formatDate, todayISO } from "../utils/format";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import DataView from "../components/DateView";
import ViewToggle from "../components/viewToggle";
import ExpenseDrawer from "../components/ExpenseDrawer";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseFilters, { EMPTY_FILTERS } from "../components/ExpenseFilters";
import ExpenseCard from "../components/ExpenseCard";
import ExpenseRow, { LIST_COLS, LIST_COLUMNS } from "../components/ExpenseRow";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AddExpense() {
  const { expenses, categories, addExpense, updateExpense, deleteExpense } =
    useExpenses();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useViewMode("expenses");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [limit, setLimit] = useState(BATCH); // infinite scroll: how many items are shown
  const [drawer, setDrawer] = useState(null); // null | { expense?: expense being edited }
  const [deleting, setDeleting] = useState(null);

  // Any filter or sort change starts again from the first batch
  const updateFilters = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setLimit(BATCH);
  };
  const clearFilters = () =>
    updateFilters({ ...EMPTY_FILTERS, sort: filters.sort });

  const { search, category, payment, from, to, sort } = filters;
  const hasFilters = Boolean(search || category || payment || from || to);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = expenses.filter(
      (e) =>
        (!q ||
          e.description.toLowerCase().includes(q) ||
          (e.vendor || "").toLowerCase().includes(q) ||
          (e.notes || "").toLowerCase().includes(q)) &&
        (!category || e.category === category) &&
        (!payment || e.payment === payment) &&
        (!from || e.date >= from) &&
        (!to || e.date <= to),
    );
    const [key, dir] = sort.split("-");
    rows.sort((a, b) => {
      const diff =
        key === "date"
          ? a.date.localeCompare(b.date) || a.id - b.id
          : a.amount - b.amount;
      return dir === "asc" ? diff : -diff;
    });
    return rows;
  }, [expenses, search, category, payment, from, to, sort]);

  const visible = filtered.slice(0, limit);
  const hasMore = limit < filtered.length;

  const sentinelRef = useInfiniteScroll({
    hasMore,
    onLoadMore: () => setLimit((l) => l + BATCH),
    watch: limit,
  });

  // KPI mini-cards
  const today = todayISO();
  const monthKey = today.slice(0, 7);
  const sum = (rows) => rows.reduce((s, e) => s + e.amount, 0);
  const monthTotal = sum(
    expenses.filter((e) => e.date.slice(0, 7) === monthKey),
  );
  const todayTotal = sum(expenses.filter((e) => e.date === today));
  const kpis = [
    { label: "This Month", value: fmt(monthTotal), tone: "text-brand-2" },
    { label: "Today", value: fmt(todayTotal), tone: "text-gold-dark" },
    { label: "Entries", value: String(expenses.length), tone: "text-ink" },
    {
      label: hasFilters ? "Filtered Total" : "All-time Total",
      value: fmt(sum(filtered)),
      tone: "text-brand-2",
    },
  ];

  const openAdd = () => setDrawer({});
  const openEdit = (expense) => setDrawer({ expense });
  const closeDrawer = () => setDrawer(null);

  const handleSubmit = (data, { another } = {}) => {
    if (drawer?.expense) {
      updateExpense(drawer.expense.id, data);
      toast("Expense updated");
      closeDrawer();
      return;
    }
    addExpense(data);
    toast("Expense added");
    if (!another) closeDrawer();
  };

  const handleDelete = () => {
    deleteExpense(deleting.id);
    setDeleting(null);
    toast("Expense deleted");
  };

  const exportCSV = () => {
    downloadCSV(
      "mr-delights-expenses.csv",
      [
        "Date",
        "Amount",
        "Description",
        "Category",
        "Payment",
        "Vendor",
        "Notes",
      ],
      filtered.map((e) => [
        formatDate(e.date),
        e.amount,
        e.description,
        e.category,
        e.payment,
        e.vendor,
        e.notes,
      ]),
    );
  };

  const empty = (
    <div className="grid justify-items-center gap-1 px-4 py-14 text-center">
      <b className="font-serif text-lg font-normal">
        {expenses.length
          ? "No expenses match these filters"
          : "No expenses yet"}
      </b>
      <span className="text-[13.5px] text-muted">
        {expenses.length
          ? "Try clearing a filter."
          : "Add your first expense to start tracking."}
      </span>
      {!expenses.length && (
        <Button variant="primary" className="mt-3" onClick={openAdd}>
          <Plus size={16} /> Add Expense
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header: actions sit in the top-right corner */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <ViewToggle mode={viewMode} onChange={setViewMode} />
        <Button onClick={exportCSV} disabled={!filtered.length}>
          <Download size={16} />
          <span className="hidden sm:inline">Export CSV</span>
        </Button>
        <Button variant="primary" className="px-4" onClick={openAdd}>
          <Plus size={16} /> Add Expense
        </Button>
      </div>

      {/* KPI mini-cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="flex min-w-0 flex-col gap-1 rounded-2xl border border-line bg-paper px-4 py-3 shadow-card"
          >
            <span className="text-xs font-medium text-muted">{k.label}</span>
            <span className={`truncate font-mono text-lg font-bold ${k.tone}`}>
              {k.value}
            </span>
          </div>
        ))}
      </div>

      <ExpenseFilters
        filters={filters}
        onChange={updateFilters}
        onClear={clearFilters}
        hasFilters={hasFilters}
        categories={categories}
      />

      {/* Expense list */}
      <Card className="overflow-hidden">
        <DataView
          mode={viewMode}
          items={visible}
          getKey={(e) => e.id}
          renderCard={(e) => (
            <ExpenseCard expense={e} onEdit={openEdit} onDelete={setDeleting} />
          )}
          renderRow={(e, listCols) => (
            <ExpenseRow
              expense={e}
              listCols={listCols}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          )}
          columns={LIST_COLUMNS}
          listCols={LIST_COLS}
          empty={empty}
        />

        {hasMore && (
          <div
            ref={sentinelRef}
            className="py-3 text-center text-xs text-muted"
          >
            Loading more…
          </div>
        )}

        {filtered.length > 0 && (
          <div className="border-t border-line px-4 py-3 text-[13px] text-muted">
            Showing <b className="text-ink">{visible.length}</b> of{" "}
            {filtered.length}
            {filtered.length !== expenses.length &&
              ` (filtered from ${expenses.length})`}
          </div>
        )}
      </Card>

      {drawer && (
        <ExpenseDrawer
          title={drawer.expense ? "Edit expense" : "Add expense"}
          onClose={closeDrawer}
        >
          <ExpenseForm
            // remount when switching between add and different expenses so the fields reset
            key={drawer.expense?.id ?? "new"}
            initial={drawer.expense}
            submitLabel={drawer.expense ? "Save changes" : "Add expense"}
            onSubmit={handleSubmit}
            onCancel={closeDrawer}
          />
        </ExpenseDrawer>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this expense?"
          message={`"${deleting.description}" (${fmt(deleting.amount)}) will be permanently removed.`}
          confirmLabel="Delete expense"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
