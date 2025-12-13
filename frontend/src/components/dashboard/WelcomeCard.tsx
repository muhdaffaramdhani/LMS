import { Card } from "../ui/card";
import { authService } from "../../services/authService";
import { assignmentService } from "../../services/assignmentService"; 
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
        // Mengambil semua tugas untuk menghitung persentase simulasi
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
        
        // Kalkulasi sederhana
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

  // Radius dan circumference untuk lingkaran progress SVG
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-sm relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex-1 space-y-2">
          <h2 className="text-3xl font-bold text-gray-800 capitalize">
            Hi {displayName} 👋
          </h2>
          <p className="text-gray-500">
            Welcome back! You're doing great this semester.
          </p>

          <div className="mt-6 max-w-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Overall Progress</span>
              <span className="text-sm font-bold text-gray-800">{progress}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Circular Progress Indicator (Desktop) */}
        <div className="hidden md:block relative w-32 h-32 flex-shrink-0">
           {/* Background Circle */}
           <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            {/* Progress Circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-gray-900 transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-2xl font-bold text-gray-900">{progress}%</span>
          </div>
        </div>
      </div>
      
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2"></div>
    </Card>
  );
}