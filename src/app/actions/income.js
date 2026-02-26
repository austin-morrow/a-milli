"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createRecurringIncome(formData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  const { data: workspaceMember, error: workspaceError } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .single();

  if (workspaceError || !workspaceMember) {
    return { error: "No workspace found" };
  }

  const accountId = formData.get("accountId");
  const amount = formData.get("amount");
  const date = formData.get("date");
  const description = formData.get("description");  
  const plannedAmount = formData.get("plannedAmount");
  const receivedAmount = formData.get("receivedAmount");

  if (!accountId || !amount || !date) {
    return { error: "Account, amount, and date are required" };
  }

  const { error: incomeError } = await supabase
    .from("recurring_income")
    .insert({
      workspace_id: workspaceMember.workspace_id,
      account_id: accountId,
      amount: parseFloat(amount),
      date: date,
      description: description,
      planned_amount: plannedAmount ? parseFloat(plannedAmount) : null,
      received_amount: receivedAmount ? parseFloat(receivedAmount) : null,
    });

  if (incomeError) {
    return { error: "Failed to create paycheck: " + incomeError.message };
  }

  // Update account balance if received amount exists and date is today or earlier
const incomeDate = new Date(date)
const today = new Date()
today.setHours(0, 0, 0, 0)

if (receivedAmount && incomeDate <= today) {
  // Get current account balance
  const { data: account } = await supabase
    .from('accounts')
    .select('balance')
    .eq('id', accountId)
    .single()

  if (account) {
    const newBalance = parseFloat(account.balance) + parseFloat(receivedAmount)
    
    await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId)

    // Create transaction and get its ID
    const { data: newTransaction } = await supabase
      .from('transactions')
      .insert({
        workspace_id: workspaceMember.workspace_id,
        transaction_type: 'income',
        date: date,
        description: description || 'Paycheck',
        amount: parseFloat(receivedAmount),
        account_id: accountId,
        category_id: null,
        expense_id: null,
      })
      .select('id')
      .single()

    // Link the transaction to this income record
    if (newTransaction) {
      await supabase
        .from('recurring_income')
        .update({ transaction_id: newTransaction.id })
        .eq('workspace_id', workspaceMember.workspace_id)
        .eq('account_id', accountId)
        .eq('date', date)
        .eq('amount', parseFloat(amount))
        .order('created_at', { ascending: false })
        .limit(1)
    }
  }
}

  revalidatePath("/income");
  revalidatePath("/accounts");
  return { success: true };
}

export async function updateRecurringIncome(incomeId, formData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  const accountId = formData.get("accountId");
  const amount = formData.get("amount");
  const date = formData.get("date");
  const description = formData.get("description");
  const plannedAmount = formData.get("plannedAmount");
  const receivedAmount = formData.get("receivedAmount");

  if (!accountId || !amount || !date) {
    return { error: "Account, amount, and date are required" };
  }

 const today = new Date()
today.setHours(0, 0, 0, 0)

// Get the old income data including transaction_id
const { data: oldIncome } = await supabase
  .from('recurring_income')
  .select('account_id, received_amount, date, transaction_id')
  .eq('id', incomeId)
  .single()

// Update the income record
const { error: incomeError } = await supabase
  .from('recurring_income')
  .update({
    account_id: accountId,
    amount: parseFloat(amount),
    date: date,
    description: description,
    planned_amount: plannedAmount ? parseFloat(plannedAmount) : null,
    received_amount: receivedAmount ? parseFloat(receivedAmount) : null,
  })
  .eq('id', incomeId)

if (incomeError) {
  return { error: 'Failed to update paycheck: ' + incomeError.message }
}

// Handle balance and transaction changes
// First, reverse old balance and delete old transaction if it existed
if (oldIncome?.received_amount) {
  const oldDate = new Date(oldIncome.date)
  if (oldDate <= today) {
    // Reverse old balance
    const { data: oldAccount } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', oldIncome.account_id)
      .single()

    if (oldAccount) {
      const reversedBalance = parseFloat(oldAccount.balance) - parseFloat(oldIncome.received_amount)
      await supabase
        .from('accounts')
        .update({ balance: reversedBalance })
        .eq('id', oldIncome.account_id)
    }

    // Delete old transaction and clear the transaction_id
    if (oldIncome.transaction_id) {
      await supabase
        .from('transactions')
        .delete()
        .eq('id', oldIncome.transaction_id)
      
      // ADD THIS: Clear the transaction_id from income
      await supabase
        .from('recurring_income')
        .update({ transaction_id: null })
        .eq('id', incomeId)
    }
  }
}

// Apply new balance and create new transaction if applicable
const newDate = new Date(date)
if (receivedAmount && newDate <= today) {
  const { data: account } = await supabase
    .from('accounts')
    .select('balance')
    .eq('id', accountId)
    .single()

  if (account) {
    const newBalance = parseFloat(account.balance) + parseFloat(receivedAmount)
    await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId)

    // Create new transaction
    const { data: newTransaction } = await supabase
      .from('transactions')
      .insert({
        workspace_id: (await supabase.from('workspace_members').select('workspace_id').eq('user_id', user.id).single()).data.workspace_id,
        transaction_type: 'income',
        date: date,
        description: description || 'Paycheck',
        amount: parseFloat(receivedAmount),
        account_id: accountId,
        category_id: null,
        expense_id: null,
      })
      .select('id')
      .single()

    // Link the new transaction
    if (newTransaction) {
      await supabase
        .from('recurring_income')
        .update({ transaction_id: newTransaction.id })
        .eq('id', incomeId)
    }
  }
}

  revalidatePath("/income");
  revalidatePath("/accounts");
  return { success: true };
}

