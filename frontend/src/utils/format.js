// Amounts throughout this app are stored as whole-rupee integers (no paise)
// to keep the math simple and avoid floating point rounding issues.
export function formatRupees(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

const AVATAR_PALETTE = ["#00B37E", "#E8543E", "#E8A93E", "#4B6BFB", "#9B59F6", "#1D9BF0"];
export function avatarColor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}
