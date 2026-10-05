import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";

export const metadata = { title: "Account settings · A Milli" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, timezone, avatar_url")
    .eq("id", user.id)
    .single();

  // Built on the server so the list matches between server and browser renders
  const US_TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time" },
  { value: "America/Chicago", label: "Central Time" },
  { value: "America/Denver", label: "Mountain Time" },
  { value: "America/Los_Angeles", label: "Pacific Time" },
];
  const currentTz = profile?.timezone ?? "UTC";

// Keep a user's existing timezone selectable even if it isn't one of the four
const timezones = US_TIMEZONES.some((tz) => tz.value === currentTz)
  ? US_TIMEZONES
  : [
      ...US_TIMEZONES,
      { value: currentTz, label: currentTz.replaceAll("_", " ") },
    ];

  return (
    <main>
      <h1 className="sr-only">Account Settings</h1>

      <div className="divide-y divide-gray-200">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm/6 text-gray-500">
              Your name and picture are shown to people you share budgets with.
            </p>
          </div>
          <ProfileForm
            userId={user.id}
            email={user.email}
            profile={{
              first_name: profile?.first_name ?? "",
              last_name: profile?.last_name ?? "",
              timezone: currentTz,
              avatar_url: profile?.avatar_url ?? null,
            }}
            timezones={timezones}
          />
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">
              Change password
            </h2>
            <p className="mt-1 text-sm/6 text-gray-500">
              Update your password associated with your account.
            </p>
          </div>
          <PasswordForm />
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">
              Delete account
            </h2>
            <p className="mt-1 text-sm/6 text-gray-500">
              No longer want to use our service? You can delete your account
              here. This action is not reversible. All information related to
              this account will be deleted permanently.
            </p>
          </div>
          <div className="md:col-span-2">
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white opacity-50 shadow-sm"
            >
              Yes, delete my account
            </button>
            <p className="mt-2 text-xs/5 text-gray-500">
              Account deletion isn’t available yet.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}