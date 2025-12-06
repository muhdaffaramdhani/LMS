import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const tasks = [
  {
    id: 1,
    title: "Final Project Report",
    course: "Software Engineering",
    date: "Oct 25, 2025",
    time: "11:59 PM",
    priority: "high",
    color: "bg-lms-coral",
  },
  {
    id: 2,
    title: "Weekly Quiz Chapter 5",
    course: "Data Structures",
    date: "Oct 24, 2025",
    time: "3:00 PM",
    priority: "medium",
    color: "bg-lms-orange",
  },
  {
    id: 3,
    title: "Lab Assignment 4",
    course: "Database Systems",
    date: "Oct 26, 2025",
    time: "5:00 PM",
    priority: "low",
    color: "bg-lms-green",
  },
];

const priorityColors = {
  high: "bg-lms-coral text-card",
  medium: "bg-lms-orange text-card",
  low: "bg-lms-green text-card",
};

export function UpcomingTasks() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
        <Link to="/tasks" className="text-sm text-muted-foreground hover:text-foreground">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className={`w-1 h-full min-h-[60px] rounded-full ${task.color}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-muted-foreground">{task.course}</p>
                </div>
                <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                  {task.priority}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {task.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
