import { Card } from "@/components/ui/card";
import { authService } from "@/services/authService";
import { assignmentService } from "@/services/assignmentService"; // Import service assignment
import { useState, useEffect } from "react";

export function WelcomeCard() {
  const [user, setUser] = useState(authService.getUser());
  const [progress, setProgress] = useState(0); // Default 0, bukan dummy lagi

  useEffect(() => {
    // Fungsi untuk handle update user (login/logout/edit profile)
    const handleAuthChange = () => {
      setUser(authService.getUser());
    };

    // Fungsi untuk menghitung progress real
    const calculateProgress = async () => {
      try {
        // 1. Ambil semua tugas dari API
        const data = await assignmentService.getAll();
        // @ts-ignore (Handle pagination response structure if any)
        const tasks = Array.isArray(data) ? data : (data.results || []);

        if (tasks.length === 0) {
          setProgress(0);
          return;
        }

        // 2. Ambil status pengerjaan dari LocalStorage 
        // (Data ini sinkron dengan halaman Tasks)
        const savedStatuses = localStorage.getItem('taskStatuses');
        const taskStatuses = savedStatuses ? JSON.parse(savedStatuses) : {};

        // 3. Hitung berapa tugas yang statusnya 'completed'
        const completedCount = tasks.filter((task: any) => taskStatuses[task.id] === 'completed').length;
        
        // 4. Hitung persentase
        const percentage = Math.round((completedCount / tasks.length) * 100);
        setProgress(percentage);
        
      } catch (error) {
        console.error("Gagal menghitung progress:", error);
        setProgress(0);
      }
    };

    // Panggil perhitungan saat komponen dimuat
    calculateProgress();
    
    // Listeners
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-update', handleAuthChange);
    // Kita bisa tambahkan listener 'storage' untuk update progress real-time antar tab,
    // tapi calculateProgress juga perlu dipanggil jika user mengubah task di tab yang sama.
    // Untuk kesederhanaan, progress akan terupdate setiap kali halaman di-refresh atau komponen dimuat ulang.
    
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
            Selamat datang kembali! Tetap semangat belajar semester ini.
          </p>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Progress Penyelesaian Tugas</span>
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