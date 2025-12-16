import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, CalendarDays, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { format } from "date-fns";

interface Task {
  id: number;
  title: string;
  course_detail?: {
    code: string;
    name: string;
  };
  due_date: string;
  status?: string; // Backend mungkin belum kirim status submission, kita asumsikan 'pending' dulu
}

export default function UpcomingTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/assignments/');
        // @ts-ignore
        const data = Array.isArray(response.data) ? response.data : response.data.results || [];
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800">Upcoming Tasks</CardTitle>
          <Badge variant="outline" className="font-normal text-gray-500">
            {tasks.length} Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500/50" />
            <p>There are no pending tasks.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 transition-all border rounded-lg border-gray-50 bg-gray-50/50 hover:bg-white hover:border-blue-100 hover:shadow-sm group"
            >
              <div className="mt-1 text-orange-500">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal bg-white border-gray-200">
                    {/* Fallback jika course detail belum ada di serializer */}
                    Course Task
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <CalendarDays className="w-3 h-3" /> 
                    {new Date(task.due_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}