import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { reportService, Report } from "@/services/reportService";
import { Plus, Pencil, Trash2, FileText, Loader2 } from "lucide-react";

// Interface untuk response paginasi dari Django (jika ada)
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export default function Reports() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    week_number: 12,
    progress_percentage: 0
  });

  // Load data saat halaman dibuka
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      // Gunakan 'unknown' agar kita bisa melakukan pengecekan tipe manual
      const data: unknown = await reportService.getAll();
      
      // Type Guard untuk mengecek apakah data adalah PaginatedResponse
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isPaginated = (data: any): data is PaginatedResponse<Report> => {
        return data && typeof data === 'object' && 'results' in data && Array.isArray(data.results);
      };

      let reportsList: Report[] = [];
      
      if (Array.isArray(data)) {
        reportsList = data as Report[];
      } else if (isPaginated(data)) {
        // TypeScript sekarang tahu bahwa 'data' adalah PaginatedResponse<Report>
        reportsList = data.results;
      } else {
        // Fallback jika struktur tidak dikenali
        reportsList = [];
      }

      setReports(reportsList);
    } catch (error) {
      console.error("Error fetching reports:", error);
      // Jangan tampilkan error toast saat pertama load jika belum login, cukup kosongkan data
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await reportService.update(editingId, formData);
        toast({ title: "Sukses", description: "Laporan berhasil diperbarui" });
      } else {
        await reportService.create(formData);
        toast({ title: "Sukses", description: "Laporan berhasil dibuat" });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchReports();
    } catch (error) {
      toast({ title: "Gagal", description: "Terjadi kesalahan saat menyimpan", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus laporan ini?")) return;
    try {
      await reportService.delete(id);
      toast({ title: "Terhapus", description: "Laporan berhasil dihapus" });
      fetchReports(); // Refresh data
    } catch (error) {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    }
  };

  const handleEdit = (report: Report) => {
    setEditingId(report.id);
    setFormData({
      title: report.title,
      content: report.content,
      week_number: report.week_number,
      progress_percentage: report.progress_percentage
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", content: "", week_number: 12, progress_percentage: 0 });
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Laporan Mingguan</h1>
            <p className="text-muted-foreground">Pantau progress proyek minggu ke-12 Anda.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-lms-blue hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" /> Buat Laporan Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Laporan' : 'Buat Laporan'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Minggu Ke-</label>
                    <Input 
                      type="number" 
                      value={formData.week_number}
                      onChange={(e) => setFormData({...formData, week_number: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Progress (%)</label>
                    <Input 
                      type="number" min="0" max="100"
                      value={formData.progress_percentage}
                      onChange={(e) => setFormData({...formData, progress_percentage: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Judul Laporan</label>
                  <Input 
                    placeholder="Contoh: Implementasi API Login"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Isi Laporan</label>
                  <Textarea 
                    placeholder="Jelaskan detail pengerjaan..."
                    className="min-h-[100px]"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Simpan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" /> Daftar Laporan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-10 text-center">Loading data...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Minggu</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Dibuat Oleh</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.length > 0 ? (
                    reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">Minggu {report.week_number}</TableCell>
                        <TableCell>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                            {report.content}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            report.progress_percentage === 100 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                            {report.progress_percentage}%
                          </span>
                        </TableCell>
                        <TableCell>{report.user_detail?.username || 'User'}</TableCell>
                        <TableCell className="space-x-2 text-right">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(report)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(report.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        Belum ada laporan. Silakan buat baru.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}