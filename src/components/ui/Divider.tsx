interface DividerProps {
  subtle?: boolean;
}

export function Divider({ subtle }: DividerProps) {
  return (
    <div className={subtle ? "h-12 sm:h-14" : "h-16 sm:h-20 lg:h-24"}>
      {/* spacer; opt into subtle/normal rhythm */}
    </div>
  );
}