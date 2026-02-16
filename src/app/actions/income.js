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

  revalidatePath('/income')
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

  revalidatePath('/income')
  return { success: true }
}