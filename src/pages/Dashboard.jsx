import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Download,
  Hash,
  Lightbulb,
  Printer,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";
import { PAYMENT_COLORS } from "../constants/appConstants";
import { downloadCSV, fmt, fmtShort, formatDate, parseISO, shortDay, todayISO, toISO } from "../utils/format";
import { PERIODS, daysBetween, getRange } from "../utils/periods";
import CategoryPill from "../components/CategoryPill";
import Modal from "../components/Modal";
import Button from "../components/ui/Button";
import Card, { CardHead } from "../components/ui/Card";
import { Field, Input, MoneyInput } from "../components/ui/Field";

const inRange = (e, a, b) => e.date >= a && e.date <= b;
const sum = (rows) => rows.reduce((s, e) => s + e.amount, 0);
const pctChange = (cur, prev) => (prev > 0 ? ((cur - prev) / prev) * 100 : null);

function groupBy(rows, key) {
  const map = {};
  rows.forEach((e) => {
    map[e[key] || "—"] = (map[e[key] || "—"] || 0) + e.amount;
  });
  return Object.entries(map)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
}

const AXIS_TICK = { fill: "#5c5546", fontSize: 12 };
const rupeeTick = (v) => (v >= 1000 ? `₹${v / 1000}k` : `₹${v}`);

