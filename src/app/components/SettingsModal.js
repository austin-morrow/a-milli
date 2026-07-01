"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function SettingsModal({ isOpen, onClose, budgetId }) {
  const [startingAmount, setStartingAmount] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    // TODO: wire up save logic (API call / server action) once ready
    console.log("Saving settings for budget:", budgetId, {
      startingAmount,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Budget Settings
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Starting Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={startingAmount}
                onChange={(e) => setStartingAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm focus:border-[#00bf63] focus:outline-none focus:ring-1 focus:ring-[#00bf63]"
              />
            </div>
          </div>

          {/* More settings fields go here later */}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-[#00bf63] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#33d98a]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}