export async function createMiscIncome(formData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  const { data: workspaceMember, error: workspaceError } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .single();

  if (workspaceError || !workspaceMember) {
    return { error: "No workspace found" };
  }

  const accountId = formData.get("accountId");
  const amount = formData.get("amount");
  const date = formData.get("date");
  const description = formData.get("description");

  if (!accountId || !amount || !date) {
    return { error: "Account, amount, and date are required" };
  }

  const { error: incomeError } = await supabase.from("misc_income").insert({
    workspace_id: workspaceMember.workspace_id,
    account_id: accountId,
    amount: parseFloat(amount),
    date: date,
    description: description,
  });

  if (incomeError) {
    return { error: "Failed to create misc income: " + incomeError.message };
  }

// Update account balance if date is today or earlier
const incomeDate = new Date(date)
const today = new Date()
today.setHours(0, 0, 0, 0)

if (incomeDate <= today) {
  const { data: account } = await supabase
    .from('accounts')
    .select('balance')
    .eq('id', accountId)
    .single()

  if (account) {
    const newBalance = parseFloat(account.balance) + parseFloat(amount)
    await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId)

    // Create transaction and get its ID
    const { data: newTransaction } = await supabase
      .from('transactions')
      .insert({
        workspace_id: workspaceMember.workspace_id,
        transaction_type: 'income',
        date: date,
        description: description,
        amount: parseFloat(amount),
        account_id: accountId,
        category_id: null,
        expense_id: null,
      })
      .select('id')
      .single()

    // Link the transaction to this income record
    if (newTransaction) {
      await supabase
        .from('misc_income')
        .update({ transaction_id: newTransaction.id })
        .eq('workspace_id', workspaceMember.workspace_id)
        .eq('account_id', accountId)
        .eq('date', date)
        .eq('amount', parseFloat(amount))
        .order('created_at', { ascending: false })
        .limit(1)
    }
  }
}

  revalidatePath("/income");
  revalidatePath("/accounts");
  return { success: true };
}

export async function updateMiscIncome(incomeId, formData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "You must be logged in" };
  }

  const accountId = formData.get("accountId");
  const amount = formData.get("amount");
  const date = formData.get("date");
  const description = formData.get("description");

  if (!accountId || !amount || !date) {
    return { error: "Account, amount, and date are required" };
  }


const today = new Date()
today.setHours(0, 0, 0, 0)

// Get the old income data including transaction_id
const { data: oldIncome } = await supabase
  .from('misc_income')
  .select('account_id, amount, date, transaction_id')
  .eq('id', incomeId)
  .single()

// Update the income record
const { error: incomeError } = await supabase
  .from('misc_income')
  .update({
    account_id: accountId,
    amount: parseFloat(amount),
    date: date,
    description: description,
  })
  .eq('id', incomeId)

if (incomeError) {
  return { error: 'Failed to update misc income: ' + incomeError.message }
}

