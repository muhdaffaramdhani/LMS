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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { useToast } from "../hooks/use-toast";
import { courseService, Course as CourseType } from "../services/courseService";
import { authService, UserData } from "../services/authService";
import { 
  Users, 
  BookOpen, 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  Search, 
  Clock, 
  FileText, 
  Video,
  Star
} from "lucide-react";

export default function Courses() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [allCourses, setAllCourses] = useState<CourseType[]>([]);
  const [lecturers, setLecturers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [activeTab, setActiveTab] = useState("all");
  
  // Form State
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
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    fetchCourses();
    if (isAdmin) {
      fetchLecturers();
    }
  }, []);

  useEffect(() => {
    let filtered = allCourses;

    // Filter Search
    if (searchQuery) {
        const lower = searchQuery.toLowerCase();
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(lower) || 
            c.code.toLowerCase().includes(lower) ||
            c.description.toLowerCase().includes(lower)
        );
    }

    // Filter Tabs (Simulasi karena backend belum support status)
    if (activeTab === "completed") {
        // Simulasi kosong atau filter logic jika ada field status
        filtered = []; 
    }
    // "ongoing" dan "all" kita anggap sama untuk sekarang karena data dummy

    setCourses(filtered);
  }, [searchQuery, allCourses, activeTab]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const data = await courseService.getAll();
      // @ts-ignore
      const list = Array.isArray(data) ? data : data.results || [];
      setAllCourses(list);
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

  // Helper untuk warna ikon buku (Simulasi visual agar variatif)
  const getCourseColor = (id: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500'];
    return colors[id % colors.length];
  }

  // Helper simulasi rating
  const getRating = (id: number) => (4 + (id % 10) / 10).toFixed(1);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
        
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500">Manage and track your enrolled courses</p>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
            {/* Tabs Filter */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="bg-gray-100 p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-6">All Courses</TabsTrigger>
                <TabsTrigger value="ongoing" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-6">Ongoing</TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-6">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Search & Add */}
            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search courses, tasks..." 
                        className="pl-9 bg-white border-gray-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {isAdmin && (
                    <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
                                <Plus className="w-4 h-4 mr-2" /> Add Course
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader><DialogTitle>{editingId ? "Edit" : "Add"} Course</DialogTitle></DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                {/* Form content same as before */}
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
        {isLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-blue-500"/></div> : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.length === 0 ? (
                  <div className="col-span-full py-20 text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-500 text-lg">No courses found.</p>
                  </div>
                ) : courses.map((course) => (
                  <Card key={course.id} className="border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 bg-white group overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex gap-5">
                        {/* Icon Box */}
                        <div className={`w-16 h-16 ${getCourseColor(course.id)} rounded-2xl flex items-center justify-center text-white shadow-md shrink-0`}>
                          <BookOpen className="w-8 h-8" />
                        </div>
                        
                        {/* Header Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                {course.name}
                              </h3>
                              <p className="text-sm text-gray-500 font-medium">{course.code} • Dr. {course.lecturer_detail?.last_name || "Smith"}</p>
                            </div>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-semibold px-2">
                                Ongoing
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                             <div className="flex items-center gap-1 text-orange-400 font-bold">
                                <Star className="w-3.5 h-3.5 fill-current" /> {getRating(course.id)}
                             </div>
                             <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" /> {course.students_count || 42} students
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                            {course.description}
                        </p>
                      </div>

                      {/* Progress Section */}
                      <div className="mt-5">
                        <div className="flex justify-between text-xs font-semibold mb-1.5">
                            <span className="text-gray-500">Course Progress</span>
                            <span className="text-gray-900">75%</span>
                        </div>
                        <Progress value={75} className="h-2 bg-gray-100" />
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-50">
                        <div className="text-center">
                            <FileText className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                            <p className="text-xs font-bold text-gray-700">45</p>
                            <p className="text-[10px] text-gray-400 uppercase font-semibold">Materials</p>
                        </div>
                        <div className="text-center border-l border-gray-100">
                            <Video className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                            <p className="text-xs font-bold text-gray-700">12</p>
                            <p className="text-[10px] text-gray-400 uppercase font-semibold">Assignments</p>
                        </div>
                        <div className="text-center border-l border-gray-100">
                            <Clock className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                            <p className="text-xs font-bold text-gray-700">{course.duration_weeks || 16} Weeks</p>
                            <p className="text-[10px] text-gray-400 uppercase font-semibold">Duration</p>
                        </div>
                      </div>

                    </CardContent>

                    <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between">
                        <div className="text-xs text-gray-400 font-medium">
                            Next class: <span className="text-gray-600">Monday, 10:00 AM</span>
                        </div>
                        <div className="flex gap-2">
                             {isAdmin && (
                                <>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-blue-600" onClick={(e) => {e.stopPropagation(); openEdit(course)}}><Pencil className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-red-600" onClick={(e) => {e.stopPropagation(); handleDelete(course.id)}}><Trash2 className="w-4 h-4" /></Button>
                                </>
                             )}
                            <Button 
                                className="bg-gray-900 hover:bg-black text-white px-5 rounded-lg shadow-lg hover:shadow-xl transition-all"
                                onClick={() => navigate(`/courses/${course.id}`)}
                            >
                                Enter Course
                            </Button>
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