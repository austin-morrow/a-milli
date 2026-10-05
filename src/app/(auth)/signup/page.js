"use client";

import { signUp } from "@/app/actions/auth";
import { useState } from "react";
import Link from "next/link";

const inputClass =
  "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63] sm:text-sm/6";
const labelClass = "block text-sm/6 font-medium text-gray-900";

export default function SignUp() {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);

    if (formData.get("password") !== formData.get("confirmPassword")) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await signUp(formData);

    // On success with no email confirmation, the action redirects
    if (result?.error) setError(result.error);
    if (result?.message) setMessage(result.message);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img alt="A Milli" src="/milli.svg" className="mx-auto h-10 w-auto" />
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Create an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="first-name" className={labelClass}>
                  First name
                </label>
                <div className="mt-2">
                  <input
                    id="first-name"
                    name="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="w-1/2">
                <label htmlFor="last-name" className={labelClass}>
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    id="last-name"
                    name="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className={labelClass}>
                Confirm password
              </label>
              <div className="mt-2">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>
            </div>

            {error && (
              <div role="alert" className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            {message && (
              <div role="status" className="rounded-md bg-green-50 p-4">
                <p className="text-sm text-green-800">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-[#00bf63] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#33d98a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bf63] disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>
        </div>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#00bf63] hover:text-[#33d98a]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}