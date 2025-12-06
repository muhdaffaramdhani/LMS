import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { courseService, Course as CourseType } from "@/services/courseService";
import { authService } from "@/services/authService";
import { Users, BookOpen, Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";

export default function Courses() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [allCourses, setAllCourses] = useState<CourseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  
  // Form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const user = authService.getUser();
  // ATURAN: Hanya Admin yang boleh CRUD Course
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('code', formData.code);
      data.append('description', formData.description);
      if (imageFile) data.append('image', imageFile);

      if (editingId) {
        await courseService.update(editingId, data);
        toast({ title: "Sukses", description: "Kursus diperbarui" });
      } else {
        await courseService.create(data);
        toast({ title: "Sukses", description: "Kursus dibuat" });
      }
      setIsDialogOpen(false);
      fetchCourses();
    } catch (error) {
      toast({ title: "Gagal", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus kursus ini?")) return;
    try {
        await courseService.delete(id);
        fetchCourses();
        toast({ title: "Terhapus" });
    } catch {
        toast({ title: "Gagal hapus", variant: "destructive" });
    }
  };

  const openEdit = (course: CourseType) => {
    setEditingId(course.id);
    setFormData({ name: course.name, code: course.code, description: course.description });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", code: "", description: "" });
    setImageFile(null);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Daftar Kursus</h1>
            <p className="text-muted-foreground">Lihat materi dan modul pembelajaran.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Cari kursus..." 
                    className="pl-9 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Tombol Tambah Hanya Muncul untuk Admin */}
            {isAdmin && (
                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                <DialogTrigger asChild>
                    <Button className="bg-lms-blue hover:bg-blue-700 whitespace-nowrap">
                    <Plus className="w-4 h-4 mr-2" /> Tambah
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editingId ? "Edit" : "Tambah"} Kursus</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <Input placeholder="Kode (CS101)" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
                        <Input placeholder="Nama Kursus" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        <Textarea placeholder="Deskripsi" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                        <Input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                        <DialogFooter><Button type="submit" disabled={isSubmitting}>Simpan</Button></DialogFooter>
                    </form>
                </DialogContent>
                </Dialog>
            )}
          </div>
        </div>

        {/* Content Grid */}
        {isLoading ? <div className="flex justify-center py-12"><Loader2 className="animate-spin"/></div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow overflow-hidden cursor-pointer border-border/50" onClick={() => navigate(`/courses/${course.id}`)}>
                    <div className="h-40 bg-muted relative">
                        {course.image ? <img src={course.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-lms-blue/10"><BookOpen className="w-12 h-12 text-lms-blue/40"/></div>}
                        <Badge className="absolute top-4 right-4 bg-white/90 text-black">{course.code}</Badge>
                    </div>
                    <CardHeader>
                        <CardTitle className="line-clamp-1 text-lg">{course.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1 text-xs"><Users className="w-3 h-3" /> {course.lecturer_detail?.first_name ? `Dr. ${course.lecturer_detail.first_name}` : 'Dosen'}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1"><p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p></CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between items-center bg-muted/10">
                        <Button variant="outline" size="sm" onClick={(e) => {e.stopPropagation(); navigate(`/courses/${course.id}`)}}>Detail</Button>
                        {/* Tombol Edit/Hapus Hanya untuk Admin */}
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