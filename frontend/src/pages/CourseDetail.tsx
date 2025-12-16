import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { useToast } from "../hooks/use-toast";
import { courseService, Course } from "../services/courseService";
import { authService } from "../services/authService";
import { 
  BookOpen, Clock, Users, Calendar, CheckCircle, 
  FileText, PlayCircle, Lock, ArrowLeft, Loader2 
} from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  const user = authService.getUser();
  const isStudent = user?.role === 'student';

  useEffect(() => {
    if (id) fetchCourseDetail();
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      const data = await courseService.getById(Number(id));
      setCourse(data);
    } catch (error) {
      console.error("Failed to fetch course", error);
      toast({ title: "Error", description: "Course not found", variant: "destructive" });
      navigate("/courses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!course || !isStudent) return;
    
    setIsEnrolling(true);
    try {
      await courseService.enroll(course.id);
      toast({ title: "Success", description: "You have successfully enrolled!" });
      // Refresh data to update UI
      fetchCourseDetail();
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Enrollment failed";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return <MainLayout><div className="flex justify-center items-center h-[80vh]"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div></MainLayout>;
  }

  if (!course) return null;

  return (
    <MainLayout>
      <div className="max-w-6xl pb-10 mx-auto space-y-8 animate-fade-in">
        
        {/* Back Button */}
        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-blue-600" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
        </Button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="text-blue-700 bg-blue-100 hover:bg-blue-100">{course.code}</Badge>
                <span className="flex items-center gap-1 text-sm text-gray-500"><Clock className="w-3 h-3" /> {course.duration_weeks} Weeks</span>
              </div>
              <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{course.name}</h1>
              <p className="text-lg leading-relaxed text-gray-600">
                {course.description}
              </p>
            </div>

            {/* Tabs: Content, Assignments, People */}
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="justify-start w-full h-auto gap-6 p-0 bg-transparent border-b rounded-none">
                <TabsTrigger value="content" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-4 py-3">Course Content</TabsTrigger>
                <TabsTrigger value="assignments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-4 py-3">Assignments</TabsTrigger>
                <TabsTrigger value="people" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-4 py-3">Classmates</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="pt-6 space-y-4">
                {/* Dummy Materials List - In real app, fetch from /api/materials */}
                {course.is_enrolled ? (
                  <div className="space-y-3">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 text-blue-600 rounded bg-blue-50"><FileText className="w-5 h-5"/></div>
                            <div>
                              <CardTitle className="text-base">Introduction & Syllabus</CardTitle>
                              <CardDescription>Module 1 • PDF</CardDescription>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Download</Button>
                        </div>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 text-red-600 rounded bg-red-50"><PlayCircle className="w-5 h-5"/></div>
                            <div>
                              <CardTitle className="text-base">Understanding React Hooks</CardTitle>
                              <CardDescription>Module 2 • Video Lesson</CardDescription>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Watch</Button>
                        </div>
                      </CardHeader>
                    </Card>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg bg-gray-50">
                    <Lock className="w-10 h-10 mb-3 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900">Content Locked</h3>
                    <p className="text-gray-500">Enroll in this course to access materials.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="assignments" className="pt-6">
                 {course.is_enrolled ? (
                    <div className="py-10 text-center rounded-lg bg-gray-50">
                      <p className="text-gray-500">No active assignments due this week.</p>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg bg-gray-50">
                      <Lock className="w-10 h-10 mb-3 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900">Assignments Locked</h3>
                      <p className="text-gray-500">Enroll to view and submit assignments.</p>
                    </div>
                 )}
              </TabsContent>

              {/* NEW TAB: Classmates */}
              <TabsContent value="people" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Students Enrolled</CardTitle>
                    <CardDescription>Your learning peers in this course.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 p-4 mb-6 text-blue-700 rounded-lg bg-blue-50">
                      <Users className="w-5 h-5" />
                      <span className="font-semibold">{course.students_count || 0} Students total</span>
                    </div>
                    
                    {/* Dummy list because backend doesn't expose user list publicly yet */}
                    {course.students_count && course.students_count > 0 ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>S{i}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Student {i}</p>
                                <p className="text-xs text-gray-500">Enrolled recently</p>
                              </div>
                            </div>
                            {i === 1 && <Badge variant="outline">You</Badge>}
                          </div>
                        ))}
                        {/* If more than 3 */}
                        {(course.students_count || 0) > 3 && (
                          <p className="pt-2 text-sm text-center text-gray-500">
                            and {(course.students_count || 0) - 3} others...
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No other students yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Instructor & Enrollment Card */}
          <div className="space-y-6">
            <Card className="border-t-4 shadow-lg border-t-blue-600">
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Price</span>
                  <span className="text-2xl font-bold text-gray-900">Free</span>
                </div>
                
                <div className="space-y-3">
                  {course.is_enrolled ? (
                    <Button className="w-full text-white bg-green-600 cursor-default hover:bg-green-700" size="lg">
                      <CheckCircle className="w-5 h-5 mr-2" /> Enrolled
                    </Button>
                  ) : (
                    <Button 
                      className="w-full text-white transition-all bg-blue-600 shadow-md hover:bg-blue-700 hover:shadow-lg" 
                      size="lg"
                      onClick={handleEnroll}
                      disabled={isEnrolling || !isStudent}
                    >
                      {isEnrolling ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enroll Now"}
                    </Button>
                  )}
                  
                  {!isStudent && !course.is_enrolled && (
                    <p className="text-xs text-center text-red-500">Login as student to enroll</p>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">This course includes:</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-center gap-3"><FileText className="w-4 h-4 text-blue-500" /> Study Materials</li>
                    <li className="flex items-center gap-3"><Users className="w-4 h-4 text-blue-500" /> Peer Discussions</li>
                    <li className="flex items-center gap-3"><Calendar className="w-4 h-4 text-blue-500" /> Weekly Assignments</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Instructor</CardTitle>
              </CardHeader>
              <CardContent className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${course.lecturer_detail?.first_name}+${course.lecturer_detail?.last_name}`} />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">
                    {course.lecturer_detail?.first_name} {course.lecturer_detail?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">Lecturer</p>
                  <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                    Expert in Web Development and Computer Science.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}