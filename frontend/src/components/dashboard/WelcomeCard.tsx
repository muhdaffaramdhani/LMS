import { Card } from "@/components/ui/card";
import { authService } from "@/services/authService";
import { assignmentService } from "@/services/assignmentService"; 
import { useState, useEffect } from "react";

export function WelcomeCard() {
  const [user, setUser] = useState(authService.getUser());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(authService.getUser());
    };

    const calculateProgress = async () => {
      try {
        const data = await assignmentService.getAll();
        // @ts-ignore
        const tasks = Array.isArray(data) ? data : (data.results || []);

        if (tasks.length === 0) {
          setProgress(0);
          return;
        }

        const savedStatuses = localStorage.getItem('taskStatuses');
        const taskStatuses = savedStatuses ? JSON.parse(savedStatuses) : {};

        const completedCount = tasks.filter((task: any) => taskStatuses[task.id] === 'completed').length;
        
        const percentage = Math.round((completedCount / tasks.length) * 100);
        setProgress(percentage);
        
      } catch (error) {
        console.error("Failed to calculate progress:", error);
        setProgress(0);
      }
    };

    calculateProgress();
    
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-update', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-update', handleAuthChange);
    };
  }, []);

  const displayName = user?.first_name || user?.username || "User";

  return (
    <Card className="p-6 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1 capitalize">
            Hi {displayName} 👋
          </h2>
          <p className="text-primary-foreground/80 mb-6">
            Welcome back! Keep up the good work this semester.
          </p>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Task Completion Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="h-2.5 bg-primary-foreground/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-foreground rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="ml-6 hidden sm:block">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-primary-foreground/20"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${progress * 2.26} 226`}
                className="text-primary-foreground transition-all duration-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}