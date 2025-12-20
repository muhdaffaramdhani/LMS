import { useState, useEffect } from "react";
// Menggunakan path yang lebih eksplisit untuk menghindari error resolusi
import { MainLayout } from "../../src/components/layout/MainLayout";
import { Card, CardContent } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Textarea } from "../../src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../src/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../src/components/ui/dialog";
import { Badge } from "../../src/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../src/components/ui/tabs";
import { useToast } from "../../src/hooks/use-toast";
import { assignmentService, Assignment } from "../../src/services/assignmentService";
import { courseService, Course } from "../../src/services/courseService";
import { authService } from "../../src/services/authService";
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Pencil, 
  Loader2, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from "lucide-react";
import { format } from "date-fns";

// Status type definition
type TaskStatus = "pending" | "in-progress" | "completed";

export default function Tasks() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Assignment[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", due_date: "", course: "" });
  
  // Local State for Student Progress (Simulated)
  const [taskStatuses, setTaskStatuses] = useState<Record<number, TaskStatus>>({});

  const user = authService.getUser();
  const isAdmin = user?.role === 'admin';
  const isLecturer = user?.role === 'lecturer';
  const canAdd = isAdmin || isLecturer;

  useEffect(() => {
    fetchData();
    const saved = localStorage.getItem('taskStatuses');
    if (saved) setTaskStatuses(JSON.parse(saved));
  }, []);

  // Filter Logic based on Tab and Search
  useEffect(() => {
    let result = tasks;

    // 1. Filter by Search
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(lower) || 
        t.description.toLowerCase().includes(lower)
      );
    }

    // 2. Filter by Tab Status
    if (activeTab !== "all") {
      result = result.filter(t => {
        const status = taskStatuses[t.id] || "pending";
        return status === activeTab;
      });
    }

    setFilteredTasks(result);
  }, [searchQuery, tasks, activeTab, taskStatuses]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [tasksData, coursesData] = await Promise.all([assignmentService.getAll(), courseService.getAll()]);
      // @ts-ignore
      setTasks(Array.isArray(tasksData) ? tasksData : tasksData.results || []);
      // @ts-ignore
      setCourses(Array.isArray(coursesData) ? coursesData : coursesData.results || []);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const updateTaskStatus = (taskId: number, status: TaskStatus) => {
    const newStatuses = { ...taskStatuses, [taskId]: status };
    setTaskStatuses(newStatuses);
    localStorage.setItem('taskStatuses', JSON.stringify(newStatuses));
    toast({ title: "Status Updated", description: `Task marked as ${status.replace('-', ' ')}` });
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
        toast({ title: "Task Updated", description: "Changes saved successfully." });
      } else {
        await assignmentService.create(payload);
        toast({ title: "Task Created", description: "New assignment added." });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) { 
      toast({ title: "Error", description: "Failed to save task.", variant: "destructive" }); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Are you sure you want to delete this task?")) return;
    try {
        await assignmentService.delete(id);
        toast({ title: "Task Deleted" });
        fetchData();
    } catch (error) {
        toast({ title: "Error", description: "Failed to delete task.", variant: "destructive" });
    }
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

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", due_date: "", course: "" });
  };

  // Helper for Summary Counts
  const getCount = (status: TaskStatus) => {
    return tasks.filter(t => (taskStatuses[t.id] || "pending") === status).length;
  };

  const getPriorityBadge = (id: number) => {
    const priorities = ["High", "Medium", "Low"];
    const colors = ["bg-red-100 text-red-700", "bg-orange-100 text-orange-700", "bg-blue-100 text-blue-700"];
    const index = id % 3;
    return <Badge variant="outline" className={`text-[10px] px-2 border-0 ${colors[index]}`}>{priorities[index]}</Badge>;
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {children}
    </label>
  );

  return (
    <MainLayout>
      <div className="max-w-6xl pb-10 mx-auto animate-fade-in">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-between gap-4 mb-8 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="mt-1 text-muted-foreground">Track and manage all your assignments and deadlines</p>
          </div>
          <div className="flex items-center w-full gap-3 md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search tasks..." 
                className="bg-white pl-9" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
            
            {canAdd && (
              <Dialog open={isDialogOpen} onOpenChange={(open) => {setIsDialogOpen(open); if(!open) resetForm()}}>
                <DialogTrigger asChild>
                    <Button className="text-white bg-gray-900 hover:bg-black">
                        <Plus className="w-4 h-4 mr-2" /> Create Task
                    </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingId ? "Edit Task" : "Create New Task"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label>Task Title</Label>
                        <Input placeholder="e.g. Final Project Report" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Course</Label>
                        <Select value={formData.course} onValueChange={val => setFormData({...formData, course: val})}>
                            <SelectTrigger><SelectValue placeholder="Select Course" /></SelectTrigger>
                            <SelectContent>
                                {courses.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Input type="datetime-local" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea placeholder="Task details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Task"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
            <Card className="border-none shadow-sm bg-red-50">
                <CardContent className="flex items-center gap-4 p-6">
                    <div className="p-3 text-red-600 bg-red-100 rounded-xl">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-red-600">Pending</p>
                        <h3 className="text-2xl font-bold text-gray-900">{getCount('pending')}</h3>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-orange-50">
                <CardContent className="flex items-center gap-4 p-6">
                    <div className="p-3 text-orange-600 bg-orange-100 rounded-xl">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-orange-600">In Progress</p>
                        <h3 className="text-2xl font-bold text-gray-900">{getCount('in-progress')}</h3>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-green-50">
                <CardContent className="flex items-center gap-4 p-6">
                    <div className="p-3 text-green-600 bg-green-100 rounded-xl">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-green-600">Completed</p>
                        <h3 className="text-2xl font-bold text-gray-900">{getCount('completed')}</h3>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Tabs & List */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="justify-start w-full h-auto gap-6 p-0 mb-6 bg-transparent border-b border-gray-200 rounded-none">
                {["all", "pending", "in-progress", "completed"].map((tab) => (
                    <TabsTrigger 
                        key={tab} 
                        value={tab} 
                        className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-2 pb-3 pt-0 data-[state=active]:shadow-none font-medium text-gray-500 data-[state=active]:text-black"
                    >
                        {tab.replace('-', ' ')}
                    </TabsTrigger>
                ))}
            </TabsList>

            <TabsContent value={activeTab} className="mt-0 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-gray-400 animate-spin"/></div>
                ) : filteredTasks.length === 0 ? (
                    <div className="py-12 text-center border border-dashed bg-gray-50 rounded-xl">
                        <p className="text-gray-500">No tasks found in this category.</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => {
                        const status = taskStatuses[task.id] || 'pending';
                        return (
                            <Card key={task.id} className="transition-all bg-white border border-gray-100 shadow-sm hover:shadow-md group">
                                <CardContent className="flex flex-col items-start gap-6 p-6 md:flex-row md:items-center">
                                    {/* Left: Radio/Status Indicator */}
                                    <div className="pt-1 md:pt-0">
                                        <button 
                                            onClick={() => updateTaskStatus(task.id, status === 'completed' ? 'pending' : 'completed')}
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${status === 'completed' ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-gray-400'}`}
                                        >
                                            {status === 'completed' && <CheckCircle2 className="w-4 h-4 text-white" />}
                                        </button>
                                    </div>

                                    {/* Middle: Content */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className={`text-lg font-bold text-gray-900 group-hover:text-lms-blue transition-colors ${status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                                                    {task.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`w-2 h-2 rounded-full ${task.course % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}></span>
                                                    <span className="text-sm font-medium text-gray-500">
                                                        {task.course_detail?.name || 'General Task'}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Badges on Desktop */}
                                            <div className="hidden gap-2 md:flex">
                                                {getPriorityBadge(task.id)}
                                                <Badge variant="secondary" className="text-[10px] bg-gray-100 text-gray-600 px-2 border-0">Assignment</Badge>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
                                        
                                        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                {format(new Date(task.due_date), "MMM dd, yyyy")}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                {format(new Date(task.due_date), "hh:mm a")}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
                                                <FileText className="w-4 h-4" />
                                                100 pts
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex flex-col gap-2 min-w-[140px] md:items-end mt-4 md:mt-0 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                                        {/* Mobile Badges */}
                                        <div className="flex gap-2 mb-2 md:hidden">
                                            {getPriorityBadge(task.id)}
                                            <Badge variant="secondary" className="text-[10px] bg-gray-100 text-gray-600">Assignment</Badge>
                                        </div>

                                        {canAdd ? (
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(task)}>
                                                    <Pencil className="w-4 h-4 mr-2" /> Edit
                                                </Button>
                                                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(task.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            status !== 'completed' ? (
                                                <Button 
                                                    className="w-full text-white bg-gray-900 hover:bg-black md:w-auto" 
                                                    size="sm"
                                                    onClick={() => updateTaskStatus(task.id, 'in-progress')}
                                                >
                                                    Start Task
                                                </Button>
                                            ) : (
                                                <Button variant="outline" className="w-full text-green-600 border-green-200 md:w-auto bg-green-50" size="sm" disabled>
                                                    Completed
                                                </Button>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}