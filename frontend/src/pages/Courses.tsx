import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { useToast } from "../hooks/use-toast";
import { courseService, Course as CourseType } from "../services/courseService";
import { authService, UserData } from "../services/authService";
import { 
  Users, BookOpen, Search, Clock, FileText, Video, Star, Loader2, CheckCircle, Plus, Pencil, Trash2
} from "lucide-react";

export default function Courses() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [lecturers, setLecturers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'enrolled'
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [enrollLoading, setEnrollLoading] = useState<number | null>(null);

  // State untuk Dialog Add/Edit Course
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    code: "", 
    description: "", 
    duration_weeks: 12,
    lecturer: "" 
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const user = authService.getUser();
  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';

  // Fetch data setiap kali Tab berubah atau Search berubah
  useEffect(() => {
    fetchCourses();
    if (isAdmin) {
      fetchLecturers();
    }
  }, [activeTab, searchQuery]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      // Logic: Jika tab "enrolled", minta backend filter ?enrolled=true
      // Jika tab "all", minta semua.
      const isEnrolledTab = activeTab === "enrolled";
      const data = await courseService.getAll({ 
        enrolled: isEnrolledTab,
        search: searchQuery 
      });
      
      // @ts-ignore
      const list = Array.isArray(data) ? data : data.results || [];
      setCourses(list);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLecturers = async () => {
    try {
      const users = await authService.getAllUsers();
      setLecturers(users.filter((u: UserData) => u.role === 'lecturer'));
    } catch (error) {
      console.error("Failed to fetch lecturers", error);
    }
  };

  const handleEnroll = async (courseId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop click bubbling to card
    if (!isStudent) return;
    
    setEnrollLoading(courseId);
    try {
      await courseService.enroll(courseId);
      toast({ title: "Success", description: "Successfully enrolled in the course!" });
      
      // Refresh list agar status berubah
      fetchCourses();
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Failed to enroll.";
      toast({ title: "Enrollment Failed", description: msg, variant: "destructive" });
    } finally {
      setEnrollLoading(null);
    }
  };

  // --- Logic Tambahan untuk Admin (CRUD) ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('code', formData.code);
      data.append('description', formData.description);
      data.append('duration_weeks', formData.duration_weeks.toString());
      
      if (formData.lecturer) {
        data.append('lecturer', formData.lecturer);
      }

      if (imageFile) data.append('image', imageFile);

      if (editingId) {
        await courseService.update(editingId, data);
        toast({ title: "Success", description: "Course updated successfully" });
      } else {
        await courseService.create(data);
        toast({ title: "Success", description: "Course created successfully" });
      }
      setIsDialogOpen(false);
      fetchCourses();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save course", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
        await courseService.delete(id);
        fetchCourses();
        toast({ title: "Deleted", description: "Course removed" });
    } catch {
        toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const openEdit = (course: CourseType) => {
    setEditingId(course.id);
    setFormData({ 
      name: course.name, 
      code: course.code, 
      description: course.description,
      duration_weeks: course.duration_weeks || 12,
      lecturer: course.lecturer.toString()
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", code: "", description: "", duration_weeks: 12, lecturer: "" });
    setImageFile(null);
  };

  // Helper colors
  const getCourseColor = (id: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500'];
    return colors[id % colors.length];
  }

  return (
    <MainLayout>
      <div className="pb-10 mx-auto space-y-8 max-w-7xl animate-fade-in">
        
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === 'enrolled' ? 'My Learning' : 'Course Catalog'}
          </h1>
          <p className="text-gray-500">
            {activeTab === 'enrolled' ? 'Continue where you left off' : 'Explore new skills and knowledge'}
          </p>
          
          <div className="flex flex-col items-start justify-between gap-4 pt-4 md:flex-row md:items-center">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="p-1 bg-gray-100">
                <TabsTrigger value="all" className="px-6">All Courses</TabsTrigger>
                {isStudent && (
                  <TabsTrigger value="enrolled" className="px-6">My Courses</TabsTrigger>
                )}
              </TabsList>
            </Tabs>
            
            <div className="flex w-full gap-3 md:w-auto">
                <div className="relative flex-1 max-w-sm md:w-72">
                    <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                    <Input 
                        placeholder="Search courses..." 
                        className="bg-white border-gray-200 pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Tombol Add Course HANYA untuk Admin */}
                {isAdmin && (
                    <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 shadow-md hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" /> Add Course
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader><DialogTitle>{editingId ? "Edit" : "Add"} Course</DialogTitle></DialogHeader>
                            <form onSubmit={handleSubmit} className="py-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Course Code</label>
                                    <Input placeholder="e.g. CS101" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Duration (Weeks)</label>
                                    <Input type="number" min="1" value={formData.duration_weeks} onChange={e => setFormData({...formData, duration_weeks: parseInt(e.target.value)})} required />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Course Name</label>
                                  <Input placeholder="e.g. Intro to Python" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Assign Lecturer</label>
                                  <Select value={formData.lecturer} onValueChange={(val) => setFormData({...formData, lecturer: val})}>
                                    <SelectTrigger><SelectValue placeholder="Select Lecturer" /></SelectTrigger>
                                    <SelectContent>
                                      {lecturers.map(lecturer => (
                                        <SelectItem key={lecturer.id} value={lecturer.id.toString()}>
                                          {lecturer.first_name} {lecturer.last_name} ({lecturer.username})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Description</label>
                                  <Textarea placeholder="Course description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Course Image</label>
                                  <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="cursor-pointer" />
                                </div>
                                <DialogFooter><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Course"}</Button></DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin"/></div>
        ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {courses.length === 0 ? (
                  <div className="py-20 text-center col-span-full">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                    <p className="text-lg text-gray-500">No courses found.</p>
                    {activeTab === 'enrolled' && (
                      <Button variant="link" onClick={() => setActiveTab('all')} className="text-lms-blue">
                        Browse Catalog
                      </Button>
                    )}
                  </div>
                ) : courses.map((course) => (
                  <Card 
                    key={course.id} 
                    className="transition-all duration-300 bg-white border border-gray-100 shadow-sm cursor-pointer hover:shadow-lg group"
                    onClick={() => course.is_enrolled ? navigate(`/courses/${course.id}`) : null}
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-5">
                        <div className={`w-16 h-16 ${getCourseColor(course.id)} rounded-2xl flex items-center justify-center text-white shadow-md shrink-0`}>
                          <BookOpen className="w-8 h-8" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 transition-colors line-clamp-1 group-hover:text-blue-600">
                                {course.name}
                              </h3>
                              <p className="text-sm font-medium text-gray-500">
                                {course.code} • {course.lecturer_detail?.first_name || 'Dr.'} {course.lecturer_detail?.last_name || 'Teacher'}
                              </p>
                            </div>
                            {course.is_enrolled && (
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                                    Enrolled
                                </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                             <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" /> {course.students_count || 0} students
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">
                            {course.description}
                        </p>
                      </div>

                      {course.is_enrolled && (
                          <div className="mt-5">
                            <div className="flex justify-between text-xs font-semibold mb-1.5">
                                <span className="text-gray-500">Progress</span>
                                <span className="text-gray-900">0%</span>
                            </div>
                            <Progress value={0} className="h-2 bg-gray-100" />
                          </div>
                      )}

                      <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-gray-50">
                        <div className="text-center">
                            <FileText className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                            <p className="text-xs font-bold text-gray-700">--</p>
                            <p className="text-[10px] text-gray-400 uppercase font-semibold">Materials</p>
                        </div>
                        <div className="text-center border-l border-gray-100">
                            <Video className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                            <p className="text-xs font-bold text-gray-700">--</p>
                            <p className="text-[10px] text-gray-400 uppercase font-semibold">Tasks</p>
                        </div>
                        <div className="text-center border-l border-gray-100">
                            <Clock className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                            <p className="text-xs font-bold text-gray-700">{course.duration_weeks || 12} W</p>
                            <p className="text-[10px] text-gray-400 uppercase font-semibold">Duration</p>
                        </div>
                      </div>

                    </CardContent>

                    <CardFooter className="flex items-center justify-between px-6 pt-0 pb-6">
                        {/* Tombol Edit/Delete Khusus Admin */}
                        {isAdmin && (
                            <div className="flex gap-2 mr-2">
                                <Button variant="ghost" size="icon" className="text-gray-400 h-9 w-9 hover:text-blue-600" onClick={(e) => {e.stopPropagation(); openEdit(course)}}><Pencil className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-gray-400 h-9 w-9 hover:text-red-600" onClick={(e) => {e.stopPropagation(); handleDelete(course.id)}}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        )}

                        <div className="flex-1">
                            {course.is_enrolled ? (
                                <Button 
                                    className="w-full text-white bg-gray-900 hover:bg-black"
                                    onClick={() => navigate(`/courses/${course.id}`)}
                                >
                                    Enter Course
                                </Button>
                            ) : (
                                <Button 
                                    className={`w-full ${isStudent ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300'}`}
                                    disabled={!isStudent || enrollLoading === course.id}
                                    onClick={(e) => handleEnroll(course.id, e)}
                                >
                                    {enrollLoading === course.id ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <CheckCircle className="w-4 h-4 mr-2" /> 
                                    )}
                                    {isStudent ? "Enroll Now" : "Login as Student to Enroll"}
                                </Button>
                            )}
                        </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
        )}
      </div>
    </MainLayout>
  );
}