import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" // Default
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Khusus username: paksa huruf kecil dan hapus spasi
    if (e.target.name === "username") {
      value = value.toLowerCase().replace(/\s/g, '');
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Password tidak cocok!", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role
      });
      
      toast({ title: "Registrasi Berhasil", description: "Silakan login dengan akun baru Anda." });
      navigate("/login");
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.username ? "Username sudah dipakai." : "Gagal mendaftar. Periksa koneksi.";
      toast({ title: "Gagal", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-muted/50">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-lms-blue">Buat Akun Baru</CardTitle>
          <CardDescription>Lengkapi biodata Anda untuk bergabung</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Input Nama Depan & Belakang */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nama Depan</Label>
                <Input id="firstName" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nama Belakang</Label>
                <Input id="lastName" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            {/* Username & Email */}
            <div className="space-y-2">
              <Label htmlFor="username">Username (Huruf kecil, tanpa spasi)</Label>
              <Input id="username" name="username" placeholder="johndoe" value={formData.username} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="john@university.edu" value={formData.email} onChange={handleChange} required />
            </div>

            {/* Pilihan Role */}
            <div className="space-y-2">
              <Label>Daftar Sebagai</Label>
              <RadioGroup defaultValue="student" onValueChange={(val) => setFormData({...formData, role: val})} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="r-student" />
                  <Label htmlFor="r-student">Mahasiswa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lecturer" id="r-lecturer" />
                  <Label htmlFor="r-lecturer">Dosen</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <Button type="submit" className="w-full bg-lms-blue hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Daftar Sekarang"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-center">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-lms-blue hover:underline">
              Masuk disini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}