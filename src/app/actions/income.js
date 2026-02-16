'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createRecurringIncome(formData) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'You must be logged in' }
  }

  const { data: workspaceMember, error: workspaceError } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .single()

  if (workspaceError || !workspaceMember) {
    return { error: 'No workspace found' }
  }

  const accountId = formData.get('accountId')
  const amount = formData.get('amount')
  const date = formData.get('date')
  const description = formData.get('description')
  const plannedAmount = formData.get('plannedAmount')
  const receivedAmount = formData.get('receivedAmount')

  if (!accountId || !amount || !date) {
    return { error: 'Account, amount, and date are required' }
  }

  const { error: incomeError } = await supabase
    .from('recurring_income')
    .insert({
      workspace_id: workspaceMember.workspace_id,
      account_id: accountId,
      amount: parseFloat(amount),
      date: date,
      description: description,
      planned_amount: plannedAmount ? parseFloat(plannedAmount) : null,
      received_amount: receivedAmount ? parseFloat(receivedAmount) : null,
    })

  if (incomeError) {
    return { error: 'Failed to create paycheck: ' + incomeError.message }
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
    }
  }

  revalidatePath('/income')
  revalidatePath('/accounts')
  return { success: true }
}

export async function updateRecurringIncome(incomeId, formData) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'You must be logged in' }
  }

  const accountId = formData.get('accountId')
  const amount = formData.get('amount')
  const date = formData.get('date')
  const description = formData.get('description')
  const plannedAmount = formData.get('plannedAmount')
  const receivedAmount = formData.get('receivedAmount')

  if (!accountId || !amount || !date) {
    return { error: 'Account, amount, and date are required' }
  }

  // Get the old income data to reverse previous balance changes if needed
  const { data: oldIncome } = await supabase
    .from('recurring_income')
    .select('account_id, received_amount, date')
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

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Reverse old balance change if it was applied
  if (oldIncome?.received_amount) {
    const oldDate = new Date(oldIncome.date)
    if (oldDate <= today) {
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
    }
  }

  // Apply new balance change if applicable
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
    }
  }

  revalidatePath('/income')
  revalidatePath('/accounts')
  return { success: true }
}

export async function createMiscIncome(formData) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'You must be logged in' }
  }

  const { data: workspaceMember, error: workspaceError } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .single()

  if (workspaceError || !workspaceMember) {
    return { error: 'No workspace found' }
  }

  const accountId = formData.get('accountId')
  const amount = formData.get('amount')
  const date = formData.get('date')
  const description = formData.get('description')

  if (!accountId || !amount || !date) {
    return { error: 'Account, amount, and date are required' }
  }

  const { error: incomeError } = await supabase
    .from('misc_income')
    .insert({
      workspace_id: workspaceMember.workspace_id,
      account_id: accountId,
      amount: parseFloat(amount),
      date: date,
      description: description,
    })

  if (incomeError) {
    return { error: 'Failed to create misc income: ' + incomeError.message }
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
    }
  }

  revalidatePath('/income')
  revalidatePath('/accounts')
  return { success: true }
}

export async function updateMiscIncome(incomeId, formData) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'You must be logged in' }
  }

  const accountId = formData.get('accountId')
  const amount = formData.get('amount')
  const date = formData.get('date')
  const description = formData.get('description')

  if (!accountId || !amount || !date) {
    return { error: 'Account, amount, and date are required' }
  }

  // Get the old income data to reverse previous balance changes
  const { data: oldIncome } = await supabase
    .from('misc_income')
    .select('account_id, amount, date')
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

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Reverse old balance change if it was applied
  if (oldIncome) {
    const oldDate = new Date(oldIncome.date)
    if (oldDate <= today) {
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
    }
  }

  // Apply new balance change if applicable
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
    }
  }

  revalidatePath('/income')
  revalidatePath('/accounts')
  return { success: true }
}
