import { clsx as cn } from "clsx";

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export function Container({ className = "", children }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}