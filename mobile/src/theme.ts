export const colors = {
  background: "#0d0d0e",
  surface: "#1b1b1d",
  surfaceRaised: "#232325",
  border: "#424246",
  text: "#f6f6f6",
  muted: "#a8a8ad",
  primary: "#ef3f43",
  primaryDark: "#8a3939",
  income: "#55b867",
  incomeDark: "#355f3a",
  expense: "#ef5258",
  white: "#ffffff",
};

export function formatRupiah(value: number, signed = false) {
  const absolute = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
  const sign = signed ? (value >= 0 ? "+" : "-") : "";
  return `${sign}Rp ${absolute}`;
}

export function formatAmountInput(value: string) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(amount);
}
