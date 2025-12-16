import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Calendar } from "lucide-react";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Browse Courses",
      description: "Find new courses to enroll in",
      icon: BookOpen,
      onClick: () => navigate("/courses"),
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "View Tasks",
      description: "Check upcoming assignments",
      icon: Calendar,
      onClick: () => navigate("/tasks"),
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="flex items-center justify-start h-auto p-4 hover:bg-slate-50 border-slate-100"
            onClick={action.onClick}
          >
            <div className={`p-2 rounded-lg ${action.bgColor} mr-4`}>
              <action.icon className={`w-5 h-5 ${action.color}`} />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">{action.title}</div>
              <div className="text-xs font-normal text-gray-500">{action.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}