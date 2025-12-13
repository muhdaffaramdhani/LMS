import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { courseService, Course } from "../services/courseService";
import { assignmentService, Assignment } from "../services/assignmentService";
import { authService, UserData } from "../services/authService";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { ArrowLeft, Users, BookOpen, Clock, FileText, CheckCircle2, Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import api from "../lib/axios";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State Initialization
  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]); 
  const [allStudents, setAllStudents] = useState<UserData[]>([]); 
  const [selectedStudent, setSelectedStudent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrollLoading, setIsEnrollLoading] = useState(false);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const user = authService.getUser();
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';
  const isLecturer = user?.role === 'lecturer';

  useEffect(() => {
    if (id) {
      fetchCourseData();
      checkEnrollment();
      if (isAdmin || isLecturer) {
        fetchStudentsData();
      }
    }
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const courseData = await courseService.getById(id!);
      setCourse(courseData);

      try {
        const matsResponse = await api.get(`/materials/?course=${id}`);
        const matsData = matsResponse.data;
        const matsList = Array.isArray(matsData) ? matsData : (matsData?.results || []);
        setMaterials(matsList);
        
        const tasksResponse = await assignmentService.getAll();
        // @ts-ignore
        const tasksData = tasksResponse; 
        const tasksList = Array.isArray(tasksData) ? tasksData : (tasksData?.results || []);
        const filteredTasks = tasksList.filter((t: any) => t.course === parseInt(id!));
        setAssignments(filteredTasks);

      } catch (e) {
        setMaterials([]);
        setAssignments([]);
      }

    } catch (err) {
      console.error("Critical error fetching course:", err);
      toast({ title: "Error", description: "Failed to load course details.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentsData = async () => {
    try {
      const enrollResponse = await api.get(`/enrollments/?course=${id}`);
      const enrollList = Array.isArray(enrollResponse.data) ? enrollResponse.data : (enrollResponse.data.results || []);
      setEnrolledStudents(enrollList);

      const users = await authService.getAllUsers();
      if (Array.isArray(users)) {
        setAllStudents(users.filter((u: UserData) => u.role === 'student'));
      }
    } catch (e) {
      console.error("Failed to fetch students data", e);
    }
  };

  const availableStudents = allStudents.filter(student => 
    !enrolledStudents.some(enrolled => enrolled.student === student.id)
  );

  const checkEnrollment = async () => {
    if (!user || !id) return;
    try {
      const enrollments: any = await courseService.checkEnrollment();
      const list = Array.isArray(enrollments) ? enrollments : (enrollments.results || []);
      const found = list.find((e: any) => e.course === parseInt(id) && e.student === user.id);
      setIsEnrolled(!!found);
    } catch (e) {
      console.error("Enrollment check failed", e);
    }
  };

  const handleEnrollSelf = async () => {
    if (!id) return;
    try {
      await courseService.enrollStudent(parseInt(id));
      setIsEnrolled(true);
      toast({ title: "Enrolled", description: "You have successfully joined this course." });
      fetchCourseData(); 
    } catch (error) {
      toast({ title: "Error", description: "Failed to enroll.", variant: "destructive" });
    }
  };

  const handleAdminEnroll = async () => {
    if (!id || !selectedStudent) return;
    
    setIsEnrollLoading(true);
    try {
      await courseService.enrollStudent(parseInt(id), parseInt(selectedStudent));
      toast({ title: "Success", description: "Student enrolled successfully." });
      setSelectedStudent("");
      setIsEnrollDialogOpen(false); 
      
      await fetchStudentsData(); 
      await fetchCourseData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to enroll student.", variant: "destructive" });
    } finally {
      setIsEnrollLoading(false);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin w-8 h-8 text-lms-blue" />
    </div>
  );

  if (!course) return <div className="p-8 text-center">Course not found</div>;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto animate-fade-in pb-10">
        <Button variant="ghost" onClick={() => navigate('/courses')} className="mb-4 pl-0 hover:pl-2 transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Cover Image */}
            <div className="relative h-64 rounded-xl overflow-hidden bg-muted shadow-sm border border-border/50">
              {course.image ? (
                <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                  <BookOpen className="w-16 h-16 text-blue-200" />
                </div>
              )}
            </div>

            {/* Title & Badge */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {course.code}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {course.duration_weeks || 12} Weeks
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
              
              {/* Tabs Content */}
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="assignments">Assignments</TabsTrigger>
                  {(isAdmin || isLecturer) && <TabsTrigger value="students">Students</TabsTrigger>}
                </TabsList>
                
                <TabsContent value="overview" className="mt-4 space-y-4 animate-in fade-in-50">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">About Course</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {course.description}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="materials" className="mt-4 animate-in fade-in-50">
                  {(!isEnrolled && !isAdmin && !isLecturer) ? (
                    <div className="p-8 text-center border rounded-lg bg-muted/20">
                      <p className="text-muted-foreground">You must enroll in this course to view materials.</p>
                    </div>
                  ) : (materials?.length || 0) === 0 ? (
                    <div className="p-8 text-center border rounded-lg bg-muted/20">
                      <p className="text-muted-foreground">No materials uploaded yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {materials?.map((mat: any) => (
                        <Card key={mat.id} className="p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors">
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{mat.title}</h4>
                            <a href={mat.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">Download / View</a>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="assignments" className="mt-4 animate-in fade-in-50">
                  {(!isEnrolled && !isAdmin && !isLecturer) ? (
                    <div className="p-8 text-center border rounded-lg bg-muted/20">
                      <p className="text-muted-foreground">You must enroll in this course to view assignments.</p>
                    </div>
                  ) : (assignments?.length || 0) === 0 ? (
                    <div className="p-8 text-center border rounded-lg bg-muted/20">
                      <p className="text-muted-foreground">No active assignments.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {assignments?.map((task: any) => (
                        <Card key={task.id} className="p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors">
                          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{task.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              Due: {task.due_date ? format(new Date(task.due_date), "dd MMM yyyy") : "No Due Date"}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => navigate('/tasks')}>View</Button>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* TAB STUDENTS (Admin/Lecturer Only) */}
                {(isAdmin || isLecturer) && (
                  <TabsContent value="students" className="mt-4 animate-in fade-in-50">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Enrolled Students ({enrolledStudents.length})</h3>
                      </div>
                      
                      {enrolledStudents.length === 0 ? (
                        <div className="p-8 text-center border rounded-lg bg-muted/20">
                          <p className="text-muted-foreground">No students enrolled yet.</p>
                        </div>
                      ) : (
                        enrolledStudents.map((enroll) => (
                          <Card key={enroll.id} className="p-3 flex items-center justify-between hover:bg-accent/20">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                {enroll.student_detail?.first_name?.[0] || "S"}
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {enroll.student_detail?.first_name} {enroll.student_detail?.last_name}
                                </p>
                                <p className="text-xs text-muted-foreground">@{enroll.student_detail?.username}</p>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Joined: {format(new Date(enroll.created_at), "dd MMM yyyy")}
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>

          {/* Sidebar Right */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lecturer</CardTitle> 
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    {course.lecturer_detail?.first_name?.[0] || "L"}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">
                      {course.lecturer_detail?.first_name 
                        ? `${course.lecturer_detail.first_name} ${course.lecturer_detail.last_name || ''}` 
                        : "Unknown Lecturer"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">@{course.lecturer_detail?.username || "unknown"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Course Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" /> Students Enrolled
                  </div>
                  <span className="font-medium">{course.students_count || enrolledStudents.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" /> Duration
                  </div>
                  <span className="font-medium">{course.duration_weeks || 12} Weeks</span>
                </div>
              </CardContent>
            </Card>

            {/* ACTION BUTTONS */}
            {isStudent && !isEnrolled && (
              <Button className="w-full bg-lms-blue hover:bg-blue-700" onClick={handleEnrollSelf}>
                Enroll Now
              </Button>
            )}

            {isStudent && isEnrolled && (
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setActiveTab("materials")}>
                Start Learning
              </Button>
            )}

            {isAdmin && (
              <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Enroll Student (Admin)
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enroll a Student</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    {availableStudents.length === 0 ? (
                      <div className="text-center p-4 bg-muted/30 rounded">
                        <p className="text-sm text-muted-foreground">All students are already enrolled.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select Student</label>
                        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Student to Enroll" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableStudents.map(s => (
                              <SelectItem key={s.id} value={s.id.toString()}>
                                {s.first_name} {s.last_name} ({s.username})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleAdminEnroll} 
                      disabled={!selectedStudent || isEnrollLoading}
                    >
                      {isEnrollLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Enroll Student
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}