// Handle balance and transaction changes
// First, reverse old balance and delete old transaction if it existed
if (oldIncome) {
  const oldDate = new Date(oldIncome.date)
  if (oldDate <= today) {
    // Reverse old balance
    const { data: oldAccount } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', oldIncome.account_id)
      .single()

    if (oldAccount) {
      const reversedBalance = parseFloat(oldAccount.balance) - parseFloat(oldIncome.amount)
      await supabase
        .from('accounts')
        .update({ balance: reversedBalance })
        .eq('id', oldIncome.account_id)
    }

    // Delete old transaction and clear the transaction_id
    if (oldIncome.transaction_id) {
      await supabase
        .from('transactions')
        .delete()
        .eq('id', oldIncome.transaction_id)
      
      // ADD THIS: Clear the transaction_id from income
      await supabase
        .from('misc_income')
        .update({ transaction_id: null })
        .eq('id', incomeId)
    }
  }
}


// Apply new balance and create new transaction if applicable
const newDate = new Date(date)
if (newDate <= today) {
  const { data: account } = await supabase
    .from('accounts')
    .select('balance')
    .eq('id', accountId)
    .single()

  if (account) {
    const newBalance = parseFloat(account.balance) + parseFloat(amount)
    await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId)

    // Create new transaction
    const { data: newTransaction } = await supabase
      .from('transactions')
      .insert({
        workspace_id: (await supabase.from('workspace_members').select('workspace_id').eq('user_id', user.id).single()).data.workspace_id,
        transaction_type: 'income',
        date: date,
        description: description,
        amount: parseFloat(amount),
        account_id: accountId,
        category_id: null,
        expense_id: null,
      })
      .select('id')
      .single()

    // Link the new transaction
    if (newTransaction) {
      await supabase
        .from('misc_income')
        .update({ transaction_id: newTransaction.id })
        .eq('id', incomeId)
    }
  }
}

  revalidatePath("/income");
  revalidatePath("/accounts");
  return { success: true };
}

export async function deleteRecurringIncome(incomeId) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'You must be logged in' }
  }

  // Get income data before deleting
  const { data: income } = await supabase
    .from('recurring_income')
    .select('account_id, received_amount, date, transaction_id')
    .eq('id', incomeId)
    .single()

  // Manually delete the linked transaction FIRST
  if (income?.transaction_id) {
    await supabase
      .from('transactions')
      .delete()
      .eq('id', income.transaction_id)
  }

  // Then delete the income
  const { error: incomeError } = await supabase
    .from('recurring_income')
    .delete()
    .eq('id', incomeId)

  if (incomeError) {
    return { error: 'Failed to delete paycheck: ' + incomeError.message }
  }

  // Reverse the balance
  if (income?.received_amount) {
    const incomeDate = new Date(income.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (incomeDate <= today) {
      const { data: account } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', income.account_id)
        .single()

      if (account) {
        const newBalance = parseFloat(account.balance) - parseFloat(income.received_amount)
        await supabase
          .from('accounts')
          .update({ balance: newBalance })
          .eq('id', income.account_id)
      }
    }
  }

  revalidatePath('/income')
  revalidatePath('/accounts')
  revalidatePath('/transactions')
  return { success: true }
}

export async function deleteMiscIncome(incomeId) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'You must be logged in' }
  }

  // Get income data before deleting
  const { data: income } = await supabase
    .from('misc_income')
    .select('account_id, amount, date, transaction_id')
    .eq('id', incomeId)
    .single()

  // Manually delete the linked transaction FIRST
  if (income?.transaction_id) {
    await supabase
      .from('transactions')
      .delete()
      .eq('id', income.transaction_id)
  }

  // Then delete the income
  const { error: incomeError } = await supabase
    .from('misc_income')
    .delete()
    .eq('id', incomeId)

  if (incomeError) {
    return { error: 'Failed to delete misc income: ' + incomeError.message }
  }

  // Reverse the balance
  if (income) {
    const incomeDate = new Date(income.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (incomeDate <= today) {
      const { data: account } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', income.account_id)
        .single()

      if (account) {
        const newBalance = parseFloat(account.balance) - parseFloat(income.amount)
        await supabase
          .from('accounts')
          .update({ balance: newBalance })
          .eq('id', income.account_id)
      }
    }
  }

  revalidatePath('/income')
  revalidatePath('/accounts')
  revalidatePath('/transactions')
  return { success: true }
} 
