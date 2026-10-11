import { useState } from "react";
import { COMPANY, LOGO_SRC } from "../constants/appConstants";

// Uses the ERP logo (public/logo.PNG). Falls back to a monogram if the file is missing.
export default function Logo({ size = 44 }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="grid flex-none place-items-center rounded-full border-2 border-gold font-serif text-[15px] text-gold"
        style={{ width: size, height: size }}
      >
        MR
      </div>
    );
  }
  return (
    <img
      src={LOGO_SRC}
      alt={`${COMPANY.NAME} logo`}
      className="flex-none rounded-full border-2 border-gold/70 bg-[#02290b] object-cover shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}