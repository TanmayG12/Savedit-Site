interface CardProps {
  title?: string;
  desc?: string;
  children?: React.ReactNode;
}

export function Card({ title, desc, children }: CardProps) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white/70 p-5 shadow-[0_2px_30px_rgba(0,0,0,0.05)] backdrop-blur dark:border-neutral-800 dark:bg-black/30">
      {title ? <div className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">{title}</div> : null}
      {desc ? <div className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">{desc}</div> : null}
      {children}
    </div>
  );
}