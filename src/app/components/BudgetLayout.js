"use client";

import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import ConfirmBudgetModal from "@/app/components/ConfirmBudgetModal";

export default function BudgetLayout({ budgets }) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0); // For scrolling through months
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false); // Collapse/expand

  // Get current selected budget
  const currentDate = new Date();
  const currentMonth = budgets.find((b) => {
    const budgetDate = new Date(b.month);
    return (
      budgetDate.getMonth() === currentDate.getMonth() &&
      budgetDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const [selectedBudget, setSelectedBudget] = useState(
    currentMonth || budgets[0],
  );

  // Generate 6 months starting from monthOffset
  const generateMonths = () => {
    const months = [];
    const today = new Date();

    for (let i = 0; i < 6; i++) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() + monthOffset + i,
        1,
      );

      // Fix: Use local date formatting instead of toISOString to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const value = `${year}-${month}`; // YYYY-MM format

      const label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      const fullLabel = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      // Check if budget exists for this month
      const existingBudget = budgets.find((b) => b.month === `${value}-01`);

      months.push({ value, label, fullLabel, existingBudget });
      console.log("Pushed month:", { value, label, fullLabel });
    }
    return months;
  };

  const months = generateMonths();

  const handleMonthClick = (month) => {
    console.log("Button clicked, month object:", month);
    console.log("Current months array:", months);
    if (month.existingBudget) {
      // Budget exists, select it
      setSelectedBudget(month.existingBudget);
      setIsMonthSelectorOpen(false);
    } else {
      // No budget, show confirmation modal
      setSelectedMonth(month);
      setIsConfirmModalOpen(true);
    }
  };

  const scrollLeft = () => {
    setMonthOffset((prev) => prev - 6);
  };

  const scrollRight = () => {
    setMonthOffset((prev) => prev + 6);
  };

  // Get display name for header
  const displayName =
    selectedBudget?.name ||
    new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <>
      {/* Header with Month/Year */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsMonthSelectorOpen(!isMonthSelectorOpen)}
            className="flex items-center gap-2 group"
          >
            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
            <ChevronDownIcon
              className={`h-6 w-6 text-gray-400 transition-transform ${
                isMonthSelectorOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Collapsible Month Selector */}
        {isMonthSelectorOpen && (
          <div className="relative mb-6">
            <div className="flex items-center gap-2">
              {/* Left Arrow */}
              <button
                onClick={scrollLeft}
                className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
              </button>

              {/* Months */}
              <div className="flex gap-3 overflow-hidden">
                {months.map((month) => (
                  <button
                    key={month.value}
                    onClick={() => handleMonthClick(month)}
                    className={`flex-shrink-0 w-20 px-2 py-2 rounded-lg border-2 transition-all ${
                      selectedBudget?.month === `${month.value}-01`
                        ? "border-[#00bf63] bg-[#00bf63]/5 text-[#00bf63] font-semibold"
                        : month.existingBudget
                          ? "border-gray-200 bg-white hover:border-gray-300"
                          : "border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xs font-medium">
                        {month.label.split(" ")[0]}
                      </div>
                      <div className="text-xs text-gray-600">
                        {month.label.split(" ")[1]}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={scrollRight}
                className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Budget Content */}
      {selectedBudget ? (
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedBudget.name}
          </h2>
          <p className="text-sm text-gray-500">
            Budget content will go here (pay periods, expenses, etc.)
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="mx-auto size-12 text-gray-400"
          >
            <path
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No budget selected
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Click the month above to get started.
          </p>
        </div>
      )}

      <ConfirmBudgetModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        month={selectedMonth}
        onSuccess={(newBudget) => {
          setSelectedBudget(newBudget);
          setIsConfirmModalOpen(false);
        }}
      />
    </>
  );
}
