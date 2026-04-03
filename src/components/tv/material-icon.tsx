interface Props {
  name: string;
  className?: string;
  filled?: boolean;
}

export function MaterialIcon({ name, className = "", filled = false }: Props) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}
