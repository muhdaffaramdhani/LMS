import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { assignmentService, Assignment } from "@/services/assignmentService";
import { courseService, Course } from "@/services/courseService";
import { authService } from "@/services/authService";
import { Calendar, Clock, Plus, Trash2, Pencil, AlertCircle, Loader2, CheckCircle2, PlayCircle, Timer, Search } from "lucide-react";
import { format } from "date-fns";

type TaskStatus = "pending" | "in-progress" | "completed";

export default function Tasks() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Assignment[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", due_date: "", course: "" });
  const [taskStatuses, setTaskStatuses] = useState<Record<number, TaskStatus>>({});

  const user = authService.getUser();
  
  // ATURAN HAK AKSES
  const isAdmin = user?.role === 'admin';
  const isLecturer = user?.role === 'lecturer';
  
  // Admin: Bisa CRUD (Tambah, Edit, Hapus)
  // Lecturer: Hanya Bisa TAMBAH
  // Student: Hanya View & Ubah Status
  const canAdd = isAdmin || isLecturer;
  const canEditDelete = isAdmin; // Hanya admin yang bisa edit/hapus

  useEffect(() => {
    fetchData();
    const saved = localStorage.getItem('taskStatuses');
    if (saved) setTaskStatuses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredTasks(tasks);
    } else {
      const lower = searchQuery.toLowerCase();
      const filtered = tasks.filter(t => t.title.toLowerCase().includes(lower) || t.description.toLowerCase().includes(lower));
      setFilteredTasks(filtered);
    }
  }, [searchQuery, tasks]);

  const updateTaskStatus = (taskId: number, status: TaskStatus) => {
    const newStatuses = { ...taskStatuses, [taskId]: status };
    setTaskStatuses(newStatuses);
    localStorage.setItem('taskStatuses', JSON.stringify(newStatuses));
    toast({ title: "Status Diperbarui" });
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [tasksData, coursesData] = await Promise.all([assignmentService.getAll(), courseService.getAll()]);
      // @ts-ignore
      setTasks(Array.isArray(tasksData) ? tasksData : tasksData.results || []);
      // @ts-ignore
      setCourses(Array.isArray(coursesData) ? coursesData : coursesData.results || []);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        course: parseInt(formData.course),
        due_date: new Date(formData.due_date).toISOString() 
      };
      if (editingId) {
        await assignmentService.update(editingId, payload);
        toast({ title: "Tugas Diperbarui" });
      } else {
        await assignmentService.create(payload);
        toast({ title: "Tugas Dibuat" });
      }
      setIsDialogOpen(false);
      setEditingId(null);
      setFormData({ title: "", description: "", due_date: "", course: "" });
      fetchData();
    } catch (error) { toast({ title: "Gagal", variant: "destructive" }); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Hapus tugas?")) return;
    await assignmentService.delete(id);
    fetchData();
  };

  const handleEdit = (task: Assignment) => {
    setEditingId(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      due_date: task.due_date.substring(0, 16),
      course: task.course.toString()
    });
    setIsDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div><h1 className="text-2xl font-bold">Daftar Tugas</h1><p className="text-muted-foreground">Kelola tugas mahasiswa.</p></div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari tugas..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            
            {/* Tombol Tambah: Muncul untuk Admin & Lecturer */}
            {canAdd && (
              <Dialog open={isDialogOpen} onOpenChange={(open) => {setIsDialogOpen(open); if(!open) {setEditingId(null); setFormData({title:"", description:"", due_date:"", course:""})}}}>
                <DialogTrigger asChild><Button className="bg-lms-orange hover:bg-orange-600 whitespace-nowrap"><Plus className="w-4 h-4 mr-2" /> Buat Tugas</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingId ? "Edit" : "Buat"} Tugas</DialogTitle></DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <Input placeholder="Judul Tugas" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <Select value={formData.course} onValueChange={val => setFormData({...formData, course: val})}>
                        <SelectTrigger><SelectValue placeholder="Pilih Mata Kuliah" /></SelectTrigger>
                        <SelectContent>{courses.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input type="datetime-local" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} required />
                    <Textarea placeholder="Deskripsi" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    <DialogFooter><Button type="submit" disabled={isSubmitting}>Simpan</Button></DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* LIST TUGAS */}
        <div className="grid gap-4">
            {filteredTasks.map((task) => {
                const status = taskStatuses[task.id] || 'pending';
                return (
                    <Card key={task.id} className="p-6 hover:shadow-md transition-all border-l-4 border-l-lms-blue">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">{task.course_detail?.name || 'Umum'}</Badge>
                                    {/* Status Badge hanya untuk Student */}
                                    {!canAdd && (
                                        <Badge variant="outline" className={status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}>
                                            {status === 'completed' ? 'Selesai' : 'Pending'}
                                        </Badge>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg">{task.title}</h3>
                                <p className="text-muted-foreground text-sm">{task.description}</p>
                                <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {format(new Date(task.due_date), "dd MMM yyyy")}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 min-w-[160px] justify-center">
                                {/* Student: Ubah Status */}
                                {!canAdd && (
                                    <>
                                        <Button variant={status === 'pending' ? "default" : "outline"} size="sm" onClick={() => updateTaskStatus(task.id, 'pending')}><Timer className="w-4 h-4 mr-2" /> Pending</Button>
                                        <Button variant={status === 'completed' ? "default" : "outline"} size="sm" onClick={() => updateTaskStatus(task.id, 'completed')}><CheckCircle2 className="w-4 h-4 mr-2" /> Selesai</Button>
                                    </>
                                )}
                                
                                {/* Admin: Edit/Delete */}
                                {canEditDelete && (
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(task)}><Pencil className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(task.id)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
      </div>
    </MainLayout>
  );
}