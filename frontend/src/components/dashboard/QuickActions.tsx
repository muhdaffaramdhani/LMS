import { Card } from "../ui/card";
import { FileText, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    icon: FileText,
    label: "Materials",
    description: "Browse learning materials",
    color: "bg-blue-500",
    href: "/courses",
  },
  {
    icon: CheckCircle,
    label: "Assignments",
    description: "View assignments",
    color: "bg-green-500",
    href: "/tasks",
  },
];

export function QuickActions() {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-gray-800">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <Link key={action.label} to={action.href}>
            <Card className="p-4 transition-all bg-white border-none shadow-sm cursor-pointer hover:shadow-lg group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${action.color} text-white shadow-md group-hover:scale-105 transition-transform`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">
                    {action.label}
                  </h4>
                  <p className="text-xs text-gray-500">
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