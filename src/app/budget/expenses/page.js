import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ExpensesList from "@/app/components/ExpensesList";

export default async function ExpensesPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's workspace
  const { data: workspaceMember } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .single();

  // Fetch expenses for the workspace WITH categories
  const { data: expenses } = await supabase
    .from("expenses")
    .select("*, categories(name, color))")
    .eq("workspace_id", workspaceMember.workspace_id)
    .order("day_of_month", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExpensesList expenses={expenses || []} />
      </div>
    </div>
  );
}
