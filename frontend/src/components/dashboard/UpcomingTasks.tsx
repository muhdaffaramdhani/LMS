import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { assignmentService, Assignment } from "@/services/assignmentService";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function UpcomingTasks() {
  const [tasks, setTasks] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    assignmentService.getAll()
      .then(data => {
        // @ts-ignore
        const list = Array.isArray(data) ? data : (data.results || []);
        // Ambil 3 tugas teratas
        setTasks(list.slice(0, 3)); 
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Tugas Mendatang</h3>
        <Link to="/tasks" className="text-sm text-muted-foreground hover:text-lms-blue">
          Lihat Semua
        </Link>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">Tidak ada tugas aktif.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => navigate("/tasks")} // Klik untuk ke halaman Tasks
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-lms-orange hover:bg-accent/40 transition-all cursor-pointer"
            >
              {/* Indikator Tanggal */}
              <div className="flex flex-col items-center justify-center w-12 h-12 bg-muted rounded-md text-xs">
                <span className="font-bold text-lms-blue">{format(new Date(task.due_date), "dd")}</span>
                <span className="text-[10px] uppercase text-muted-foreground">{format(new Date(task.due_date), "MMM")}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm truncate pr-2">{task.title}</h4>
                    <Badge variant="outline" className="text-[10px] h-5 px-1">Tugas</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {task.course_detail?.name || "Umum"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}