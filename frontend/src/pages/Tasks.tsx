import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Circle, CheckCircle2, AlertCircle } from "lucide-react";

const taskStats = [
  { label: "Pending", count: 4, color: "bg-lms-coral-light", iconColor: "text-lms-coral", icon: AlertCircle },
  { label: "In Progress", count: 2, color: "bg-lms-orange-light", iconColor: "text-lms-orange", icon: Clock },
  { label: "Completed", count: 1, color: "bg-lms-green-light", iconColor: "text-lms-green", icon: CheckCircle2 },
];

const tasks = [
  {
    id: 1,
    title: "Final Project Report",
    course: "Software Engineering",
    courseColor: "bg-lms-blue",
    description: "Complete and submit the final project documentation with UML diagrams.",
    date: "Oct 25, 2025",
    time: "11:59 PM",
    points: 100,
    priority: "high",
    type: "assignment",
    status: "pending",
  },
  {
    id: 2,
    title: "Weekly Quiz Chapter 5",
    course: "Data Structures",
    courseColor: "bg-lms-purple",
    description: "Quiz covering binary trees, heaps, and graph algorithms.",
    date: "Oct 24, 2025",
    time: "3:00 PM",
    points: 50,
    priority: "high",
    type: "quiz",
    status: "pending",
  },
  {
    id: 3,
    title: "Lab Assignment 4",
    course: "Database Systems",
    courseColor: "bg-lms-green",
    description: "Design and implement a normalized database schema for an e-commerce system.",
    date: "Oct 26, 2025",
    time: "5:00 PM",
    points: 75,
    priority: "medium",
    type: "lab",
    status: "in-progress",
  },
  {
    id: 4,
    title: "Research Paper Review",
    course: "Machine Learning",
    courseColor: "bg-lms-coral",
    description: "Review and critique a research paper on neural networks.",
    date: "Oct 28, 2025",
    time: "11:59 PM",
    points: 60,
    priority: "medium",
    type: "assignment",
    status: "pending",
  },
  {
    id: 5,
    title: "Code Review Exercise",
    course: "Software Engineering",
    courseColor: "bg-lms-blue",
    description: "Review peer code submissions and provide constructive feedback.",
    date: "Oct 23, 2025",
    time: "11:59 PM",
    points: 30,
    priority: "low",
    type: "exercise",
    status: "completed",
  },
  {
    id: 6,
    title: "Midterm Exam Preparation",
    course: "Data Structures",
    courseColor: "bg-lms-purple",
    description: "Study all materials from chapters 1-6 for the midterm exam.",
    date: "Oct 30, 2025",
    time: "2:00 PM",
    points: 150,
    priority: "high",
    type: "exam",
    status: "pending",
  },
  {
    id: 7,
    title: "Frontend Implementation",
    course: "Web Development",
    courseColor: "bg-lms-orange",
    description: "Build responsive UI components using React and Tailwind CSS.",
    date: "Oct 27, 2025",
    time: "11:59 PM",
    points: 80,
    priority: "medium",
    type: "project",
    status: "in-progress",
  },
];

const priorityColors = {
  high: "bg-lms-coral text-card",
  medium: "bg-lms-orange text-card",
  low: "bg-lms-green text-card",
};

const statusIcons = {
  pending: Circle,
  "in-progress": AlertCircle,
  completed: CheckCircle2,
};

export default function Tasks() {
  const [filter, setFilter] = useState("all");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "in-progress") return task.status === "in-progress";
    return task.status === filter;
  });

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground">Track and manage all your assignments and deadlines</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {taskStats.map((stat) => (
            <Card key={stat.label} className={`p-4 ${stat.color}`}>
              <div className="flex items-center gap-3">
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const StatusIcon = statusIcons[task.status as keyof typeof statusIcons];
            return (
              <Card key={task.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <StatusIcon className={`h-5 w-5 mt-1 ${
                    task.status === "completed" ? "text-lms-green" : 
                    task.status === "in-progress" ? "text-lms-orange" : "text-muted-foreground"
                  }`} />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-2 h-2 rounded-full ${task.courseColor}`} />
                          <span className="text-sm text-muted-foreground">{task.course}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline">{task.type}</Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2">{task.description}</p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {task.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {task.time}
                        </span>
                        <span className="font-medium text-foreground">{task.points} pts</span>
                      </div>
                      <Button size="sm" variant={task.status === "completed" ? "outline" : "default"}>
                        {task.status === "completed" ? "View Submission" : "Start Task"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
