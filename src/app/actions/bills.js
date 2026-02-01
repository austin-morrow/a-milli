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
  const dueDate = formData.get('dueDate')
  const description = formData.get('description')

  // Validate
  if (!amount || !dueDate || !description) {
    return { error: 'All fields are required' }
  }

  // Create the bill
  const { error: billError } = await supabase
    .from('bills')
    .insert({
      workspace_id: workspaceMember.workspace_id,
      amount: parseFloat(amount),
      due_date: dueDate,
      description: description,
    })

  if (billError) {
    return { error: 'Failed to create bill: ' + billError.message }
  }

  revalidatePath('/dashboard/bills')
  return { success: true }
}