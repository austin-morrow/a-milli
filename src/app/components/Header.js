"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  TrophyIcon,
  ArrowTrendingDownIcon,
  Cog6ToothIcon,
  BanknotesIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import {
  BuildingLibraryIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Squares2X2Icon },
  { name: "Spending", href: "/spending", icon: BanknotesIcon },
  { name: "Accounts", href: "/accounts", icon: BuildingLibraryIcon },
  { name: "Debt Tracker", href: "/debt", icon: ArrowTrendingDownIcon },
  { name: "Goals", href: "/goals", icon: TrophyIcon },
];
const budgets = [
  { id: 1, name: "Morrow Manor", href: "#", initial: "MM", current: false },
];
const userNavigation = [{ name: "Your profile", href: "/profile" }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header({ children, displayName, avatarUrl }) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>

              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className="relative flex h-16 shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src="/millisecondary.svg"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="relative flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={classNames(
                                pathname.startsWith(item.href)
                                  ? "bg-gray-50 text-milli-green"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-milli-green",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  pathname.startsWith(item.href)
                                    ? "text-milli-green"
                                    : "text-gray-400 group-hover:text-milli-green",
                                  "size-6 shrink-0",
                                )}
                              />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="text-xs/6 font-semibold text-gray-400">
                        Your budgets
                      </div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {budgets.map((budget) => (
                          <li key={budget.name}>
                            <a
                              href={budget.href}
                              className={classNames(
                                budget.current
                                  ? "bg-gray-50 text-milli-green"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-milli-green",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                              )}
                            >
                              <span
                                className={classNames(
                                  budget.current
                                    ? "border-milli-green text-milli-green"
                                    : "border-gray-200 text-gray-400 group-hover:border-milli-green group-hover:text-milli-green",
                                  "flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium",
                                )}
                              >
                                {budget.initial}
                              </span>
                              <span className="truncate">{budget.name}</span>
                              <span>(Current)</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <a
                        href="#"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-milli-green"
                      >
                        <Cog6ToothIcon
                          aria-hidden="true"
                          className="size-6 shrink-0 text-gray-400 group-hover:text-milli-green"
                        />
                        Settings
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden bg-gray-900 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img alt="Your Company" src="/milli.svg" className="h-8 w-auto" />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            pathname.startsWith(item.href)
                              ? "bg-gray-50 text-milli-green"
                              : "text-gray-700 hover:bg-gray-50 hover:text-milli-green",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              pathname.startsWith(item.href)
                                ? "text-milli-green"
                                : "text-gray-400 group-hover:text-milli-green",
                              "size-6 shrink-0",
                            )}
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs/6 font-semibold text-gray-400">
                    Your budgets
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {budgets.map((budget) => (
                      <li key={budget.name}>
                        <a
                          href={budget.href}
                          className={classNames(
                            budget.current
                              ? "bg-gray-50 text-milli-green"
                              : "text-gray-700 hover:bg-gray-50 hover:text-milli-green",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                          )}
                        >
                          <span
                            className={classNames(
                              budget.current
                                ? "border-milli-green text-milli-green"
                                : "border-gray-200 text-gray-400 group-hover:border-milli-green group-hover:text-milli-green",
                              "flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium",
                            )}
                          >
                            {budget.initial}
                          </span>
                          <span className="truncate">{budget.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <a
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-milli-green"
                  >
                    <Cog6ToothIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-milli-green"
                    />
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            {/* Separator */}
            <div
              aria-hidden="true"
              className="h-6 w-px bg-gray-200 lg:hidden"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="ml-auto flex items-center gap-x-4 lg:gap-x-6">
                {/* Separator */}
                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="relative flex items-center">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    {avatarUrl ? (
                      <img
                        alt=""
                        src={avatarUrl}
                        className="size-8 rounded-full bg-gray-50 object-cover outline -outline-offset-1 outline-black/5"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500 outline -outline-offset-1 outline-black/5"
                      >
                        {displayName?.[0]?.toUpperCase()}
                      </span>
                    )}
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm/6 font-semibold text-gray-900"
                      >
                        {displayName}
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 size-5 text-gray-400"
                      />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg outline-1 outline-gray-900/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <MenuItem>
                      <Link
                        href="/profile"
                        className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                      >
                        Your profile
                      </Link>
                    </MenuItem>

                    <form action={signOut}>
                      <MenuItem>
                        <button
                          type="submit"
                          className="block w-full px-3 py-1 text-left text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                        >
                          Sign out
                        </button>
                      </MenuItem>
                    </form>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <div className="lg:pl-72">
            <div className="sticky top-0 z-40 flex h-4 ...">
              {/* top bar */}
            </div>
          </div>
          <main>
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
