import { Card } from "../ui/card";
import { BookOpen, Users, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { courseService, Course } from "../../services/courseService";
import { Skeleton } from "../ui/skeleton";
import { Progress } from "../ui/progress";

export function RecentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    courseService.getAll()
      .then(data => {
        // @ts-ignore
        const list = Array.isArray(data) ? data : (data.results || []);
        setCourses(list.slice(0, 3)); 
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6 space-y-4 border-none shadow-sm">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </Card>
    );
  }

  // Helper untuk warna acak icon buku
  const getIconColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500'];
    return colors[index % colors.length];
  }

  return (
    <Card className="p-6 h-full border-none shadow-sm bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Recent Courses</h3>
        <Link to="/courses" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {courses.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
             <BookOpen className="w-8 h-8 mx-auto text-gray-300 mb-2" />
             <p className="text-sm text-gray-500">No courses available.</p>
          </div>
        ) : (
          courses.map((course, index) => (
            <div
              key={course.id}
              onClick={() => navigate(`/courses/${course.id}`)}
              className="p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer bg-white group"
            >
              <div className="flex items-start gap-4">
                {/* Icon Box */}
                <div className={`p-3 rounded-lg ${getIconColor(index)} text-white shadow-sm flex-shrink-0`}>
                  <BookOpen className="h-6 w-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{course.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {course.lecturer_detail?.first_name 
                            ? `Dr. ${course.lecturer_detail.first_name} ${course.lecturer_detail.last_name}` 
                            : "Instructor"}
                        </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                        <span>Progress</span>
                        {/* Simulasi progress acak agar terlihat hidup */}
                        <span className="font-bold text-gray-800">{75 - (index * 10)}%</span>
                    </div>
                    <Progress value={75 - (index * 10)} className="h-1.5" />
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Users className="w-3.5 h-3.5" />
                        <span>{course.students_count || 30 + index * 5} students</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
                        Next: Mon, 10:00 AM
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}