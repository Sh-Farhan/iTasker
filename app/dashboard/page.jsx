"use client"

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Clock, ListTodo, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const taskData = [
  { name: "Mon", tasks: 3 },
  { name: "Tue", tasks: 7 },
  { name: "Wed", tasks: 5 },
  { name: "Thu", tasks: 8 },
  { name: "Fri", tasks: 4 },
  { name: "Sat", tasks: 2 },
  { name: "Sun", tasks: 1 },
];

const recentTasks = [
  { id: 1, title: "Design new landing page", status: "In Progress", assignee: "Alice", dueDate: "2023-06-15" },
  { id: 2, title: "Implement user authentication", status: "Completed", assignee: "Bob", dueDate: "2023-06-10" },
  { id: 3, title: "Write API documentation", status: "Pending", assignee: "Charlie", dueDate: "2023-06-20" },
  { id: 4, title: "Set up CI/CD pipeline", status: "In Progress", assignee: "David", dueDate: "2023-06-18" },
];

const DashboardCard = ({ title, value, subtitle, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </CardContent>
  </Card>
);

const ProjectProgress = ({ title, subtitle, percentage }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <span className="text-sm font-medium">{percentage}%</span>
    </div>
    <Progress value={percentage} className="h-2" />
  </div>
);

export default function UserDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome back, Alex!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard title="Total Tasks" value="24" subtitle="4 completed this week" icon={ListTodo} />
        <DashboardCard title="In Progress" value="8" subtitle="2 due today" icon={Clock} />
        <DashboardCard title="Completed" value="16" subtitle="3 completed today" icon={CheckCircle2} />
        <DashboardCard title="Team Members" value="6" subtitle="2 active now" icon={Users} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Completion</CardTitle>
            <p className="text-sm text-muted-foreground">Your task completion rate this week</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={taskData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <p className="text-sm text-muted-foreground">Current status of your active projects</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProjectProgress title="Website Redesign" subtitle="UI/UX Design" percentage={75} />
            <ProjectProgress title="Mobile App Development" subtitle="React Native" percentage={60} />
            <ProjectProgress title="Database Optimization" subtitle="PostgreSQL" percentage={40} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
          <p className="text-sm text-muted-foreground">Your recently updated tasks</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    <Badge variant={task.status === "Completed" ? "success" : task.status === "In Progress" ? "default" : "secondary"}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{task.assignee[0]}</AvatarFallback>
                      </Avatar>
                      <span>{task.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

