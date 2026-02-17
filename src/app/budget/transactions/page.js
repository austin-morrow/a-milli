import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TransactionsList from '@/app/components/TransactionsList'

export default async function TransactionsPage() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's workspace
  const { data: workspaceMember } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .single()

  // Fetch transactions with related data
  const { data: transactions } = await supabase
  .from('transactions')
  .select('*, accounts(nickname), categories(name, color), expenses(description)')
  .eq('workspace_id', workspaceMember.workspace_id)
  .order('date', { ascending: false })

  // Fetch accounts for dropdown
  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .eq('workspace_id', workspaceMember.workspace_id)
    .order('nickname')

  // Fetch categories for dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('workspace_id', workspaceMember.workspace_id)
    .order('name')

const { data: expenses } = await supabase
  .from('expenses')
  .select('*, categories(name)')
  .eq('workspace_id', workspaceMember.workspace_id)
  .order('description')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
     <TransactionsList 
  transactions={transactions || []}
  accounts={accounts || []}
  categories={categories || []}
  expenses={expenses || []}
/>
      </div>
    </div>
  )
}