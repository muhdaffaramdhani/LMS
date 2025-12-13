import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { assignmentService, Assignment } from "../../services/assignmentService";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { Calendar } from "lucide-react";

export function UpcomingTasks() {
  const [tasks, setTasks] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    assignmentService.getAll()
      .then(data => {
        // @ts-ignore
        const list = Array.isArray(data) ? data : (data.results || []);
        setTasks(list.slice(0, 3)); 
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6 space-y-4 h-full border-none shadow-sm">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full border-none shadow-sm bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Upcoming Tasks</h3>
        <Link to="/tasks" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-sm text-gray-500">No active tasks.</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task.id}
              onClick={() => navigate("/tasks")}
              className="flex flex-col p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer bg-white group"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {task.title}
                </h4>
                {/* Simulasi Priority Badge berdasarkan index */}
                <Badge variant="secondary" className={`
                    text-[10px] px-2 py-0.5 rounded-md font-semibold
                    ${index === 0 ? 'bg-red-50 text-red-600' : 
                      index === 1 ? 'bg-orange-50 text-orange-600' : 
                      'bg-blue-50 text-blue-600'}
                `}>
                    {index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low'}
                </Badge>
              </div>
              
              <p className="text-xs text-gray-500 mb-3 font-medium">
                  {task.course_detail?.name || "General Task"}
              </p>

              <div className="flex items-center text-xs text-gray-400 gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{format(new Date(task.due_date), "MMM dd, yyyy")}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{format(new Date(task.due_date), "HH:mm a")}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}