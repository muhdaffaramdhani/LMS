import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Software Engineering",
    instructor: "Dr. Sarah Johnson",
    progress: 75,
    students: 42,
    nextClass: "Mon, 10:00 AM",
    color: "bg-lms-blue",
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    instructor: "Prof. Michael Chen",
    progress: 60,
    students: 38,
    nextClass: "Tue, 2:00 PM",
    color: "bg-lms-orange",
  },
  {
    id: 3,
    title: "Database Systems",
    instructor: "Dr. Emily Davis",
    progress: 82,
    students: 35,
    nextClass: "Wed, 9:00 AM",
    color: "bg-lms-coral",
  },
];

export function RecentCourses() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Courses</h3>
        <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-4 rounded-lg border border-border hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl ${course.color}`}>
                <svg className="h-5 w-5 text-card" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium">{course.title}</h4>
                <p className="text-sm text-muted-foreground">{course.instructor}</p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${course.color}`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {course.students} students
              </span>
              <span>Next: {course.nextClass}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
