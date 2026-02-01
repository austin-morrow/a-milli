'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createWorkspace(formData) {
  const supabase = await createClient()

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be logged in to create a workspace' }
  }

  // Get workspace name from form
  const workspaceName = formData.get('workspaceName')

  if (!workspaceName || workspaceName.trim() === '') {
    return { error: 'Workspace name is required' }
  }

  // Generate slug from workspace name
  const baseSlug = workspaceName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  
  // Add random suffix to ensure uniqueness
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const slug = `${baseSlug}-${randomSuffix}`

  // Create the workspace
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .insert({
      name: workspaceName,
      slug: slug,
      owner_id: user.id,
    })
    .select()
    .single()

  if (workspaceError) {
    return { error: 'Failed to create workspace: ' + workspaceError.message }
  }

  // Add the user as a member of the workspace
  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: 'owner',
    })

  if (memberError) {
    return { error: 'Failed to add user to workspace: ' + memberError.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}