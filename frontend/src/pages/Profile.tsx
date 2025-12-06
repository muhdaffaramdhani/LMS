import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Award, TrendingUp, Calendar, Mail, Phone, MapPin, Edit } from "lucide-react";

const stats = [
  { icon: BookOpen, label: "Total Courses", value: "12", color: "bg-lms-blue" },
  { icon: Award, label: "Completed", value: "7", color: "bg-lms-orange" },
  { icon: TrendingUp, label: "GPA", value: "3.85", color: "bg-lms-purple" },
  { icon: Calendar, label: "Credits", value: "42", color: "bg-lms-coral" },
];

const recentActivity = [
  { action: "Submitted assignment", course: "Software Engineering", time: "2h ago", color: "bg-lms-blue" },
  { action: "Completed quiz", course: "Data Structures", time: "1d ago", color: "bg-lms-green" },
  { action: "Joined discussion", course: "Database Systems", time: "2d ago", color: "bg-lms-purple" },
];

export default function Profile() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto animate-fade-in">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className={`inline-flex p-2.5 rounded-xl ${stat.color} mb-3`}>
                <stat.icon className="h-5 w-5 text-card" />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">MD</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-1.5 bg-lms-purple rounded-full text-card">
                <Edit className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold">Muhammad Daffa Ramdhani</h2>
                <Badge className="bg-lms-blue text-card">Student</Badge>
                <Badge variant="outline" className="border-lms-green text-lms-green">Active</Badge>
              </div>
              <p className="text-muted-foreground mb-4">Computer Science • Class of 2026</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  muhammad.daffa@university.edu
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  +62 812-3456-7890
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Jakarta, Indonesia
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Joined September 2023
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Academic Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Overall GPA</span>
                      <span className="font-medium">3.85 / 4.00</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "96%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Course Completion</span>
                      <span className="font-medium">58%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-lms-blue rounded-full" style={{ width: "58%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Assignment Success Rate</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-lms-green rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className={`w-2 h-2 rounded-full mt-2 ${activity.color}`} />
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.course} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <Card className="p-6">
              <p className="text-muted-foreground">View all your enrolled courses and track your progress.</p>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card className="p-6">
              <p className="text-muted-foreground">Your achievements and badges will appear here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <p className="text-muted-foreground">Account settings and preferences.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
