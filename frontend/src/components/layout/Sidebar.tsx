import { NavLink, useLocation } from "react-router-dom";
import { Home, BookOpen, CheckSquare, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: BookOpen, label: "Courses", path: "/courses" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function Sidebar() {
  const location = useLocation();
  const user = authService.getUser();
  
  // LOGIC NAMA: Prioritas First Name
  const displayName = user?.first_name || user?.username || "User";
  const displayRole = user?.role || "";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <aside className="fixed top-0 left-0 z-40 flex flex-col w-56 h-screen bg-sidebar text-sidebar-foreground">
      <div className="p-6">
        <h1 className="text-xl font-bold">EduPlatform</h1>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-lms-blue text-sidebar-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="text-sidebar-foreground bg-sidebar-accent">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate capitalize">{displayName}</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{displayRole}</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-950/20 pl-0"
          onClick={() => authService.logout()}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}