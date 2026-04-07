import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BudgetPageClient from "@/app/components/BudgetPageClient";
import SpendingTracker from "@/app/components/SpendingTracker";

export default async function BudgetPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: workspaceMember } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .single();

  // Fetch budgets with pay periods
  const { data: budgets } = await supabase
    .from("budgets")
    .select("*, budget_pay_periods(*)")
    .eq("workspace_id", workspaceMember.workspace_id)
    .order("month", { ascending: false });

  // Fetch expenses with categories
  const { data: expenses } = await supabase
    .from("expenses")
    .select("*, categories(name, color)")
    .eq("workspace_id", workspaceMember.workspace_id)
    .order("day_of_month", { ascending: true });

  return (
    <SpendingTracker>
      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <BudgetPageClient 
            budgets={budgets || []} 
            expenses={expenses || []}
          />
        </div>
      </div>
    </SpendingTracker>
  );
}