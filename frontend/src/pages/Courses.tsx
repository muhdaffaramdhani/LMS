import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Users, FileText, Video, Clock } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Software Engineering",
    code: "CS301",
    instructor: "Dr. Sarah Johnson",
    rating: 4.8,
    students: 42,
    description: "Learn modern software development practices and methodologies.",
    progress: 75,
    materials: 45,
    assignments: 12,
    duration: "16 weeks",
    nextClass: "Monday, 10:00 AM",
    status: "ongoing",
    color: "bg-lms-blue",
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    code: "CS202",
    instructor: "Prof. Michael Chen",
    rating: 4.9,
    students: 38,
    description: "Master fundamental data structures and algorithm design techniques.",
    progress: 60,
    materials: 52,
    assignments: 15,
    duration: "16 weeks",
    nextClass: "Tuesday, 2:00 PM",
    status: "ongoing",
    color: "bg-lms-orange",
  },
  {
    id: 3,
    title: "Database Systems",
    code: "CS305",
    instructor: "Dr. Emily Davis",
    rating: 4.7,
    students: 35,
    description: "Comprehensive study of database design, SQL, and NoSQL systems.",
    progress: 82,
    materials: 38,
    assignments: 10,
    duration: "16 weeks",
    nextClass: "Wednesday, 9:00 AM",
    status: "ongoing",
    color: "bg-lms-green",
  },
  {
    id: 4,
    title: "Machine Learning",
    code: "CS401",
    instructor: "Dr. James Wilson",
    rating: 4.9,
    students: 30,
    description: "Introduction to machine learning algorithms and applications.",
    progress: 45,
    materials: 60,
    assignments: 18,
    duration: "16 weeks",
    nextClass: "Thursday, 1:00 PM",
    status: "ongoing",
    color: "bg-lms-purple",
  },
  {
    id: 5,
    title: "Web Development",
    code: "CS250",
    instructor: "Prof. Lisa Anderson",
    rating: 4.8,
    students: 45,
    description: "Full-stack web development with modern frameworks and tools.",
    progress: 90,
    materials: 42,
    assignments: 14,
    duration: "16 weeks",
    nextClass: "Friday, 11:00 AM",
    status: "ongoing",
    color: "bg-lms-coral",
  },
  {
    id: 6,
    title: "Computer Networks",
    code: "CS310",
    instructor: "Dr. Robert Taylor",
    rating: 4.6,
    students: 40,
    description: "Study of network protocols, architecture, and security.",
    progress: 100,
    materials: 35,
    assignments: 8,
    duration: "16 weeks",
    nextClass: "Completed",
    status: "completed",
    color: "bg-lms-green",
  },
];

export default function Courses() {
  const [filter, setFilter] = useState("all");

  const filteredCourses = courses.filter((course) => {
    if (filter === "all") return true;
    return course.status === filter;
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">Manage and track your enrolled courses</p>
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${course.color}`}>
                    <svg className="h-6 w-6 text-card" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.code} • {course.instructor}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <Star className="h-4 w-4 fill-lms-yellow text-lms-yellow" />
                      <span>{course.rating}</span>
                      <span className="text-muted-foreground">•</span>
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{course.students} students</span>
                    </div>
                  </div>
                </div>
                <Badge variant={course.status === "completed" ? "default" : "secondary"} 
                       className={course.status === "completed" ? "bg-lms-green" : "bg-lms-blue text-card"}>
                  {course.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{course.description}</p>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Course Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${course.color}`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
                <div className="text-center">
                  <FileText className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-semibold">{course.materials}</p>
                  <p className="text-xs text-muted-foreground">Materials</p>
                </div>
                <div className="text-center">
                  <Video className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-semibold">{course.assignments}</p>
                  <p className="text-xs text-muted-foreground">Assignments</p>
                </div>
                <div className="text-center">
                  <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-semibold">{course.duration}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Next class: <span className="font-medium text-foreground">{course.nextClass}</span>
                </p>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Enter Course
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
