"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAccount(formData) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to create an account" };
  }

  // Get the user's workspace
  const { data: workspaceMember, error: workspaceError } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .single();

  if (workspaceError || !workspaceMember) {
    return { error: "No workspace found" };
  }

  // Get form data
  const accountType = formData.get("accountType");
  const accountSubtype = formData.get("accountSubtype");
  const institutionName = formData.get("institutionName");
  const nickname = formData.get("nickname");
  const balance = formData.get("balance");

  // Validate
  if (!accountType || !nickname) {
    return { error: "Account type and nickname are required" };
  }

  if (accountType === "banking" && (!accountSubtype || !institutionName)) {
    return {
      error: "Banking accounts require account type and institution name",
    };
  }

  // Build the account object
  const accountData = {
    workspace_id: workspaceMember.workspace_id,
    account_type: accountType,
    account_subtype: accountType === "banking" ? accountSubtype : null,
    institution_name: accountType === "banking" ? institutionName : null,
    nickname: nickname,
    balance: parseFloat(balance) || 0,
  };

  // Create the account
  const { error: accountError } = await supabase
    .from("accounts")
    .insert(accountData);

  if (accountError) {
    return { error: "Failed to create account: " + accountError.message };
  }

  revalidatePath("/accounts");
  return { success: true };
}

export async function updateAccount(accountId, formData) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to update an account" };
  }

  // Get form data
  const accountType = formData.get("accountType");
  const accountSubtype = formData.get("accountSubtype");
  const institutionName = formData.get("institutionName");
  const nickname = formData.get("nickname");
  const balance = formData.get("balance");

  // Validate
  if (!accountType || !nickname) {
    return { error: "Account type and nickname are required" };
  }

  if (accountType === "banking" && (!accountSubtype || !institutionName)) {
    return {
      error: "Banking accounts require account type and institution name",
    };
  }

  // Build the update object
  const updateData = {
    account_type: accountType,
    account_subtype: accountType === "banking" ? accountSubtype : null,
    institution_name: accountType === "banking" ? institutionName : null,
    nickname: nickname,
    balance: parseFloat(balance) || 0,
  };

  // Update the account
  const { error: accountError } = await supabase
    .from("accounts")
    .update(updateData)
    .eq("id", accountId);

  if (accountError) {
    return { error: "Failed to update account: " + accountError.message };
  }

  revalidatePath("/accounts");
  return { success: true };
}

export async function deleteAccount(accountId) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to delete an account" };
  }

  // Delete the account
  const { error: accountError } = await supabase
    .from("accounts")
    .delete()
    .eq("id", accountId);

  if (accountError) {
    return { error: "Failed to delete account: " + accountError.message };
  }

  revalidatePath("/accounts");
  return { success: true };
}
