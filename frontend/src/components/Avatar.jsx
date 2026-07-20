import { initials, avatarColor } from "../utils/format";

export default function Avatar({ name, id, size = 32 }) {
  return (
    <div
      className="flex items-center justify-center rounded-full font-display font-semibold text-white shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: avatarColor(id || name),
        fontSize: size * 0.38,
      }}
      title={name}
    >
      {initials(name)}
    </div>
  );
}
