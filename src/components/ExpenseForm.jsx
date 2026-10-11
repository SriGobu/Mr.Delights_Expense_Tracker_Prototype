import { useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";
import { PAYMENT_METHODS } from "../constants/appConstants";
import { todayISO } from "../utils/format";
import Button from "./ui/Button";
import { Field, Input, MoneyInput, Select, Textarea } from "./ui/Field";

const NEW_CATEGORY = "__new__";

const emptyForm = (keep = {}) => ({
  date: keep.date || todayISO(),
  amount: "",
  description: "",
  category: "",
  payment: keep.payment || "UPI",
  vendor: "",
  notes: "",
});

const fromExpense = (e) => ({ ...emptyForm(), ...e, amount: String(e.amount) });

// Lives inside the drawer: a scrolling body plus a pinned footer.
//   onSubmit(data, { another })  another = true when "Save & add another" was used
//   onCancel                     closes the drawer
//   initial                      an expense to edit (omit for a new one)
export default function ExpenseForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Add expense",
}) {
  const { categories, addCategory } = useExpenses();
  const [form, setForm] = useState(() =>
    initial ? fromExpense(initial) : emptyForm(),
  );
  const [errors, setErrors] = useState({});
  const [newCat, setNewCat] = useState("");
  const formRef = useRef(null);
  const amountRef = useRef(null);
  const addAnother = useRef(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    const another = addAnother.current;
    addAnother.current = false;

    const next = {};
    if (!form.date) next.date = "Pick a date";
    if (!form.amount || Number(form.amount) <= 0)
      next.amount = "Enter a valid amount";
    if (!form.description.trim()) next.description = "Add a short description";
    if (!form.category || form.category === NEW_CATEGORY)
      next.category = "Choose a category";
    setErrors(next);
    if (Object.keys(next).length) return;

    onSubmit(
      {
        date: form.date,
        amount: Number(form.amount),
        description: form.description.trim(),
        category: form.category,
        payment: form.payment,
        vendor: form.vendor.trim(),
        notes: form.notes.trim(),
      },
      { another },
    );

    // "Save & add another": keep the date and payment method, clear the rest, jump to amount.
    if (another) {
      setForm(emptyForm({ date: form.date, payment: form.payment }));
      setErrors({});
      amountRef.current?.focus();
    }
  };

  const saveAndAddAnother = () => {
    addAnother.current = true;
    formRef.current?.requestSubmit();
  };

  const confirmNewCategory = () => {
    const name = addCategory(newCat);
    if (name) {
      set("category", name);
      setNewCat("");
    }
  };

  const SubmitIcon = initial ? Check : Plus;

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" required error={errors.date}>
              <Input
                type="date"
                error={errors.date}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </Field>
            <Field label="Amount" required error={errors.amount}>
              <MoneyInput
                ref={amountRef}
                error={errors.amount}
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Description" required error={errors.description}>
            <Input
              error={errors.description}
              placeholder="What was this expense for?"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>

          <Field label="Category" required error={errors.category}>
            <Select
              error={errors.category}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
              <option value={NEW_CATEGORY}>+ Add new category</option>
            </Select>
          </Field>

          {form.category === NEW_CATEGORY && (
            <div className="flex flex-wrap gap-2 rounded-xl border border-line bg-sand-2 p-2.5">
              <Input
                autoFocus
                className="min-w-[140px] flex-1"
                placeholder="New category name"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    confirmNewCategory();
                  }
                }}
              />
              <Button
                variant="primary"
                size="sm"
                className="self-center"
                onClick={confirmNewCategory}
                disabled={!newCat.trim()}
              >
                Add
              </Button>
              <Button
                size="sm"
                className="self-center"
                onClick={() => set("category", "")}
              >
                Cancel
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Payment method">
              <Select
                value={form.payment}
                onChange={(e) => set("payment", e.target.value)}
              >
                {PAYMENT_METHODS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </Select>
            </Field>
            <Field label="Paid to / Vendor">
              <Input
                placeholder="Optional"
                value={form.vendor}
                onChange={(e) => set("vendor", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Notes">
            <Textarea
              rows={2}
              placeholder="Reference number, reason, anything useful…"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-line px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))] sm:px-6">
        <Button className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        {!initial && (
          <Button className="flex-1" onClick={saveAndAddAnother}>
            Save &amp; add another
          </Button>
        )}
        <Button type="submit" variant="primary" className="flex-1">
          <SubmitIcon size={16} /> {submitLabel}
        </Button>
      </div>
    </form>
  );
}
