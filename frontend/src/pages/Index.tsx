import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { RecentCourses } from "@/components/dashboard/RecentCourses";

const Index = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <WelcomeCard />
        <QuickActions />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingTasks />
          <RecentCourses />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
