"use client";

import { useState } from "react";
import AddExpenseModal from "@/app/components/AddExpenseModal";
import EditExpenseModal from "@/app/components/EditExpenseModal";
import DeleteExpenseModal from "@/app/components/DeleteExpenseModal";

export default function ExpensesList({ expenses }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  };

  // Format due date based on recurrence type
  const formatDueDate = (expense) => {
    if (expense.recurrence_type === "weekly") {
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return (
        expense.weekly_days?.map((day) => dayNames[day]).join(", ") || "N/A"
      );
    } else if (expense.recurrence_type === "monthly") {
      if (expense.day_of_month === -1) {
        return "Last day of month";
      }
      const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };
      return getOrdinal(expense.day_of_month);
    } else if (expense.recurrence_type === "yearly") {
      return new Date(expense.yearly_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    return "N/A";
  };

  // Calculate totals from expenses
  const calculateTotals = () => {
    const totalAmount = expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0,
    );

    // Group by category and calculate totals
    const categoryTotals = expenses.reduce((acc, expense) => {
      const categoryName = expense.categories?.name || "Uncategorized";
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += parseFloat(expense.amount);
      return acc;
    }, {});

    // Get top 2 categories by amount
    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);

    return {
      total: totalAmount,
      topCategories: sortedCategories,
    };
  };

  const { total, topCategories } = calculateTotals();

  const totals = [
    {
      name: "Total Monthly Expenses",
      stat: formatCurrency(total),
    },
    {
      name: topCategories[0]?.[0] || "No Categories",
      stat: topCategories[0] ? formatCurrency(topCategories[0][1]) : "$0.00",
    },
    {
      name: topCategories[1]?.[0] || "Other",
      stat: topCategories[1] ? formatCurrency(topCategories[1][1]) : "$0.00",
    },
  ];
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">Expenses</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all your recurring expenses including amount, due date,
              and frequency.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="block rounded-md bg-[#00bf63] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#33d98a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bf63]"
            >
              Add Expense
            </button>
          </div>
        </div>

        <div>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {totals.map((item) => (
              <div
                key={item.name}
                className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
              >
                <dt className="truncate text-sm font-medium text-gray-500">
                  {item.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {item.stat}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {expenses.length === 0 ? (
          <div className="mt-8 text-center bg-white shadow rounded-lg p-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No expenses yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first expense.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-md bg-[#00bf63] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#33d98a]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Expense
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow outline outline-1 outline-black/5 sm:rounded-lg">
                  <table className="relative min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Due Date
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Frequency
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Category
                        </th>
                        <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {expenses.map((expense) => (
                        <tr key={expense.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {expense.description}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatCurrency(expense.amount)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatDueDate(expense)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold text-green-800">
                              {expense.recurrence_type.charAt(0).toUpperCase() +
                                expense.recurrence_type.slice(1)}
                            </span>
                          </td>
                         <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
  {expense.categories ? (
    <span
      className="inline-flex rounded-full px-2 text-xs font-semibold"
      style={{
        backgroundColor: `${expense.categories.color}20`,
        color: expense.categories.color,
      }}
    >
      {expense.categories.name}
    </span>
  ) : (
    <span className="text-gray-400 text-xs">
      Uncategorized
    </span>
  )}
</td>

                          <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => handleEditClick(expense)}
                              className="text-[#00bf63] hover:text-[#33d98a] mr-4"
                            >
                              Edit
                              <span className="sr-only">
                                , {expense.description}
                              </span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(expense)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                              <span className="sr-only">
                                , {expense.description}
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <EditExpenseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
      />

      <DeleteExpenseModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
      />
    </>
  );
}
