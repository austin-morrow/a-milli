"use client";

import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CalendarIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";
import ConfirmBudgetModal from "@/app/components/ConfirmBudgetModal";
import BudgetCalendarView from "@/app/components/BudgetCalendarView";
import AddPayPeriodModal from "@/app/components/AddPayPeriodModal";

export default function BudgetLayout({
  budgets,
  selectedBudget,
  setSelectedBudget,
  expenses,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const [isAddPayPeriodModalOpen, setIsAddPayPeriodModalOpen] = useState(false);

  // Determine current view
  const isCalendarView = pathname.includes("/calendar");

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

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const value = `${year}-${month}`;

      const label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      const fullLabel = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      const existingBudget = budgets.find((b) => b.month === `${value}-01`);

      months.push({ value, label, fullLabel, existingBudget });
    }
    return months;
  };

  const months = generateMonths();

  const handleMonthClick = (month) => {
    if (month.existingBudget) {
      setSelectedBudget(month.existingBudget);
      setIsMonthSelectorOpen(false);
    } else {
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

  const displayName =
    selectedBudget?.name ||
    new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const stats = [
    { name: "Total Subscribers", stat: "71,897" },
    { name: "Avg. Open Rate", stat: "58.16%" },
    { name: "Avg. Click Rate", stat: "24.57%" },
  ];

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        {/* Header with Month/Year and View Toggle */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setIsMonthSelectorOpen(!isMonthSelectorOpen)}
              className="flex items-center gap-2 group"
            >
              <h1 className="text-2xl font-bold text-gray-900">
                {displayName}
              </h1>
              <ChevronDownIcon
                className={`h-6 w-6 text-gray-400 transition-transform ${
                  isMonthSelectorOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/spending/budget")}
                className={`p-2 rounded-lg transition-colors ${
                  !isCalendarView
                    ? "bg-[#00bf63] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="List View"
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => router.push("/spending/budget/calendar")}
                className={`p-2 rounded-lg transition-colors ${
                  isCalendarView
                    ? "bg-[#00bf63] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Calendar View"
              >
                <CalendarIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Collapsible Month Selector */}
          {isMonthSelectorOpen && (
            <div className="relative mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={scrollLeft}
                  className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                </button>

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
          isCalendarView ? (
            <BudgetCalendarView
              selectedBudget={selectedBudget}
              expenses={expenses}
            />
          ) : (
            <div className="mx-auto max-w-2xl lg:max-w-7xl">
              <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                {/* Column 1 - Upcoming Bills (tall, row-span-2) */}
                <div className="relative lg:row-span-2">
                  <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl" />
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                    <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                      <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                        Upcoming Bills
                      </p>
                      <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                        Bills due before your next payday
                      </p>
                    </div>

                    {selectedBudget?.budget_pay_periods?.length > 0 ? (
                      <div className="@container relative w-full grow">
                        <div className="p-6">
                          {(() => {
                            // Find the current or next upcoming pay period
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            const currentPeriod =
                              selectedBudget.budget_pay_periods.find(
                                (period) => {
                                  const start = new Date(period.start_date);
                                  const end = new Date(period.end_date);
                                  start.setHours(0, 0, 0, 0);
                                  end.setHours(0, 0, 0, 0);
                                  return today >= start && today <= end;
                                },
                              );

                            // If no current period, find the next upcoming one
                          const upcomingPeriod = selectedBudget.budget_pay_periods[0];

                            if (!upcomingPeriod) {
                              return (
                                <div className="text-center py-8">
                                  <p className="text-sm text-gray-500">
                                    No upcoming pay periods
                                  </p>
                                </div>
                              );
                            }

                            // Get bills due in this period
                            const periodStart = new Date(
                              upcomingPeriod.start_date,
                            );
                            const periodEnd = new Date(upcomingPeriod.end_date);

                            const upcomingBills = expenses
                              .filter((exp) => {
                                if (exp.categories?.name !== "Bills")
                                  return false;
                                if (!exp.day_of_month) return false;

                                // Check if bill's day falls anywhere within the period
                                // It could fall in the start month or the end month
                                const billDateInStartMonth = new Date(
                                  periodStart.getFullYear(),
                                  periodStart.getMonth(),
                                  exp.day_of_month,
                                );
                                const billDateInEndMonth = new Date(
                                  periodEnd.getFullYear(),
                                  periodEnd.getMonth(),
                                  exp.day_of_month,
                                );

                                return (
                                  (billDateInStartMonth >= periodStart &&
                                    billDateInStartMonth <= periodEnd) ||
                                  (billDateInEndMonth >= periodStart &&
                                    billDateInEndMonth <= periodEnd)
                                );
                              })
                              .sort((a, b) => a.day_of_month - b.day_of_month);

                            const formatDate = (dateString) => {
                              const [year, month, day] = dateString
                                .split("-")
                                .map(Number);
                              const date = new Date(year, month - 1, day);
                              return date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              });
                            };

                            const formatCurrency = (amount) => {
                              return new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(amount);
                            };

                            return (
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-sm font-semibold text-gray-900">
                                    {currentPeriod
                                      ? "Current Period"
                                      : "Next Period"}
                                  </h3>
                                  <p className="text-xs text-gray-500">
                                    {formatDate(upcomingPeriod.start_date)} -{" "}
                                    {formatDate(upcomingPeriod.end_date)}
                                  </p>
                                </div>

                                {upcomingBills.length > 0 ? (
                                  <div className="space-y-2">
                                    {upcomingBills.map((bill) => (
                                      <div
                                        key={bill.id}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                      >
                                        <p className="text-sm font-medium text-gray-900 truncate flex-1">
                                          {bill.description}
                                        </p>
                                        {bill.day_of_month && (
                                          <span className="text-xs text-gray-500 flex-shrink-0">
                                            Due {bill.day_of_month}th
                                          </span>
                                        )}
                                        <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                                          {formatCurrency(bill.amount)}
                                        </p>
                                      </div>
                                    ))}

                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-900">
                                          Total
                                        </p>
                                        <p className="text-sm font-bold text-[#00bf63]">
                                          {formatCurrency(
                                            upcomingBills.reduce(
                                              (sum, bill) =>
                                                sum + parseFloat(bill.amount),
                                              0,
                                            ),
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 text-center py-8">
                                    No bills due in this period
                                  </p>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center flex-1 p-8">
                        <svg
                          className="h-12 w-12 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                          No pay periods yet
                        </h3>
                        <p className="text-xs text-gray-500 mb-4 text-center">
                          Add pay periods to see upcoming bills
                        </p>
                        <button
                          onClick={() => {
                            setIsAddPayPeriodModalOpen(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-md bg-[#00bf63] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#33d98a]"
                        >
                          <svg
                            className="h-4 w-4"
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
                          Add Pay Period
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-l-4xl" />
                </div>

                {/* Column 2, Row 1 - Left to Spend */}
                <div className="relative max-lg:row-start-1">
                  <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-4xl" />
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                    <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                      <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                        Left to Spend
                      </p>
                      <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit
                        maiores impedit.
                      </p>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                      <img
                        alt=""
                        src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png"
                        className="w-full max-lg:max-w-xs"
                      />
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl" />
                </div>

                {/* Column 3, Row 1 - Left to Spend (duplicate) */}
                <div className="relative max-lg:row-start-1">
                  <div className="absolute inset-px rounded-lg bg-white lg:rounded-tr-4xl" />
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                    <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                      <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                        Weekly Expenses
                      </p>
                      <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit
                        maiores impedit.
                      </p>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                      <img
                        alt=""
                        src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png"
                        className="w-full max-lg:max-w-xs"
                      />
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-tr-4xl" />
                </div>

                {/* Column 2, Row 2 - Current Account Totals */}
                <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                  <div className="absolute inset-px rounded-lg bg-white" />
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                    <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                      <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                        Current Account Totals
                      </p>
                      <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                        Morbi viverra dui mi arcu sed. Tellus semper adipiscing
                        suspendisse semper morbi.
                      </p>
                    </div>
                    <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                      <img
                        alt=""
                        src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png"
                        className="h-[min(152px,40cqw)] object-cover"
                      />
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
                </div>

                {/* Column 3, Row 2 - Current Account Totals (duplicate) */}
                <div className="relative lg:col-start-3 lg:row-start-2">
                  <div className="absolute inset-px rounded-lg bg-white lg:rounded-br-4xl" />
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-r-[calc(2rem+1px)]">
                    <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                      <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                        Variable Expenses
                      </p>
                      <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                        Morbi viverra dui mi arcu sed. Tellus semper adipiscing
                        suspendisse semper morbi.
                      </p>
                    </div>
                    <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                      <img
                        alt=""
                        src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png"
                        className="h-[min(152px,40cqw)] object-cover"
                      />
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-br-4xl" />
                </div>
              </div>
            </div>
          )
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
      </div>

      <AddPayPeriodModal
        isOpen={isAddPayPeriodModalOpen}
        onClose={() => setIsAddPayPeriodModalOpen(false)}
        budgetId={selectedBudget?.id}
      />
    </>
  );
}
