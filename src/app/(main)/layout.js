// app/(main)/layout.js
import Header from '@/app/components/Header'
import { createClient } from '@/lib/supabase/server'

export default async function MainLayout({ children }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let displayName = ''
  let avatarUrl = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', user.id)
      .single()

    displayName = profile?.display_name || user.email.split('@')[0]
    avatarUrl = profile?.avatar_url ?? null
  }

  return (
    <Header displayName={displayName} avatarUrl={avatarUrl}>
      {children}
    </Header>
  )
}