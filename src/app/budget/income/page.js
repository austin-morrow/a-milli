import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import IncomeLayout from '@/app/components/IncomeLayout'

export default async function IncomePage() {
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

  // Fetch recurring income (paychecks)
  const { data: recurringIncome } = await supabase
    .from('recurring_income')
    .select('*, accounts(nickname)')
    .eq('workspace_id', workspaceMember.workspace_id)
    .order('date', { ascending: true })

  // Fetch misc income
  const { data: miscIncome } = await supabase
    .from('misc_income')
    .select('*, accounts(nickname)')
    .eq('workspace_id', workspaceMember.workspace_id)
    .order('date', { ascending: false })

  // Fetch accounts for dropdowns
  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .eq('workspace_id', workspaceMember.workspace_id)
    .order('nickname')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <IncomeLayout 
          recurringIncome={recurringIncome || []}
          miscIncome={miscIncome || []}
          accounts={accounts || []}
        />
      </div>
    </div>
  )
}