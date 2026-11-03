// Mobile number field with the +92 prefix, as in the reference checkout.
export default function PhoneInput({ id, name, value, onChange, required, placeholder = "3XX XXXXXXX" }) {
  return (
    <div className="flex items-center rounded-xl border-[1.5px] border-line bg-white transition focus-within:border-yellow focus-within:shadow-[0_0_0_3px_rgba(255,194,14,.25)]">
      <span className="flex items-center gap-1.5 border-r border-line px-3 py-3 text-sm font-semibold text-muted">
        <span aria-hidden="true">🇵🇰</span>+92
      </span>
      <input
        id={id}
        name={name}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d ]/g, "").slice(0, 13))}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent px-3 py-3 outline-none placeholder:text-[#a99a90]"
      />
    </div>
  );
}

// "03001234567" -> "300 1234567" for display after +92
export const toLocalDisplay = (p = "") => {
  const d = String(p).replace(/\D/g, "").replace(/^92/, "").replace(/^0/, "");
  return d ? `${d.slice(0, 3)} ${d.slice(3)}`.trim() : "";
};
export const fromLocalDisplay = (v = "") => {
  const d = v.replace(/\D/g, "").replace(/^0/, "");
  return d ? "0" + d : "";
};
