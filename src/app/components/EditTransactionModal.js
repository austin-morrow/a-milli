"use client";

import { updateTransaction } from "@/app/actions/transactions";
import { useState, useEffect } from "react";

export default function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
  accounts,
  categories,
  expenses,
}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (transaction) {
      setSelectedCategory(transaction.category_id || "");
    }
  }, [transaction]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateTransaction(transaction.id, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      onClose();
    }
  }

  if (!isOpen || !transaction) return null;

  // Filter expenses based on selected category
  const selectedCategoryData = categories.find(
    (c) => c.id === selectedCategory,
  );
  const isVariableExpenses = selectedCategoryData?.name === "Variable Expenses";
  const filteredExpenses = expenses.filter(
    (s) => s.category_id === selectedCategory,
  );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Edit Transaction
            </h2>
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
                htmlFor="transactionType"
                className="block text-sm font-medium text-gray-900"
              >
                Type
              </label>
              <select
                id="transactionType"
                name="transactionType"
                required
                defaultValue={transaction.transaction_type}
                className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63]"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-900"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                defaultValue={transaction.date}
                className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63]"
              />
            </div>

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
                defaultValue={transaction.description}
                placeholder="e.g., Grocery shopping"
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
                  defaultValue={transaction.amount}
                  placeholder="0.00"
                  className="block w-full rounded-md bg-white pl-7 pr-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="accountId"
                className="block text-sm font-medium text-gray-900"
              >
                Account
              </label>
              <select
                id="accountId"
                name="accountId"
                required
                defaultValue={transaction.account_id}
                className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63]"
              >
                <option value="">Select account...</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.nickname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="expenseId"
                className="block text-sm font-medium text-gray-900"
              >
                Expense (Optional)
              </label>
              <select
                id="expenseId"
                name="expenseId"
                defaultValue={transaction.expense_id || ""}
                className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63]"
              >
                <option value="">None</option>
                {expenses.map((expense) => (
                  <option key={expense.id} value={expense.id}>
                    {expense.description}
                  </option>
                ))}
              </select>
            </div>

            {isVariableExpenses && filteredExpenses.length > 0 && (
              <div>
                <label
                  htmlFor="subcategoryId"
                  className="block text-sm font-medium text-gray-900"
                >
                  Subcategory
                </label>
                <select
                  id="subcategoryId"
                  name="subcategoryId"
                  defaultValue={transaction.subcategory_id || ""}
                  className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63]"
                >
                  <option value="">None</option>
                  {filteredExpenses.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
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
              className="flex-1 rounded-md bg-[#00bf63] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#33d98a] disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
