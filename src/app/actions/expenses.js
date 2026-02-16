"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createExpense(formData) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to create a expense" };
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
  const amount = formData.get("amount");
  const description = formData.get("description");
  const recurrenceType = formData.get("recurrenceType");

  // Validate basic fields
  if (!amount || !description || !recurrenceType) {
    return { error: "Description, amount, and frequency are required" };
  }

  // Build the expense object
  const expenseData = {
    workspace_id: workspaceMember.workspace_id,
    amount: parseFloat(amount),
    description: description,
    recurrence_type: recurrenceType,
    is_recurring: true, // All expenses are recurring now
    category_id: formData.get("categoryId") || null,
  };

  // Handle different recurrence types
  if (recurrenceType === "weekly") {
    const weeklyDays = formData.get("weeklyDays");
    if (!weeklyDays) {
      return { error: "Please select at least one day for weekly expenses" };
    }
    expenseData.weekly_days = JSON.parse(weeklyDays);
  } else if (recurrenceType === "monthly") {
    const dayOfMonth = formData.get("dayOfMonth");
    if (!dayOfMonth) {
      return { error: "Day of month is required for monthly expenses" };
    }
    expenseData.day_of_month =
      dayOfMonth === "last" ? -1 : parseInt(dayOfMonth);
  } else if (recurrenceType === "yearly") {
    const yearlyDate = formData.get("yearlyDate");
    if (!yearlyDate) {
      return { error: "Date is required for yearly expenses" };
    }
    expenseData.yearly_date = yearlyDate;
  }

  // Create the expense
  const { error: expenseError } = await supabase
    .from("expenses")
    .insert(expenseData);

  if (expenseError) {
    return { error: "Failed to create expense: " + expenseError.message };
  }

  revalidatePath("/expenses");
  return { success: true };
}

export async function updateExpense(expenseId, formData) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to update a expense" };
  }

  // Get form data
  const amount = formData.get("amount");
  const description = formData.get("description");
  const recurrenceType = formData.get("recurrenceType");

  // Validate basic fields
  if (!amount || !description || !recurrenceType) {
    return { error: "Description, amount, and frequency are required" };
  }

  // Build the update object
  const updateData = {
    amount: parseFloat(amount),
    description: description,
    recurrence_type: recurrenceType,
    is_recurring: true,
    category_id: formData.get("categoryId") || null,
    day_of_month: null,
    weekly_days: null,
    yearly_date: null,
  };

  // Handle different recurrence types
  if (recurrenceType === "weekly") {
    const weeklyDays = formData.get("weeklyDays");
    if (!weeklyDays) {
      return { error: "Please select at least one day for weekly expenses" };
    }
    updateData.weekly_days = JSON.parse(weeklyDays);
  } else if (recurrenceType === "monthly") {
    const dayOfMonth = formData.get("dayOfMonth");
    if (!dayOfMonth) {
      return { error: "Day of month is required for monthly expenses" };
    }
    updateData.day_of_month = dayOfMonth === "last" ? -1 : parseInt(dayOfMonth);
  } else if (recurrenceType === "yearly") {
    const yearlyDate = formData.get("yearlyDate");
    if (!yearlyDate) {
      return { error: "Date is required for yearly expenses" };
    }
    updateData.yearly_date = yearlyDate;
  }

  // Update the expense
  const { error: expenseError } = await supabase
    .from("expenses")
    .update(updateData)
    .eq("id", expenseId);

  if (expenseError) {
    return { error: "Failed to update expense: " + expenseError.message };
  }

  revalidatePath("/expenses");
  return { success: true };
}

export async function deleteExpense(expenseId) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to delete a expense" };
  }

  // Delete the expense
  const { error: expenseError } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId);

  if (expenseError) {
    return { error: "Failed to delete expense: " + expenseError.message };
  }

  revalidatePath("/expenses");
  return { success: true };
}
