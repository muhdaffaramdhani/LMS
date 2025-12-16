import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight, Loader2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { courseService, Course } from "@/services/courseService";
import { authService } from "@/services/authService";

export default function RecentCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = authService.getUser();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const data = await courseService.getAll({ enrolled: true });
        // @ts-ignore
        const list = Array.isArray(data) ? data : data.results || [];
        setCourses(list.slice(0, 3)); 
      } catch (error) {
        console.error("Failed to fetch recent courses", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchMyCourses();
    }
  }, [user]);

  const getCourseColor = (id: number) => {
    const colors = ['bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600', 'bg-emerald-100 text-emerald-600', 'bg-orange-100 text-orange-600'];
    return colors[id % colors.length];
  }

  return (
    <Card className="border-gray-100 shadow-sm col-span-full lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-gray-800">
          {user?.role === 'student' ? 'My Courses' : 'Courses newly added'}
        </CardTitle>
        <Button variant="ghost" className="h-auto p-0 text-sm font-normal text-blue-600 hover:text-blue-700" onClick={() => navigate('/courses')}>
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="py-8 text-center text-gray-500 border border-dashed rounded-lg bg-gray-50">
            <p className="text-sm">No courses taken yet.</p>
            <Button variant="link" onClick={() => navigate('/courses')} className="mt-2 text-blue-600">
              Search Courses
            </Button>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="flex items-center gap-4 p-3 transition-all border border-transparent cursor-pointer group rounded-xl hover:bg-gray-50 hover:border-gray-100" onClick={() => navigate(`/courses/${course.id}`)}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${getCourseColor(course.id)}`}>
                <BookOpen className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate transition-colors group-hover:text-blue-600">
                  {course.name}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">{course.code}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {course.students_count || 0} Siswa
                  </span>
                </div>
              </div>

              <div className="text-right">
                 <Badge variant="secondary" className="text-gray-600 bg-white border border-gray-200">
                    Active
                 </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}