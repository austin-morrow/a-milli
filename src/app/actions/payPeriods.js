'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPayPeriod(formData) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'You must be logged in' }
  }

  const budgetId = formData.get('budgetId')
  const startDate = formData.get('startDate')
  const endDate = formData.get('endDate')
  const description = formData.get('description')

  if (!budgetId || !startDate || !endDate) {
    return { error: 'Budget, start date, and end date are required' }
  }

  // Validate that end date is after start date
  if (new Date(endDate) < new Date(startDate)) {
    return { error: 'End date must be after start date' }
  }

  const { error: periodError } = await supabase
    .from('budget_pay_periods')
    .insert({
      budget_id: budgetId,
      start_date: startDate,
      end_date: endDate,
      description: description,
    })

  if (periodError) {
    return { error: 'Failed to create pay period: ' + periodError.message }
  }

  revalidatePath('/spending/budget')
  return { success: true }
}

export async function updatePayPeriod(periodId, formData) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'You must be logged in' }
  }

  const startDate = formData.get('startDate')
  const endDate = formData.get('endDate')
  const description = formData.get('description')

  if (!startDate || !endDate) {
    return { error: 'Start date and end date are required' }
  }

  // Validate that end date is after start date
  if (new Date(endDate) < new Date(startDate)) {
    return { error: 'End date must be after start date' }
  }

  const { error: periodError } = await supabase
    .from('budget_pay_periods')
    .update({
      start_date: startDate,
      end_date: endDate,
      description: description,
    })
    .eq('id', periodId)

  if (periodError) {
    return { error: 'Failed to update pay period: ' + periodError.message }
  }

  revalidatePath('/spending/budget')
  return { success: true }
}

export async function deletePayPeriod(periodId) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'You must be logged in' }
  }

  const { error: periodError } = await supabase
    .from('budget_pay_periods')
    .delete()
    .eq('id', periodId)

  if (periodError) {
    return { error: 'Failed to delete pay period: ' + periodError.message }
  }

  revalidatePath('/spending/budget')
  return { success: true }
}