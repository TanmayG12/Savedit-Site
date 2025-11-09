import Link from "next/link";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
}

export function CTAButton({ href, children }: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors min-w-[120px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  return (
    <Link
      className={`${base} bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200`}
      href={href}
    >
      {children}
    </Link>
  );
}