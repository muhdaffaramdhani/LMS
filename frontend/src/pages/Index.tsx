import { MainLayout } from "../components/layout/MainLayout";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import RecentCourses from "../components/dashboard/RecentCourses";
import UpcomingTasks from "../components/dashboard/UpcomingTasks";
import QuickActions from "../components/dashboard/QuickActions";

export default function Index() {
  return (
    <MainLayout>
      <div className="pb-10 mx-auto space-y-6 max-w-7xl animate-fade-in">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your learning progress.
          </p>
        </div>

        <WelcomeCard />
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <RecentCourses />
            <UpcomingTasks />
          </div>
          <div className="space-y-6">
            <QuickActions />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}