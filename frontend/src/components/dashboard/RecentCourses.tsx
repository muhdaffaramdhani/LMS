import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { courseService, Course } from "@/services/courseService";
import { Skeleton } from "@/components/ui/skeleton";

const RecentCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getCourses();
        // Ambil 3 kursus terbaru (atau 3 pertama)
        setCourses(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch recent courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Recent Courses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Recent Courses</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/courses" className="text-primary hover:text-primary/80">
            View All <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {courses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No courses available yet.</p>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center p-3 space-x-4 transition-colors border rounded-lg hover:bg-muted/50"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{course.title}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  {course.duration || "Self-paced"}
                </div>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/courses/${course.id}`}>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentCourses;