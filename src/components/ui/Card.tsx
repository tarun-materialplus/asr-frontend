import React from "react";
import clsx from "clsx";

export default function Card({ children, className, noPadding = false }: { children: React.ReactNode; className?: string; noPadding?: boolean }) {
  return (
    <div
      className={clsx(
        "glass-panel rounded-xl overflow-hidden transition-all duration-300",
        !noPadding && "p-5",
        className
      )}
    >
      {children}
    </div>
  );
}