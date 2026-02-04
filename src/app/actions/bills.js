'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBill(formData) {
  const supabase = await createClient()

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be logged in to create a bill' }
  }

  // Get the user's workspace
  const { data: workspaceMember, error: workspaceError } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .single()

  if (workspaceError || !workspaceMember) {
    return { error: 'No workspace found' }
  }

  // Get form data
  const amount = formData.get('amount')
  const description = formData.get('description')
  const recurrenceType = formData.get('recurrenceType')

  // Validate basic fields
  if (!amount || !description || !recurrenceType) {
    return { error: 'Description, amount, and frequency are required' }
  }

  // Build the bill object
  const billData = {
    workspace_id: workspaceMember.workspace_id,
    amount: parseFloat(amount),
    description: description,
    recurrence_type: recurrenceType,
    is_recurring: true, // All bills are recurring now
    category_id: formData.get('categoryId') || null,
  }

  // Handle different recurrence types
  if (recurrenceType === 'weekly') {
    const weeklyDays = formData.get('weeklyDays')
    if (!weeklyDays) {
      return { error: 'Please select at least one day for weekly bills' }
    }
    billData.weekly_days = JSON.parse(weeklyDays)
  } 
  else if (recurrenceType === 'monthly') {
    const dayOfMonth = formData.get('dayOfMonth')
    if (!dayOfMonth) {
      return { error: 'Day of month is required for monthly bills' }
    }
    billData.day_of_month = dayOfMonth === 'last' ? -1 : parseInt(dayOfMonth)
  } 
  else if (recurrenceType === 'yearly') {
    const yearlyDate = formData.get('yearlyDate')
    if (!yearlyDate) {
      return { error: 'Date is required for yearly bills' }
    }
    billData.yearly_date = yearlyDate
  }

  // Create the bill
  const { error: billError } = await supabase
    .from('bills')
    .insert(billData)

  if (billError) {
    return { error: 'Failed to create bill: ' + billError.message }
  }

  revalidatePath('/bills')
  return { success: true }
}

export async function updateBill(billId, formData) {
  const supabase = await createClient()

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be logged in to update a bill' }
  }

  // Get form data
  const amount = formData.get('amount')
  const description = formData.get('description')
  const recurrenceType = formData.get('recurrenceType')

  // Validate basic fields
  if (!amount || !description || !recurrenceType) {
    return { error: 'Description, amount, and frequency are required' }
  }

  // Build the update object
  const updateData = {
    amount: parseFloat(amount),
    description: description,
    recurrence_type: recurrenceType,
    is_recurring: true,
    category_id: formData.get('categoryId') || null,
    // Clear old values
    day_of_month: null,
    weekly_days: null,
    yearly_date: null,
  }

  // Handle different recurrence types
  if (recurrenceType === 'weekly') {
    const weeklyDays = formData.get('weeklyDays')
    if (!weeklyDays) {
      return { error: 'Please select at least one day for weekly bills' }
    }
    updateData.weekly_days = JSON.parse(weeklyDays)
  } 
  else if (recurrenceType === 'monthly') {
    const dayOfMonth = formData.get('dayOfMonth')
    if (!dayOfMonth) {
      return { error: 'Day of month is required for monthly bills' }
    }
    updateData.day_of_month = dayOfMonth === 'last' ? -1 : parseInt(dayOfMonth)
  } 
  else if (recurrenceType === 'yearly') {
    const yearlyDate = formData.get('yearlyDate')
    if (!yearlyDate) {
      return { error: 'Date is required for yearly bills' }
    }
    updateData.yearly_date = yearlyDate
  }

  // Update the bill
  const { error: billError } = await supabase
    .from('bills')
    .update(updateData)
    .eq('id', billId)

  if (billError) {
    return { error: 'Failed to update bill: ' + billError.message }
  }

  revalidatePath('/bills')
  return { success: true }
}

export async function deleteBill(billId) {
  const supabase = await createClient()

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be logged in to delete a bill' }
  }

  // Delete the bill
  const { error: billError } = await supabase
    .from('bills')
    .delete()
    .eq('id', billId)

  if (billError) {
    return { error: 'Failed to delete bill: ' + billError.message }
  }

  revalidatePath('/bills')
  return { success: true }
}
