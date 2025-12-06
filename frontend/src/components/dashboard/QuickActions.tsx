import { Card } from "@/components/ui/card";
import { FileText, CheckCircle, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    icon: FileText,
    label: "Materi",
    description: "Browse learning materials",
    color: "bg-lms-blue",
    href: "/courses",
  },
  {
    icon: CheckCircle,
    label: "Tugas",
    description: "View assignments",
    color: "bg-lms-green",
    href: "/tasks",
  },
  {
    icon: MessageSquare,
    label: "Diskusi",
    description: "Join discussions",
    color: "bg-lms-purple",
    href: "/courses",
  },
];

export function QuickActions() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link key={action.label} to={action.href}>
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${action.color}`}>
                  <action.icon className="h-5 w-5 text-card" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:text-lms-blue transition-colors">
                    {action.label}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
