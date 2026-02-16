"use client";

import { createWorkspace } from "@/app/actions/workspace";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      } else {
        setCheckingAuth(false);
      }
    }

    checkUser();
  }, [router, supabase]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createWorkspace(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          alt="Your Company"
          src="/milli.svg"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Set up your workspace
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Give your workspace a name to get started
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="workspace-name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Workspace name
              </label>
              <div className="mt-2">
                <input
                  id="workspace-name"
                  name="workspaceName"
                  type="text"
                  required
                  placeholder="My Family Budget"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#00bf63] sm:text-sm/6"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                You can change this later in settings
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-[#00bf63] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#33d98a] focus-visible:outline focus:visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00bf63] disabled:opacity-50"
              >
                {loading ? "Creating workspace..." : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
