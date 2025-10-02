interface PillProps {
  children: React.ReactNode;
}

export function Pill({ children }: PillProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-600 shadow-sm dark:border-neutral-800 dark:text-neutral-300">
      {children}
    </span>
  );
}