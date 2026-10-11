export function fmt(n) {
  return (
    "₹" +
    Number(n || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function fmtShort(n) {
  return "₹" + Math.round(Number(n || 0)).toLocaleString("en-IN");
}

export function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const todayISO = () => toISO(new Date());

export function parseISO(iso) {
  return new Date(iso + "T00:00:00");
}

// 2026-10-02 -> 02/10/2026
export function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function shortDay(iso) {
  return parseISO(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function downloadCSV(filename, headers, rows) {
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");
  const blob = new Blob(["\ufeff" + lines], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
