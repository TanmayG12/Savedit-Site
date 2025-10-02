interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  kicker?: string;
}

export function SectionTitle({ eyebrow, title, kicker }: SectionTitleProps) {
  return (
    <div className="mb-8">
      {eyebrow ? (
        <div className="mb-2 text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">{eyebrow}</div>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">{title}</h2>
      {kicker ? (
        <p className="mt-3 max-w-3xl text-neutral-600 dark:text-neutral-400">{kicker}</p>
      ) : null}
    </div>
  );
}