// src/components/ExpandedWidgetModal.jsx
import React from "react";

export default function ExpandedWidgetModal({ title, content, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">{title}</h2>
        <div className="text-sm text-zinc-700 dark:text-zinc-300">{content}</div>
      </div>
    </div>
  );
}
