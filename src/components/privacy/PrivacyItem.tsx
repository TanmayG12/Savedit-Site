"use client";

export type PrivacyItemType = {
  id: string;
  title: string;
  content: string;
  section: string;
};

export type PrivacyItemProps = {
  item: PrivacyItemType;
  isOpen: boolean;
  onToggle: (id: string) => void;
};

export default function PrivacyItem({ item, isOpen, onToggle }: PrivacyItemProps) {
  const regionId = `privacy-panel-${item.id}`;
  const buttonId = `privacy-trigger-${item.id}`;

  return (
    <article id={`privacy-${item.id}`} className="border-b border-line/60 last:border-b-0 dark:border-line/40">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={regionId}
        id={buttonId}
        onClick={() => onToggle(item.id)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-medium transition-colors hover:text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:hover:text-emerald-400"
      >
        <span className="leading-tight">{item.title}</span>
        <span
          aria-hidden
          className={`flex h-8 w-8 items-center justify-center rounded-full border border-line/80 text-sm transition-transform duration-200 dark:border-line/50 ${
            isOpen ? "bg-emerald-500/10 text-emerald-500 rotate-45 dark:bg-emerald-400/10 dark:text-emerald-300" : "text-text-dim"
          }`}
        >
          +
        </span>
      </button>
      <div
        id={regionId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transform-gpu transition-all duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden pb-4 text-sm leading-relaxed text-text-dim dark:text-text-dark/80">
          <p>{item.content}</p>
        </div>
      </div>
    </article>
  );
}