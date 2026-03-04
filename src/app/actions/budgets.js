'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBudget(formData) {
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

const month = formData.get('month') // Format: 'YYYY-MM'

if (!month) {
  return { error: 'Month is required' }
}

// Convert YYYY-MM to first day of month
const monthDate = `${month}-01`

// Create month name without timezone issues
const [year, monthNum] = month.split('-')
const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1) // Use local timezone
const name = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const { error: budgetError } = await supabase
    .from('budgets')
    .insert({
      workspace_id: workspaceMember.workspace_id,
      month: monthDate,
      name: name,
    })

  if (budgetError) {
    return { error: 'Failed to create budget: ' + budgetError.message }
  }

  revalidatePath('/spending/budget')
  return { success: true }
}

export async function deleteBudget(budgetId) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'You must be logged in' }
  }

  const { error: budgetError } = await supabase
    .from('budgets')
    .delete()
    .eq('id', budgetId)

  if (budgetError) {
    return { error: 'Failed to delete budget: ' + budgetError.message }
  }

  revalidatePath('/spending/budget')
  return { success: true }
}