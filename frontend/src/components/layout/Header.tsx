import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authService } from "@/services/authService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getUser());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleAuthUpdate = () => setUser(authService.getUser());
    window.addEventListener('auth-update', handleAuthUpdate);
    return () => window.removeEventListener('auth-update', handleAuthUpdate);
  }, []);

  // LOGIC NAMA: Ambil dari First Name. Jika kosong, gunakan Username.
  const displayName = user?.first_name || user?.username || "User";

  // LOGIC ROLE: Langsung dari database (admin, lecturer, student).
  // Jika null (belum login/error), fallback ke string kosong agar tidak misleading.
  const displayRole = user?.role || "";
  
  const initial = displayName.charAt(0).toUpperCase();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search courses..." 
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-lms-blue" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            onKeyDown={handleSearch}
          />
        </div>

        <div className="flex items-center gap-4">
          {/* User Profile */}
          <div className="flex items-center gap-3 text-right">
            <div className="hidden md:block">
              <p className="text-sm font-medium capitalize">{displayName}</p>
              <p className="text-xs text-muted-foreground capitalize">{displayRole}</p>
            </div>
            <Avatar className="h-9 w-9 border border-border cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/profile')}>
              <AvatarFallback className="bg-lms-blue text-white">{initial}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}