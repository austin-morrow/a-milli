import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BudgetLayout from '@/app/components/BudgetLayout'
import SpendingTracker from "@/app/components/SpendingTracker";


export default async function BudgetPage() {
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

  
    // Fetch budgets with pay periods
const { data: budgets } = await supabase
  .from('budgets')
  .select('*, budget_pay_periods(*)')
  .eq('workspace_id', workspaceMember.workspace_id)
  .order('month', { ascending: false })

  return (
      <SpendingTracker>
    <div className="min-h-screen bg-white border border-gray-200 rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BudgetLayout budgets={budgets || []} />
      </div>
    </div>
    </SpendingTracker>
  )
}