import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

function getGreeting(timeZone) {
  let hour
  try {
    hour = Number(
      new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hourCycle: 'h23',
        timeZone,
      }).format(new Date())
    )
  } catch {
    hour = new Date().getUTCHours() // invalid timezone name
  }

  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  const supabase = await createClient();

  // getUser() verifies the session with Supabase on the server
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, timezone")
    .eq("id", user.id)
    .single();

return (
  <main style={{ maxWidth: 600, margin: "4rem auto", padding: "0 1rem" }}>
    <h1>
      {getGreeting(profile?.timezone)}
      {profile?.first_name ? `, ${profile.first_name}` : ""}
    </h1>

    <form action={signOut}>
      <button>Sign out</button>
    </form>
  </main>
);
}