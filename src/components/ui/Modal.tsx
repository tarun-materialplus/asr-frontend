import React from "react";

export default function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white dark:bg-[#071826] border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-300">Close</button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
