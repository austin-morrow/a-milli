"use client";

import { updateExpense } from "@/app/actions/expenses";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function EditExpenseModal({ isOpen, onClose, expense }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState("monthly");
  const [selectedDays, setSelectedDays] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const daysOfWeek = [
    { value: 0, label: "Sun" },
    { value: 1, label: "Mon" },
    { value: 2, label: "Tue" },
    { value: 3, label: "Wed" },
    { value: 4, label: "Thu" },
    { value: 5, label: "Fri" },
    { value: 6, label: "Sat" },
  ];

  // Initialize form with expense data when modal opens
  useEffect(() => {
    if (expense) {
      setRecurrenceType(expense.recurrence_type || "monthly");
      setSelectedDays(expense.weekly_days || []);
      setSelectedCategory(expense.category_id || "");
    }
  }, [expense]);

  // Fetch categories when modal opens
  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient();
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (data) {
        setCategories(data);
      }
    }

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Add recurrence type and selected days
    formData.set("recurrenceType", recurrenceType);
    if (recurrenceType === "weekly") {
      formData.set("weeklyDays", JSON.stringify(selectedDays));
    }

    const result = await updateExpense(expense.id, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Success - close modal
      setLoading(false);
      onClose();
    }
  }

  if (!isOpen || !expense) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Expense</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-900"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                required
                defaultValue={expense.description}
                placeholder="e.g., Electric Expense"
                className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63]"
              />
            </div>

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-900"
              >
                Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={expense.amount}
                  placeholder="0.00"
                  className="block w-full rounded-md bg-white pl-7 pr-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-900"
              >
                Category
              </label>
              <select
                id="category"
                name="categoryId"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63]"
              >
                <option value="">None</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="recurrenceType"
                className="block text-sm font-medium text-gray-900"
              >
                Frequency
              </label>
              <select
                id="recurrenceType"
                value={recurrenceType}
                onChange={(e) => setRecurrenceType(e.target.value)}
                className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63]"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {/* Weekly Options */}
            {recurrenceType === "weekly" && (
              <div className="pl-6 space-y-4 border-l-2 border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Days of the week
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          selectedDays.includes(day.value)
                            ? "bg-[#00bf63] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Monthly Options */}
            {recurrenceType === "monthly" && (
              <div className="pl-6 space-y-4 border-l-2 border-gray-200">
                <div>
                  <label
                    htmlFor="dayOfMonth"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Day of Month
                  </label>
                  <select
                    id="dayOfMonth"
                    name="dayOfMonth"
                    required
                    defaultValue={
                      expense.day_of_month === -1
                        ? "last"
                        : expense.day_of_month
                    }
                    className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63]"
                  >
                    <option value="">Select day...</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                    <option value="last">Last day of month</option>
                  </select>
                </div>
              </div>
            )}

            {/* Yearly Options */}
            {recurrenceType === "yearly" && (
              <div className="pl-6 space-y-4 border-l-2 border-gray-200">
                <div>
                  <label
                    htmlFor="yearlyDate"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Date (Month & Day)
                  </label>
                  <input
                    type="date"
                    id="yearlyDate"
                    name="yearlyDate"
                    required
                    defaultValue={expense.yearly_date}
                    className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63]"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-[#00bf63] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#33d98a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bf63] disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
