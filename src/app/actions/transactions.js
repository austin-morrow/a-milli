'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTransaction(formData) {
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

  const transactionType = formData.get('transactionType')
  const date = formData.get('date')
  const description = formData.get('description')
  const amount = formData.get('amount')
  const accountId = formData.get('accountId')
const categoryId = formData.get('categoryId')
const expenseId = formData.get('expenseId')

  if (!transactionType || !date || !description || !amount || !accountId) {
    return { error: 'Transaction type, date, description, amount, and account are required' }
  }

  // Create the transaction
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert({
      workspace_id: workspaceMember.workspace_id,
      transaction_type: transactionType,
      date: date,
      description: description,
      amount: parseFloat(amount),
      account_id: accountId,
      category_id: categoryId || null,
      expense_id: expenseId || null,
    })

  if (transactionError) {
    return { error: 'Failed to create transaction: ' + transactionError.message }
  }

  // Update account balance
  const { data: account } = await supabase
    .from('accounts')
    .select('balance')
    .eq('id', accountId)
    .single()

  if (account) {
    const balanceChange = transactionType === 'income' 
      ? parseFloat(amount) 
      : -parseFloat(amount)
    
    const newBalance = parseFloat(account.balance) + balanceChange

    await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId)
  }

  revalidatePath('/transactions')
  revalidatePath('/accounts')
  return { success: true }
}

export async function updateTransaction(transactionId, formData) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'You must be logged in' }
  }

  const transactionType = formData.get('transactionType')
  const date = formData.get('date')
  const description = formData.get('description')
  const amount = formData.get('amount')
  const accountId = formData.get('accountId')
  const categoryId = formData.get('categoryId')
  const expenseId = formData.get('expenseId')

  if (!transactionType || !date || !description || !amount || !accountId) {
    return { error: 'Transaction type, date, description, amount, and account are required' }
  }

  // Get old transaction data
  const { data: oldTransaction } = await supabase
    .from('transactions')
    .select('transaction_type, amount, account_id')
    .eq('id', transactionId)
    .single()

  // Update the transaction
  const { error: transactionError } = await supabase
    .from('transactions')
    .update({
      transaction_type: transactionType,
      date: date,
      description: description,
      amount: parseFloat(amount),
      account_id: accountId,
      category_id: categoryId || null,
      expense_id: expenseId || null,
    })
    .eq('id', transactionId)

  if (transactionError) {
    return { error: 'Failed to update transaction: ' + transactionError.message }
  }

  // Reverse old balance change
  if (oldTransaction) {
    const { data: oldAccount } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', oldTransaction.account_id)
      .single()

    if (oldAccount) {
      const oldBalanceChange = oldTransaction.transaction_type === 'income'
        ? -parseFloat(oldTransaction.amount)
        : parseFloat(oldTransaction.amount)
      
      const reversedBalance = parseFloat(oldAccount.balance) + oldBalanceChange

      await supabase
        .from('accounts')
        .update({ balance: reversedBalance })
        .eq('id', oldTransaction.account_id)
    }
  }

  // Apply new balance change
  const { data: account } = await supabase
    .from('accounts')
    .select('balance')
    .eq('id', accountId)
    .single()

  if (account) {
    const balanceChange = transactionType === 'income'
      ? parseFloat(amount)
      : -parseFloat(amount)
    
    const newBalance = parseFloat(account.balance) + balanceChange

    await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId)
  }

  revalidatePath('/transactions')
  revalidatePath('/accounts')
  return { success: true }
}

export async function deleteTransaction(transactionId) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'You must be logged in' }
  }

  // Get transaction data before deleting
  const { data: transaction } = await supabase
    .from('transactions')
    .select('transaction_type, amount, account_id')
    .eq('id', transactionId)
    .single()

  // Delete the transaction
  const { error: transactionError } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)

  if (transactionError) {
    return { error: 'Failed to delete transaction: ' + transactionError.message }
  }

  // Reverse balance change
  if (transaction) {
    const { data: account } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', transaction.account_id)
      .single()

    if (account) {
      const balanceChange = transaction.transaction_type === 'income'
        ? -parseFloat(transaction.amount)
        : parseFloat(transaction.amount)
      
      const newBalance = parseFloat(account.balance) + balanceChange

      await supabase
        .from('accounts')
        .update({ balance: newBalance })
        .eq('id', transaction.account_id)
    }
  }

  revalidatePath('/transactions')
  revalidatePath('/accounts')
  return { success: true }
}