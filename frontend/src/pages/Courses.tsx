import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { courseService, Course as CourseType } from "@/services/courseService";
import { authService, UserData } from "@/services/authService";
import { Users, BookOpen, Plus, Pencil, Trash2, Loader2, Search, Clock } from "lucide-react";

export default function Courses() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [allCourses, setAllCourses] = useState<CourseType[]>([]);
  const [lecturers, setLecturers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  
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

  // 1. Sinkronisasi Search dengan URL
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

  // Filter logic
  useEffect(() => {
    if (!searchQuery) {
        setCourses(allCourses);
    } else {
        const lower = searchQuery.toLowerCase();
        const filtered = allCourses.filter(c => 
            c.name.toLowerCase().includes(lower) || 
            c.code.toLowerCase().includes(lower) ||
            c.description.toLowerCase().includes(lower)
        );
        setCourses(filtered);
    }
  }, [searchQuery, allCourses]);

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
      // Filter only lecturers
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
      
      // Admin memilih lecturer, jika edit dan tidak berubah, jangan kirim ulang jika tidak perlu
      // Namun untuk simplifikasi kita kirim ID lecturer
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

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">All Courses</h1>
            <p className="text-muted-foreground">Browse learning materials and modules.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search courses..." 
                    className="pl-9 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {isAdmin && (
                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                <DialogTrigger asChild>
                    <Button className="bg-lms-blue hover:bg-blue-700 whitespace-nowrap">
                    <Plus className="w-4 h-4 mr-2" /> Add Course
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader><DialogTitle>{editingId ? "Edit" : "Add"} Course</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select Lecturer" />
                            </SelectTrigger>
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
                          <p className="text-xs text-muted-foreground">Upload a cover image for this course.</p>
                        </div>

                        <DialogFooter><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Course"}</Button></DialogFooter>
                    </form>
                </DialogContent>
                </Dialog>
            )}
          </div>
        </div>

        {isLoading ? <div className="flex justify-center py-12"><Loader2 className="animate-spin"/></div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground">No courses found matching your search.</div>
                ) : courses.map((course) => (
                <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow overflow-hidden cursor-pointer border-border/50" onClick={() => navigate(`/courses/${course.id}`)}>
                    <div className="h-40 bg-muted relative">
                        {course.image ? <img src={course.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-lms-blue/10"><BookOpen className="w-12 h-12 text-lms-blue/40"/></div>}
                        <Badge className="absolute top-4 right-4 bg-white/90 text-black shadow-sm font-bold">{course.code}</Badge>
                    </div>
                    <CardHeader>
                        <CardTitle className="line-clamp-1 text-lg">{course.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                          <Users className="w-3 h-3" /> 
                          {course.lecturer_detail?.first_name ? `Dr. ${course.lecturer_detail.first_name} ${course.lecturer_detail.last_name}` : 'Instructor'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {course.duration_weeks || 12} Weeks</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {course.students_count || 0} Students</span>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between items-center bg-muted/10">
                        <Button variant="outline" size="sm" onClick={(e) => {e.stopPropagation(); navigate(`/courses/${course.id}`)}}>View Details</Button>
                        {isAdmin && (
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); openEdit(course)}}><Pencil className="w-3 h-3 text-blue-600" /></Button>
                                <Button variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); handleDelete(course.id)}}><Trash2 className="w-3 h-3 text-red-600" /></Button>
                            </div>
                        )}
                    </CardFooter>
                </Card>
                ))}
            </div>
        )}
      </div>
    </MainLayout>
  );
}