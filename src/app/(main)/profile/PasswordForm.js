"use client";

import { useState } from "react";
import { changePassword } from "@/app/actions/profile";

const inputClass =
  "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-milli-green sm:text-sm/6";
const labelClass = "block text-sm/6 font-medium text-gray-900";

export default function PasswordForm() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setSaving(true);
    setError(null);
    setSaved(false);

    const formData = new FormData(form);
    if (formData.get("new_password") !== formData.get("confirm_password")) {
      setError("New passwords do not match.");
      setSaving(false);
      return;
    }

    const result = await changePassword(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setSaved(true);
      form.reset();
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="md:col-span-2">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-full">
          <label htmlFor="current-password" className={labelClass}>
            Current password
          </label>
          <div className="mt-2">
            <input
              id="current-password"
              name="current_password"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="new-password" className={labelClass}>
            New password
          </label>
          <div className="mt-2">
            <input
              id="new-password"
              name="new_password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="confirm-password" className={labelClass}>
            Confirm password
          </label>
          <div className="mt-2">
            <input
              id="confirm-password"
              name="confirm_password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {error && (
        <div role="alert" className="mt-6 rounded-md bg-red-50 p-4 sm:max-w-xl">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      {saved && (
        <div role="status" className="mt-6 rounded-md bg-green-50 p-4 sm:max-w-xl">
          <p className="text-sm text-green-800">Password updated.</p>
        </div>
      )}

      <div className="mt-8 flex">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-milli-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-milli-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-milli-green disabled:opacity-60"
        >
          {saving ? "Updating..." : "Update password"}
        </button>
      </div>
    </form>
  );
}