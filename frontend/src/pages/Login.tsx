import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.login({ username, password });
      toast({ title: "Berhasil Login", description: "Selamat datang kembali!" });
      navigate("/"); // Redirect ke dashboard
    } catch (error: any) {
      console.error("Login Failed:", error);
      
      let errorMessage = "Gagal login. Periksa koneksi backend.";
      
      if (error.response) {
        // Error dari backend (400, 401, 500)
        if (error.response.status === 401) {
          errorMessage = "Username atau password salah.";
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        } else {
          errorMessage = "Terjadi kesalahan pada server.";
        }
      } else if (error.request) {
        // Tidak ada response (network error)
        errorMessage = "Tidak dapat menghubungi server. Pastikan backend menyala.";
      }

      toast({ 
        title: "Gagal Login", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-lms-blue">EduPlatform</CardTitle>
          <CardDescription>Masukan akun Anda untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Contoh: student1"
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
              />
            </div>
            <Button type="submit" className="w-full bg-lms-blue hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Masuk"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-center">
            Belum punya akun?{" "}
            <Link to="/register" className="text-lms-blue hover:underline">
              Daftar disini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}