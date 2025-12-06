import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { courseService, Course } from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, BookOpen, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      courseService.getById(id)
        .then(data => setCourse(data))
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!course) return <div className="p-8 text-center">Kursus tidak ditemukan</div>;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto animate-fade-in">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 pl-0 hover:pl-2 transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="relative h-64 rounded-xl overflow-hidden bg-muted">
              {course.image ? (
                <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-lms-blue/20 to-lms-purple/20">
                  <BookOpen className="w-16 h-16 text-lms-blue/50" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {course.code}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Diposting pada {format(new Date(), "dd MMM yyyy")}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tentang Kursus</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {course.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Instruktur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-lms-orange/20 flex items-center justify-center text-lms-orange font-bold">
                    {course.lecturer_detail?.first_name?.[0] || "D"}
                  </div>
                  <div>
                    <p className="font-medium">
                      {course.lecturer_detail?.first_name} {course.lecturer_detail?.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">@{course.lecturer_detail?.username}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" /> Mahasiswa
                  </div>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" /> Durasi
                  </div>
                  <span className="font-medium">16 Minggu</span>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full bg-lms-blue hover:bg-blue-700">
              Lihat Materi & Tugas
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}