import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img
                alt="Your Company"
                src="/milli.svg"
                className="h-8 w-auto"
              />
              <h1 className="ml-4 text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                {profile?.first_name} {profile?.last_name}
              </span>
              <span className="text-sm text-gray-500">{user.email}</span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome back, {profile?.first_name}! 👋
              </h2>
              <div className="space-y-3">
                <p className="text-gray-600">
                  You're successfully logged in to your account.
                </p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Account Information</h3>
                  <dl className="space-y-1">
                    <div>
                      <dt className="text-xs text-gray-500">Name:</dt>
                      <dd className="text-sm text-gray-900">{profile?.first_name} {profile?.last_name}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">Email:</dt>
                      <dd className="text-sm text-gray-900">{user.email}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">User ID:</dt>
                      <dd className="text-sm text-gray-900 font-mono">{user.id}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}