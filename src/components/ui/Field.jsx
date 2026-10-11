// Form building blocks. Inputs use 16px text on phones so iOS doesn't zoom when one is focused.
const CONTROL =
  "w-full min-h-[38px] rounded-[9px] border bg-white px-[11px] text-base outline-none sm:text-sm focus:border-brand-2 focus:ring-[3px] focus:ring-brand-2/15";

const border = (error) => (error ? "border-danger" : "border-edge");

export function Field({ label, required = false, error, className = "", children }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      {label && (
        <span className="mb-[5px] block text-[12.5px] font-semibold text-ink/80">
          {label}
          {required && <em className="ml-0.5 text-danger not-italic">*</em>}
        </span>
      )}
      {children}
      {error && <small className="mt-1 block text-xs font-medium text-danger">{error}</small>}
    </label>
  );
}

export function Input({ error, className = "", ...rest }) {
  return <input className={`${CONTROL} ${border(error)} ${className}`} {...rest} />;
}

export function Select({ error, className = "", children, ...rest }) {
  return (
    <select className={`${CONTROL} ${border(error)} ${className}`} {...rest}>
      {children}
    </select>
  );
}

export function Textarea({ error, className = "", ...rest }) {
  return <textarea className={`${CONTROL} ${border(error)} min-h-[76px] resize-y py-[9px] ${className}`} {...rest} />;
}

// ₹ prefixed amount input
export function MoneyInput({ error, className = "", ...rest }) {
  return (
    <div
      className={`flex min-h-[38px] items-center rounded-[9px] border bg-white focus-within:border-brand-2 focus-within:ring-[3px] focus-within:ring-brand-2/15 ${border(error)} ${className}`}
    >
      <b className="pl-[11px] text-[15px] text-gold-dark">₹</b>
      <input className="w-full min-w-0 bg-transparent px-[11px] font-mono text-base font-semibold outline-none sm:text-sm" {...rest} />
    </div>
  );
}