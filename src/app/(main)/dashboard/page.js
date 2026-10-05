import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

export default async function DashboardPage() {
  const supabase = await createClient();

  // getUser() verifies the session with Supabase on the server
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  return (
    <main style={{ maxWidth: 600, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Dashboard</h1>
      <p>Signed in as {user.email}</p>
      <p>Profile display name: {profile?.display_name ?? "(none)"}</p>

      <form action={signOut}>
        <button>Sign out</button>
      </form>
    </main>
  );
}