// For spending, going up is the "bad" direction, so up is red and down is green.
function Trend({ cur, prev }) {
  const p = pctChange(cur, prev);
  if (p === null) return <small className="mt-1 block text-xs text-muted">No earlier data to compare</small>;
  const up = p >= 0;
  return (
    <small className={`mt-1 flex items-center gap-0.5 text-xs font-semibold ${up ? "text-danger" : "text-brand"}`}>
      {up ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
      {Math.abs(p).toFixed(1)}% <span className="ml-0.5 font-normal text-muted">vs previous period</span>
    </small>
  );
}

function Kpi({ label, value, icon: Icon, className = "", children }) {
  return (
    <Card as="article" className={`p-3.5 ${className}`}>
      <div className="flex items-center justify-between gap-2 text-[12.5px] font-semibold text-muted">
        <span>{label}</span>
        <i className="grid size-7 place-items-center rounded-lg bg-sand text-gold-dark not-italic">
          <Icon size={16} />
        </i>
      </div>
      <strong className="mt-1.5 block truncate font-mono text-[19px] font-semibold">{value}</strong>
      {children}
    </Card>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-side px-3 py-2 text-xs text-white shadow-lg">
      <div className="text-white/70">{label ?? payload[0].name}</div>
      <b className="font-mono">{fmt(payload[0].value)}</b>
    </div>
  );
}

export default function Dashboard() {
  const { expenses, categoryMap, categories, budgets, setBudgets } = useExpenses();
  const [period, setPeriod] = useState("month");
  const [custom, setCustom] = useState({ from: "", to: "" });
  const [selectedCat, setSelectedCat] = useState(null);
  const [budgetOpen, setBudgetOpen] = useState(false);

  const now = new Date();
  const today = todayISO();
  const range = useMemo(() => getRange(period, custom), [period, custom]);

  const rows = useMemo(() => expenses.filter((e) => inRange(e, range.start, range.end)), [expenses, range]);
  const prevRows = useMemo(() => expenses.filter((e) => inRange(e, range.prevStart, range.prevEnd)), [expenses, range]);

  const total = sum(rows);
  const prevTotal = sum(prevRows);
  const periodDays = daysBetween(range.start, range.end);
  const prevDays = daysBetween(range.prevStart, range.prevEnd);
  const elapsed = Math.max(1, Math.min(periodDays, daysBetween(range.start, today > range.end ? range.end : today < range.start ? range.start : today)));
  const avgDaily = total / elapsed;
  const prevAvg = prevTotal / prevDays;
  const todayRows = expenses.filter((e) => e.date === today);
  const highest = rows.reduce((m, e) => (e.amount > (m?.amount || 0) ? e : m), null);

  const byCategory = useMemo(() => groupBy(rows, "category"), [rows]);
  const prevByCategory = useMemo(() => groupBy(prevRows, "category"), [prevRows]);
  const byPayment = useMemo(() => groupBy(rows, "payment"), [rows]);
  const byVendor = useMemo(() => groupBy(rows.filter((e) => e.vendor), "vendor"), [rows]);

  // Trend chart: daily buckets, or monthly buckets for long ranges
  const trend = useMemo(() => {
    const out = [];
    if (periodDays > 62) {
      const cursor = parseISO(range.start);
      cursor.setDate(1);
      const end = parseISO(range.end);
      while (cursor <= end) {
        const key = toISO(cursor).slice(0, 7);
        out.push({
          label: cursor.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
          amount: sum(rows.filter((e) => e.date.slice(0, 7) === key)),
        });
        cursor.setMonth(cursor.getMonth() + 1);
      }
    } else {
      const cursor = parseISO(range.start);
      for (let i = 0; i < periodDays; i++) {
        const iso = toISO(cursor);
        out.push({ label: shortDay(iso), amount: sum(rows.filter((e) => e.date === iso)) });
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    return out;
  }, [rows, range, periodDays]);

  const monthly = useMemo(() => {
    const out = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = toISO(d).slice(0, 7);
      out.push({
        label: d.toLocaleDateString("en-IN", { month: "short" }),
        amount: sum(expenses.filter((e) => e.date.slice(0, 7) === key)),
        current: i === 0,
      });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses]);

  // Budgets are tracked for the current calendar month
  const monthKey = toISO(now).slice(0, 7);
  const monthRows = expenses.filter((e) => e.date.slice(0, 7) === monthKey);
  const budgetRows = Object.entries(budgets)
    .filter(([, limit]) => limit > 0)
    .map(([name, limit]) => {
      const spent = sum(monthRows.filter((e) => e.category === name));
      return { name, limit, spent, pct: Math.round((spent / limit) * 100) };
    });

  const insights = useMemo(() => {
    const list = [];
    if (byCategory[0] && total > 0) {
      list.push(`${byCategory[0].name} is your biggest spend: ${Math.round((byCategory[0].amount / total) * 100)}% of this period.`);
    }
    const movers = byCategory
      .map((c) => {
        const prev = prevByCategory.find((p) => p.name === c.name)?.amount || 0;
        return { ...c, prev, diff: c.amount - prev };
      })
      .filter((c) => c.prev > 0 && c.diff >= 200)
      .sort((a, b) => b.diff / b.prev - a.diff / a.prev);
    if (movers[0]) {
      list.push(`${movers[0].name} is up ${Math.round((movers[0].diff / movers[0].prev) * 100)}% compared with the previous period.`);
    }
    if (byVendor[0]) {
      list.push(`Most paid vendor: ${byVendor[0].name} (${fmtShort(byVendor[0].amount)}).`);
    }
    return list;
  }, [byCategory, prevByCategory, byVendor, total]);

  const recent = [...rows]
    .filter((e) => !selectedCat || e.category === selectedCat)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .slice(0, 6);

  const exportCSV = () =>
    downloadCSV(
      `mr-delights-expenses-${range.start}_to_${range.end}.csv`,
      ["Date", "Amount", "Description", "Category", "Payment", "Vendor"],
      rows.map((e) => [formatDate(e.date), e.amount, e.description, e.category, e.payment, e.vendor]),
    );

  const periodLabel = `${formatDate(range.start)} – ${formatDate(range.end)}`;
  const monthLabel = now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="grid gap-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2.5 print:hidden">
        <div role="tablist" className="flex max-w-full gap-0.5 overflow-x-auto rounded-[10px] bg-[#ebe5d5] p-1">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={period === p.id}
              className={`rounded-[7px] px-3 py-1.5 text-[13px] font-semibold whitespace-nowrap ${
                period === p.id ? "bg-white text-brand shadow-[0_2px_6px_rgba(26,43,28,0.12)]" : "text-muted hover:bg-white/60"
              }`}
              onClick={() => {
                setPeriod(p.id);
                setSelectedCat(null);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCSV} disabled={!rows.length}>
            <Download size={16} /> Export CSV
          </Button>
          <Button onClick={() => window.print()}>
            <Printer size={16} /> Print / PDF
          </Button>
        </div>
      </div>

      {period === "custom" && (
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-sand-2 p-3 print:hidden">
          <Calendar size={16} className="mb-2.5 text-muted" />
          <Field label="From" className="w-[160px]">
            <Input type="date" value={custom.from} max={custom.to || undefined} onChange={(e) => setCustom({ ...custom, from: e.target.value })} />
          </Field>
          <Field label="To" className="w-[160px]">
            <Input type="date" value={custom.to} min={custom.from || undefined} onChange={(e) => setCustom({ ...custom, to: e.target.value })} />
          </Field>
        </div>
      )}

      <p className="text-[13px] text-muted">
        Showing <b className="text-ink">{periodLabel}</b>
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Kpi label="Total expenses" value={fmt(total)} icon={Wallet}>
          <Trend cur={total} prev={prevTotal} />
        </Kpi>
        <Kpi label="Today's expenses" value={fmt(sum(todayRows))} icon={Calendar}>
          <small className="mt-1 block text-xs text-muted">
            {todayRows.length} transaction{todayRows.length === 1 ? "" : "s"}
          </small>
        </Kpi>
        <Kpi label="Average daily spend" value={fmt(avgDaily)} icon={TrendingUp}>
          <Trend cur={avgDaily} prev={prevAvg} />
        </Kpi>
        <Kpi label="Highest expense" value={highest ? fmt(highest.amount) : "—"} icon={Receipt}>
          <small className="mt-1 block truncate text-xs text-muted">{highest ? highest.description : "No expenses in this period"}</small>
        </Kpi>
        <Kpi label="Transactions" value={String(rows.length)} icon={Hash} className="col-span-2 sm:col-span-1">
          <Trend cur={rows.length} prev={prevRows.length} />
        </Kpi>
      </div>

      {!rows.length ? (
        <Card className="grid gap-1 px-4 py-12 text-center">
          <b className="font-serif text-lg font-normal">No expenses in this period</b>
          <span className="text-[13.5px] text-muted">Pick another period, or add an expense from the Add Expense page.</span>
        </Card>
      ) : (
        <>
          <div className="grid gap-3 lg:grid-cols-3">
            <Card as="article" className="p-4 lg:col-span-2">
              <CardHead eyebrow="Spend overview" title={periodDays > 62 ? "Monthly expenses" : "Daily expenses"}>
                <div className="text-right">
                  <small className="block text-xs text-muted">Period total</small>
                  <b className="font-mono text-[15px]">{fmt(total)}</b>
                </div>
              </CardHead>
              <div className="mt-3 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#e8e3d6" vertical={false} />
                    <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
                    <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={50} tickFormatter={rupeeTick} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="amount" stroke="#9a7416" strokeWidth={2.5} fill="url(#goldFill)" dot={{ r: 3, fill: "#fffefa", stroke: "#9a7416", strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card as="article" className="p-4">
              <CardHead eyebrow="Breakdown" title="By category" />
              <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row lg:flex-col">
                <div className="relative size-[180px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={byCategory} dataKey="amount" nameKey="name" innerRadius="62%" outerRadius="95%" paddingAngle={2} onClick={(d) => setSelectedCat(selectedCat === d.name ? null : d.name)}>
                        {byCategory.map((c) => (
                          <Cell key={c.name} fill={categoryMap[c.name]?.chart || "#8b968f"} opacity={selectedCat && selectedCat !== c.name ? 0.35 : 1} style={{ cursor: "pointer", outline: "none" }} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
                    <strong className="font-mono text-[15px]">{fmtShort(total)}</strong>
                    <span className="text-xs text-muted">Total</span>
                  </div>
                </div>
                <ul className="w-full min-w-0 flex-1">
                  {byCategory.map((c) => (
                    <li key={c.name}>
                      <button
                        type="button"
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-sand ${selectedCat === c.name ? "bg-sand" : ""}`}
                        onClick={() => setSelectedCat(selectedCat === c.name ? null : c.name)}
                      >
                        <i className="size-2.5 shrink-0 rounded-full" style={{ background: categoryMap[c.name]?.chart || "#8b968f" }} />
                        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
                          {c.name}
                          <small className="ml-1.5 font-normal text-muted">{fmtShort(c.amount)}</small>
                        </span>
                        <b className="text-[13px]">{Math.round((c.amount / total) * 100)}%</b>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card as="article" className="p-4 lg:col-span-2">
              <CardHead eyebrow="6 month trend" title="Monthly comparison" />
              <div className="mt-3 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#e8e3d6" vertical={false} />
                    <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} />
                    <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={50} tickFormatter={rupeeTick} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(212,175,55,.12)" }} />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {monthly.map((m) => (
                        <Cell key={m.label} fill={m.current ? "#3d7a4f" : "#d4af37"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card as="article" className="p-4">
              <CardHead eyebrow="Payments" title="Payment split" />
              <ul className="mt-3 grid gap-3.5">
                {byPayment.map((p) => {
                  const pct = Math.round((p.amount / total) * 100);
                  const color = PAYMENT_COLORS[p.name] || "#8b968f";
                  return (
                    <li key={p.name}>
                      <div className="flex items-center justify-between text-[13px] font-semibold">
                        <span className="flex items-center gap-2">
                          <i className="size-2.5 rounded-full" style={{ background: color }} />
                          {p.name}
                        </span>
                        <b>{pct}%</b>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sand">
                        <i className="block h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <small className="mt-1 block text-xs text-muted">{fmtShort(p.amount)}</small>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <Card as="article" className="p-4">
              <CardHead eyebrow="Latest activity" title={selectedCat ? `${selectedCat} expenses` : "Recent expenses"}>
                {selectedCat && (
                  <Button variant="link" onClick={() => setSelectedCat(null)}>
                    Clear filter
                  </Button>
                )}
              </CardHead>
              <div className="mt-2">
                {recent.length ? (
                  recent.map((e) => (
                    <div key={e.id} className="flex items-center gap-3 border-b border-line py-2.5 last:border-b-0">
                      <div className="min-w-0 flex-1">
                        <b className="block truncate text-[13.5px] font-semibold">{e.description}</b>
                        <small className="text-xs text-muted">
                          {formatDate(e.date)} · {e.payment}
                        </small>
                      </div>
                      <CategoryPill category={e.category} />
                      <strong className="font-mono text-[13.5px] font-semibold">{fmt(e.amount)}</strong>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-[13.5px] text-muted">No expenses for this category.</p>
                )}
              </div>
            </Card>

            <div className="grid content-start gap-3">
              <Card as="article" className="p-4">
                <CardHead eyebrow={monthLabel} title="Budget watch">
                  <Button variant="link" onClick={() => setBudgetOpen(true)} className="print:hidden">
                    Manage
                  </Button>
                </CardHead>
                <div className="mt-3 grid gap-3.5">
                  {budgetRows.length ? (
                    budgetRows.map((b) => (
                      <div key={b.name}>
                        <div className="flex items-baseline justify-between gap-2 text-[13px]">
                          <b className="font-semibold">{b.name}</b>
                          <span className="text-muted">
                            {fmtShort(b.spent)} of {fmtShort(b.limit)}
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sand">
                          <i
                            className={`block h-full rounded-full ${b.pct >= 100 ? "bg-danger" : b.pct >= 90 ? "bg-gold" : "bg-brand-2"}`}
                            style={{ width: `${Math.min(100, b.pct)}%` }}
                          />
                        </div>
                        <small className={`mt-1 block text-xs ${b.pct >= 90 ? "font-semibold text-danger" : "text-muted"}`}>
                          {b.pct}% used{b.pct >= 100 ? " · over budget" : b.pct >= 90 ? " · almost at the limit" : ""}
                        </small>
                      </div>
                    ))
                  ) : (
                    <p className="text-[13.5px] text-muted">No budgets set. Click Manage to add one.</p>
                  )}
                </div>
              </Card>

              {insights.length > 0 && (
                <article className="flex gap-3 rounded-xl bg-side p-4 text-white print:break-inside-avoid">
                  <div className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-gold">
                    <Lightbulb size={20} />
                  </div>
                  <div>
                    <b className="text-[13px] font-semibold text-gold">Insights</b>
                    <ul className="mt-1.5 grid gap-1.5 text-[13.5px] text-white/90">
                      {insights.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              )}
            </div>
          </div>
        </>
      )}

      {budgetOpen && (
        <BudgetModal
          categories={categories}
          budgets={budgets}
          onClose={() => setBudgetOpen(false)}
          onSave={(b) => {
            setBudgets(b);
            setBudgetOpen(false);
          }}
        />
      )}
    </div>
  );
}

function BudgetModal({ categories, budgets, onClose, onSave }) {
  const [draft, setDraft] = useState(() => {
    const d = {};
    categories.forEach((c) => (d[c.name] = budgets[c.name] ? String(budgets[c.name]) : ""));
    return d;
  });

  const save = () => {
    const out = {};
    Object.entries(draft).forEach(([k, v]) => {
      if (Number(v) > 0) out[k] = Number(v);
    });
    onSave(out);
  };

  return (
    <Modal title="Monthly budgets" onClose={onClose}>
      <p className="text-[13.5px] text-muted">Set a monthly limit per category. Leave blank for no budget.</p>
      <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
        {categories.map((c) => (
          <Field key={c.name} label={c.name}>
            <MoneyInput type="number" min="0" placeholder="No limit" value={draft[c.name]} onChange={(e) => setDraft({ ...draft, [c.name]: e.target.value })} />
          </Field>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={save}>
          Save budgets
        </Button>
      </div>
    </Modal>
  );
}
