import SpendingTracker from "@/app/components/SpendingTracker";
import OverviewLayout from "@/app/components/OverviewLayout";

export default function OverviewPage() {
  return (
    <SpendingTracker>
    <div className="min-h-screen bg-white border border-gray-200 rounded-2xl">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <OverviewLayout />
    </div>
    </div>
    </SpendingTracker>
  );
}