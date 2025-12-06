import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { courseService, Course } from "@/services/courseService";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    courseService.getAll()
      .then(data => {
        // @ts-ignore
        const list = Array.isArray(data) ? data : (data.results || []);
        setCourses(list.slice(0, 3)); // Show top 3
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Courses</h3>
        <Link to="/courses" className="text-sm text-muted-foreground hover:text-lms-blue">
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {courses.length === 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
             <BookOpen className="w-8 h-8 mx-auto text-muted-foreground mb-2 opacity-50" />
             <p className="text-sm text-muted-foreground">No courses available.</p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/courses/${course.id}`)}
              className="p-3 rounded-lg border border-border hover:border-lms-blue hover:bg-accent/40 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-lms-blue/10 text-lms-blue group-hover:bg-lms-blue group-hover:text-white transition-colors">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate text-sm">{course.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {course.lecturer_detail?.first_name 
                      ? `Dr. ${course.lecturer_detail.first_name} ${course.lecturer_detail.last_name}` 
                      : "Instructor"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}