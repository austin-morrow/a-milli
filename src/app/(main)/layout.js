// app/(main)/layout.js
import Header from '@/app/components/Header'
import { createClient } from '@/lib/supabase/server'

export default async function MainLayout({ children }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let displayName = ''
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()

    // display_name is null if neither first nor last name is set
    displayName = profile?.display_name || user.email.split('@')[0]
  }

  return <Header displayName={displayName}>{children}</Header>
}