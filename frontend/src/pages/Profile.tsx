import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService, UserData } from "@/services/authService";
import { courseService, Course } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, User as UserIcon, Mail, Pencil, Loader2 } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const [user, setUser] = useState<UserData | null>(authService.getUser());
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form Data - Inisialisasi dengan data user yang ada
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    password: ""
  });

  useEffect(() => {
    // Update form jika user state berubah (misal setelah refresh)
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        password: ""
      });
    }
    
    courseService.getAll().then((data) => {
        // @ts-ignore
        const list = Array.isArray(data) ? data : data.results || [];
        setEnrolledCourses(list.slice(0, 3));
    });
  }, [user]); // Dependensi ke user

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return; 

    setIsLoading(true);
    try {
      const payload: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email
      };
      if (formData.password) payload.password = formData.password;

      await authService.updateProfile(user.id, payload);
      
      const updatedUser = authService.getUser();
      setUser(updatedUser);
      
      setIsEditing(false);
      // Trigger event untuk update Header
      window.dispatchEvent(new Event('auth-update'));
      
      toast({ title: "Profil Diperbarui", description: "Data Anda berhasil disimpan." });
    } catch (error) {
      toast({ title: "Gagal", description: "Terjadi kesalahan.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Tampilan Nama Lengkap yang Benar
  const fullName = (user?.first_name && user?.last_name) 
    ? `${user.first_name} ${user.last_name}` 
    : (user?.first_name || user?.username);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Card className="mb-8 overflow-hidden border-none shadow-md">
          <div className="h-32 bg-gradient-to-r from-lms-blue to-lms-purple"></div>
          <div className="px-8 pb-8">
            <div className="relative flex items-end -mt-12 mb-4">
              <Avatar className="w-24 h-24 border-4 border-background shadow-sm">
                <AvatarFallback className="text-3xl bg-white text-lms-blue font-bold">
                  {fullName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 mb-1 pt-12">
                <h2 className="text-2xl font-bold capitalize">{fullName}</h2>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Badge variant="secondary" className="capitalize">
                        {user?.role || "User"}
                    </Badge>
                    <span className="text-sm flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user?.email}
                    </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-2">
              <Badge variant="outline" className="px-3 py-1">
                <BookOpen className="w-3 h-3 mr-2" /> {enrolledCourses.length} Kursus
              </Badge>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-transparent border-b rounded-none p-0 h-auto">
            <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-lms-blue data-[state=active]:bg-transparent px-4 py-2">
              Pengaturan Profil
            </TabsTrigger>
            <TabsTrigger value="courses" className="rounded-none border-b-2 border-transparent data-[state=active]:border-lms-blue data-[state=active]:bg-transparent px-4 py-2">
              Daftar Kursus
            </TabsTrigger>
            {/* Tab Penghargaan DIHAPUS */}
          </TabsList>

          {/* Tab Settings */}
          <TabsContent value="settings" className="mt-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Edit Profil</CardTitle>
                  <CardDescription>Perbarui informasi pribadi Anda.</CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit Data
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <fieldset disabled={!isEditing} className="space-y-4 group">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nama Depan</Label>
                        <Input 
                          value={formData.first_name} 
                          onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
                          className="disabled:opacity-100 disabled:bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nama Belakang</Label>
                        <Input 
                          value={formData.last_name} 
                          onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
                          className="disabled:opacity-100 disabled:bg-muted/50"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        className="disabled:opacity-100 disabled:bg-muted/50"
                      />
                    </div>

                    {isEditing && (
                        <div className="space-y-2 pt-4 border-t">
                            <Label>Ganti Password (Opsional)</Label>
                            <Input 
                            type="password" 
                            placeholder="Kosongkan jika tidak ingin mengubah"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    )}
                  </fieldset>

                  {isEditing && (
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Batal</Button>
                      <Button type="submit" disabled={isLoading} className="bg-lms-blue hover:bg-blue-700">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Simpan Perubahan
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Courses */}
          <TabsContent value="courses" className="mt-0">
            {enrolledCourses.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground bg-muted/30 border-dashed">
                <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>Belum ada kursus.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {enrolledCourses.map(course => (
                  <Card key={course.id} className="flex items-center p-4 gap-4 hover:bg-accent/50 transition-colors">
                    <div className="w-12 h-12 bg-lms-blue/10 text-lms-blue rounded-lg flex items-center justify-center overflow-hidden">
                      {course.image ? (
                        <img src={course.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold">{course.name}</h3>
                      <p className="text-sm text-muted-foreground">{course.code}</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">Lihat</Button>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}