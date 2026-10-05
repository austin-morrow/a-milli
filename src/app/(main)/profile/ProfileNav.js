"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const secondaryNavigation = [
  { name: "Profile", href: "/profile" },
  { name: "Budgets", href: "/profile/budgets" },
];

export default function ProfileNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200">
      <nav className="flex overflow-x-auto py-4">
        <ul
          role="list"
          className="flex min-w-full flex-none gap-x-6 px-4 text-sm/6 font-semibold text-gray-500 sm:px-6 lg:px-8"
        >
          {secondaryNavigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={pathname === item.href ? "text-milli-green" : ""}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}