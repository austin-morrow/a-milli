'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'


export async function updateBill(billId, formData) {
  const supabase = await createClient()

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be logged in to update a bill' }
  }

  // Get form data
  const amount = formData.get('amount')
  const dayOfMonth = formData.get('dayOfMonth')
  const description = formData.get('description')
  const isRecurring = formData.get('isRecurring') === 'on'
  const recurrenceEndDate = formData.get('recurrenceEndDate')

  // Validate
  if (!amount || !dayOfMonth || !description) {
    return { error: 'Description, amount, and day of month are required' }
  }

  // Build the update object
  const updateData = {
    amount: parseFloat(amount),
    day_of_month: parseInt(dayOfMonth),
    description: description,
    recurrence_end_date: recurrenceEndDate || null,
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