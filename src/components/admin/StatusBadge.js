export default function StatusBadge({ status }) {
  const value = String(status || "Unknown");
  const key = value.toLowerCase();

  const className = ["pending", "ongoing", "completed", "delivered"].includes(key)
    ? key
    : "default";

  return <span className={`status ${className}`}>{value}</span>;
}
