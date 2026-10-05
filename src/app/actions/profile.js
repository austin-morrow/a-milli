"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const AVATAR_BUCKET = "avatars";

function isValidTimezone(tz) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export async function updateProfile(formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const firstName = formData.get("firstName")?.toString().trim();
  const lastName = formData.get("lastName")?.toString().trim();
  const timezone = formData.get("timezone")?.toString();

  if (!firstName || !lastName) {
    return { error: "First and last name are required." };
  }
  if (!timezone || !isValidTimezone(timezone)) {
    return { error: "Choose a valid timezone." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ first_name: firstName, last_name: lastName, timezone })
    .eq("id", user.id);

  if (error) return { error: "Could not save your changes. Try again." };

  // Refresh the header name and dashboard greeting
  revalidatePath("/", "layout");
  return { success: true };
}

// Called after the browser has uploaded the file to Storage
export async function updateAvatar(newUrl) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const bucketPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${AVATAR_BUCKET}/`;

  // Only accept URLs that point into this user's own avatar folder
  if (!newUrl?.startsWith(`${bucketPrefix}${user.id}/`)) {
    return { error: "Invalid image." };
  }

  const { data: current } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .single();

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: newUrl })
    .eq("id", user.id);

  if (error) return { error: "Could not save your new picture. Try again." };

  // Remove the previous picture from Storage
  const oldUrl = current?.avatar_url;
  if (oldUrl?.startsWith(`${bucketPrefix}${user.id}/`)) {
    await supabase.storage
      .from(AVATAR_BUCKET)
      .remove([oldUrl.slice(bucketPrefix.length)]);
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function changePassword(formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const currentPassword = formData.get("current_password")?.toString() ?? "";
  const newPassword = formData.get("new_password")?.toString() ?? "";
  const confirmPassword = formData.get("confirm_password")?.toString() ?? "";

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }
  if (newPassword === currentPassword) {
    return { error: "New password must be different from your current one." };
  }

  // Confirm the current password before allowing a change
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (verifyError) return { error: "Current password is incorrect." };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };

  return { success: true };
}