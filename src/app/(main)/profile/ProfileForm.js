"use client";

import { useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, updateAvatar } from "@/app/actions/profile";

const inputClass =
  "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-milli-green disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm/6";
const labelClass = "block text-sm/6 font-medium text-gray-900";

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_BYTES = 2 * 1024 * 1024;

export default function ProfileForm({ userId, email, profile, timezones }) {
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const initial = (profile.first_name || email || "?")[0].toUpperCase();

  async function handleAvatarChange(e) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    setAvatarError(null);

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      setAvatarError("Use a JPG, PNG, or WebP image.");
      input.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setAvatarError("Image must be 2 MB or smaller.");
      input.value = "";
      return;
    }

    setUploading(true);
    const supabase = createClient();

    // Unique filename each time so browsers never show a cached old picture
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { contentType: file.type });

    if (uploadError) {
      setAvatarError("Upload failed. Try again.");
      setUploading(false);
      input.value = "";
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const result = await updateAvatar(data.publicUrl);

    if (result?.error) {
      setAvatarError(result.error);
    } else {
      setAvatarUrl(data.publicUrl);
    }
    setUploading(false);
    input.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const result = await updateProfile(new FormData(e.currentTarget));

    if (result?.error) setError(result.error);
    else setSaved(true);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="md:col-span-2">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-full flex items-center gap-x-8">
          {avatarUrl ? (
            <img
              alt=""
              src={avatarUrl}
              className="size-24 flex-none rounded-lg bg-gray-100 object-cover outline outline-1 -outline-offset-1 outline-black/5"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex size-24 flex-none items-center justify-center rounded-lg bg-gray-100 text-3xl font-semibold text-gray-500"
            >
              {initial}
            </div>
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="sr-only"
              tabIndex={-1}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Change avatar"}
            </button>
            <p className="mt-2 text-xs/5 text-gray-500">
              JPG, PNG or WebP. 2MB max.
            </p>
            {avatarError && (
              <p role="alert" className="mt-1 text-xs/5 text-red-700">
                {avatarError}
              </p>
            )}
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="first-name" className={labelClass}>
            First name
          </label>
          <div className="mt-2">
            <input
              id="first-name"
              name="firstName"
              type="text"
              required
              defaultValue={profile.first_name}
              autoComplete="given-name"
              className={inputClass}
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="last-name" className={labelClass}>
            Last name
          </label>
          <div className="mt-2">
            <input
              id="last-name"
              name="lastName"
              type="text"
              required
              defaultValue={profile.last_name}
              autoComplete="family-name"
              className={inputClass}
            />
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              type="email"
              value={email}
              disabled
              readOnly
              className={inputClass}
            />
          </div>
          <p className="mt-2 text-xs/5 text-gray-500">
            Changing your email isn’t available yet.
          </p>
        </div>

        <div className="col-span-full">
          <label htmlFor="timezone" className={labelClass}>
            Timezone
          </label>
          <div className="mt-2 grid grid-cols-1">
            <select
              id="timezone"
              name="timezone"
              defaultValue={profile.timezone}
              className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-milli-green sm:text-sm/6"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
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
        <div
          role="status"
          className="mt-6 rounded-md bg-green-50 p-4 sm:max-w-xl"
        >
          <p className="text-sm text-green-800">Changes saved.</p>
        </div>
      )}

      <div className="mt-8 flex">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-milli-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-milli-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-milli-green disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
