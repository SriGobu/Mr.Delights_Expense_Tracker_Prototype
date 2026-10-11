import { toISO, parseISO } from "./format";

export const PERIODS = [
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "lastMonth", label: "Last Month" },
  { id: "fy", label: "This Year (Apr–Mar)" },
  { id: "custom", label: "Custom" },
];

const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

// Returns the selected range plus the previous comparable range (all ISO, inclusive).
export function getRange(id, custom = {}, now = new Date()) {
  let s, e, ps, pe;

  if (id === "week") {
    const dow = (now.getDay() + 6) % 7; // Monday = 0
    s = addDays(now, -dow);
    e = addDays(s, 6);
    ps = addDays(s, -7);
    pe = addDays(s, -1);
  } else if (id === "month" || id === "lastMonth") {
    const offset = id === "month" ? 0 : -1;
    s = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    e = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
    ps = new Date(s.getFullYear(), s.getMonth() - 1, 1);
    pe = new Date(s.getFullYear(), s.getMonth(), 0);
  } else if (id === "fy") {
    const y = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    s = new Date(y, 3, 1);
    e = new Date(y + 1, 2, 31);
    ps = new Date(y - 1, 3, 1);
    pe = new Date(y, 2, 31);
  } else {
    s = parseISO(custom.from || toISO(now));
    e = parseISO(custom.to || toISO(now));
    if (e < s) [s, e] = [e, s];
    const len = Math.round((e - s) / 864e5) + 1;
    pe = addDays(s, -1);
    ps = addDays(pe, -(len - 1));
  }

  return {
    start: toISO(s),
    end: toISO(e),
    prevStart: toISO(ps),
    prevEnd: toISO(pe),
  };
}

export function daysBetween(startISO, endISO) {
  return Math.round((parseISO(endISO) - parseISO(startISO)) / 864e5) + 1;
}
