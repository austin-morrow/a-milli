import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BudgetLayout from "@/app/components/BudgetLayout";
import PayPeriodsList from "@/app/components/PayPeriodsList";
import SpendingTracker from "@/app/components/SpendingTracker";

export default async function BudgetPage() {
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

  // Fetch budgets with pay periods
  const { data: budgets } = await supabase
    .from("budgets")
    .select("*, budget_pay_periods(*)")
    .eq("workspace_id", workspaceMember.workspace_id)
    .order("month", { ascending: false });

  // Get current selected budget (you might want to pass this as a query param later)
  const currentDate = new Date();
  const currentMonth = budgets?.find((b) => {
    const budgetDate = new Date(b.month);
    return (
      budgetDate.getMonth() === currentDate.getMonth() &&
      budgetDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const selectedBudget = currentMonth || budgets?.[0];

  return (
    <SpendingTracker>
      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left: Budget Layout - takes 3 columns */}
            <div className="lg:col-span-3">
              <BudgetLayout budgets={budgets || []} />
            </div>

            {/* Right: Pay Periods - takes 1 column */}
            <div className="lg:col-span-1">
              {selectedBudget ? (
                <PayPeriodsList
                  budgetId={selectedBudget.id}
                  payPeriods={selectedBudget.budget_pay_periods || []}
                />
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Pay Dates
                  </h3>
                  <p className="text-xs text-gray-500">
                    Select a budget to add pay dates
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SpendingTracker>
  );
}
