"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  HomeIcon,
  XMarkIcon,
  CalculatorIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  {
    name: "Budget",
    href: "/budget/",
    icon: CalculatorIcon,
    children: [
      { name: "Overview", href: "/budget/overview" },
      { name: "Income", href: "/budget/income" },

      { name: "Bills", href: "/budget/bills" },

      { name: "Transactions", href: "/budget/transactions" },
    ],
  },
  { name: "Goals", href: "/goals", icon: TrophyIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-white transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-black"
                    />
                  </button>
                </div>
              </TransitionChild>

              <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 ring ring-white/10 before:pointer-events-none before:absolute before:inset-0 before:bg-black/10">
                <div className="relative flex h-16 shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src="/milli.svg"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="relative flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            {!item.children ? (
                              <Link
                                href={item.href}
                                className={classNames(
                                  pathname === item.href
                                    ? "bg-white/5 text-black"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                                )}
                              >
                                <item.icon
                                  aria-hidden="true"
                                  className={classNames(
                                    pathname === item.href
                                      ? "text-black"
                                      : "text-gray-400 group-hover:text-white",
                                    "size-6 shrink-0",
                                  )}
                                />
                                {item.name}
                              </Link>
                            ) : (
                              <div>
                                <button
                                  onClick={() => setBudgetOpen(!budgetOpen)}
                                  className={classNames(
                                    pathname.startsWith(item.href)
                                      ? "bg-white/5 text-black"
                                      : "text-gray-400 hover:bg-white/5 hover:text-white",
                                    "group flex w-full items-center gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                                  )}
                                >
                                  <item.icon
                                    aria-hidden="true"
                                    className={classNames(
                                      pathname.startsWith(item.href)
                                        ? "text-black"
                                        : "text-gray-400 group-hover:text-white",
                                      "size-6 shrink-0",
                                    )}
                                  />
                                  {item.name}
                                  {budgetOpen ? (
                                    <ChevronDownIcon className="ml-auto size-5 shrink-0" />
                                  ) : (
                                    <ChevronRightIcon className="ml-auto size-5 shrink-0" />
                                  )}
                                </button>
                                {budgetOpen && (
                                  <ul className="mt-1 px-2">
                                    {item.children.map((subItem) => (
                                      <li key={subItem.name}>
                                        <Link
                                          href={subItem.href}
                                          className={classNames(
                                            pathname === subItem.href
                                              ? "bg-white/5 text-black"
                                              : "text-gray-400 hover:bg-white/5 hover:text-white",
                                            "group flex gap-x-3 rounded-md p-2 pl-9 text-sm/6 font-semibold",
                                          )}
                                        >
                                          {subItem.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <div className="hidden bg-white lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-white/10 bg-black/10 px-6">
            <div className="flex h-16 shrink-0 items-center">
              <img alt="Your Company" src="/milli.svg" className="h-8 w-auto" />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        {!item.children ? (
                          <Link
                            href={item.href}
                            className={classNames(
                              pathname === item.href
                                ? "bg-white/5 text-black"
                                : "text-gray-400 hover:bg-white/5 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className={classNames(
                                pathname === item.href
                                  ? "text-black"
                                  : "text-gray-400 group-hover:text-white",
                                "size-6 shrink-0",
                              )}
                            />
                            {item.name}
                          </Link>
                        ) : (
                          <div>
                            <button
                              onClick={() => setBudgetOpen(!budgetOpen)}
                              className={classNames(
                                pathname.startsWith(item.href)
                                  ? "bg-white/5 text-black"
                                  : "text-gray-400 hover:bg-white/5 hover:text-white",
                                "group flex w-full items-center gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  pathname.startsWith(item.href)
                                    ? "text-black"
                                    : "text-gray-400 group-hover:text-white",
                                  "size-6 shrink-0",
                                )}
                              />
                              {item.name}
                              {budgetOpen ? (
                                <ChevronDownIcon className="ml-auto size-5 shrink-0" />
                              ) : (
                                <ChevronRightIcon className="ml-auto size-5 shrink-0" />
                              )}
                            </button>
                            {budgetOpen && (
                              <ul className="mt-1 px-2">
                                {item.children.map((subItem) => (
                                  <li key={subItem.name}>
                                    <Link
                                      href={subItem.href}
                                      className={classNames(
                                        pathname === subItem.href
                                          ? "bg-white/5 text-black"
                                          : "text-gray-400 hover:bg-white/5 hover:text-white",
                                        "group flex gap-x-3 rounded-md p-2 pl-9 text-sm/6 font-semibold",
                                      )}
                                    >
                                      {subItem.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <a
                    href="#"
                    className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-white/5"
                  >
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-8 rounded-full bg-gray-800 outline outline-1 -outline-offset-1 outline-white/10"
                    />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">Tom Cook</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 after:pointer-events-none after:absolute after:inset-0 after:border-b after:border-white/10 after:bg-black/10 sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-400 hover:text-white lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
          <div className="flex-1 text-sm/6 font-semibold text-white">
            Dashboard
          </div>
          <a href="#">
            <span className="sr-only">Your profile</span>
            <img
              alt=""
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="size-8 rounded-full bg-gray-800 outline outline-1 -outline-offset-1 outline-white/10"
            />
          </a>
        </div>

        <main className="py-4 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
}
