"use client";

import { useState } from "react";
import AddAccountModal from "@/app/components/AddAccountModal";
import EditAccountModal from "@/app/components/EditAccountModal";
import DeleteAccountModal from "@/app/components/DeleteAccountModal";

export default function AccountsList({ accounts }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate total balance
  const totalBalance = accounts.reduce(
    (sum, account) => sum + parseFloat(account.balance || 0),
    0,
  );

  const handleEditClick = (account) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (account) => {
    setSelectedAccount(account);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <p className="mt-2 text-sm text-gray-700">
              Manage your banking and cash accounts
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="block rounded-md bg-[#00bf63] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#33d98a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bf63]"
            >
              Add Account
            </button>
          </div>
        </div>

        {accounts.length === 0 ? (
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No accounts yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first account.
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
                Add Account
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {account.nickname}
                      </h3>
                      {account.account_type === "banking" && (
                        <p className="mt-1 text-sm text-gray-500">
                          {account.institution_name} • {account.account_subtype}
                        </p>
                      )}
                      {account.account_type === "cash" && (
                        <p className="mt-1 text-sm text-gray-500">
                          Cash Account
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        account.account_type === "banking"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {account.account_type === "banking" ? "Banking" : "Cash"}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(account.balance)}
                    </p>
                    <p className="text-sm text-gray-500">Current Balance</p>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleEditClick(account)}
                      className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(account)}
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <EditAccountModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAccount(null);
        }}
        account={selectedAccount}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAccount(null);
        }}
        account={selectedAccount}
      />
    </>
  );
}
