const BASE =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[9px] border font-semibold no-underline";

const SIZES = {
  md: "min-h-[38px] px-3.5 text-[13.5px]",
  sm: "min-h-8 px-2.5 text-[12.5px]",
};

const VARIANTS = {
  primary:
    "border-transparent bg-brand text-white shadow-[0_3px_10px_rgba(47,107,66,0.22)] enabled:hover:bg-brand-dark",
  secondary: "border-[#cfc8b8] bg-white text-ink enabled:hover:bg-sand",
  danger: "border-transparent bg-danger text-white enabled:hover:brightness-90",
  dangerOutline:
    "border-[#e3aaa5] bg-white text-danger enabled:hover:bg-[#fdeceb]",
};

export default function Button({
  variant = "secondary",
  size = "md",
  className = "",
  type = "button",
  ...rest
}) {
  if (variant === "link") {
    return (
      <button
        type={type}
        className={`inline-flex items-center gap-1.5 px-1 py-1 text-[13.5px] font-semibold text-[#20613a] hover:underline ${className}`}
        {...rest}
      />
    );
  }
  return (
    <button
      type={type}
      className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...rest}
    />
  );
}

// Small square icon-only button (edit / delete / close).
export function IconButton({
  danger = false,
  className = "",
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      className={`inline-grid place-items-center rounded-lg p-1.5 text-muted ${
        danger
          ? "hover:bg-[#fdeceb] hover:text-danger"
          : "hover:bg-sand hover:text-ink"
      } ${className}`}
      {...rest}
    />
  );
}
