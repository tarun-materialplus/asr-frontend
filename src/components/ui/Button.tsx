import React from "react";
import clsx from "clsx";

export default function Button({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition",
        "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
