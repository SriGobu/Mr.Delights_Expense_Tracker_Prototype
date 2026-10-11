# MR Delights – Expense Tracker (prototype)

Standalone Vite + React (JSX) app, built to be merged into the MR Delights ERP later.

## Run
```bash
npm install
npm run dev      # http://localhost:5174
npm run build
```

## Pages
- `/expenses`  – quick-add form, filters, list/grid expense log with infinite scroll
- `/dashboard` – KPIs, charts, budget watch, insights (calculated from real entries)

## Where data lives (prototype)
- Expenses, categories, budgets: browser localStorage (small text data).

## Moving into the ERP
- Same stack and colours as the ERP (React 19, Vite, react-router-dom, recharts, lucide-react).
- Replace `src/context/ExpenseContext.jsx` with API calls (`GET/POST/PUT/DELETE /api/expenses`).
