"use client"
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Clock, ListTodo, Users } from 'lucide-react';

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

const Card = ({ title, value, subtitle, icon: Icon }) => (
  <div style={styles.card}>
    <div style={styles.cardHeader}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <Icon size={16} color="#6B7280" />
    </div>
    <div style={styles.cardContent}>
      <div style={styles.cardValue}>{value}</div>
      <p style={styles.cardSubtitle}>{subtitle}</p>
    </div>
  </div>
);

const ProgressBar = ({ value }) => (
  <div style={styles.progressBarContainer}>
    <div style={{...styles.progressBarFill, width: `${value}%`}} />
  </div>
);

export default function UserDashboard() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome back, Alex!</h1>
      <div style={styles.cardGrid}>
        <Card title="Total Tasks" value="24" subtitle="4 completed this week" icon={ListTodo} />
        <Card title="In Progress" value="8" subtitle="2 due today" icon={Clock} />
        <Card title="Completed" value="16" subtitle="3 completed today" icon={CheckCircle2} />
        <Card title="Team Members" value="6" subtitle="2 active now" icon={Users} />
      </div>
      <div style={styles.chartGrid}>
        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>Task Completion</h2>
          <p style={styles.chartDescription}>Your task completion rate this week</p>
          <div style={styles.chart}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={taskData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>Project Progress</h2>
          <p style={styles.chartDescription}>Current status of your active projects</p>
          <div style={styles.projectList}>
            <div style={styles.project}>
              <div style={styles.projectHeader}>
                <div>
                  <p style={styles.projectTitle}>Website Redesign</p>
                  <p style={styles.projectSubtitle}>UI/UX Design</p>
                </div>
                <span style={styles.projectPercentage}>75%</span>
              </div>
              <ProgressBar value={75} />
            </div>
            <div style={styles.project}>
              <div style={styles.projectHeader}>
                <div>
                  <p style={styles.projectTitle}>Mobile App Development</p>
                  <p style={styles.projectSubtitle}>React Native</p>
                </div>
                <span style={styles.projectPercentage}>60%</span>
              </div>
              <ProgressBar value={60} />
            </div>
            <div style={styles.project}>
              <div style={styles.projectHeader}>
                <div>
                  <p style={styles.projectTitle}>Database Optimization</p>
                  <p style={styles.projectSubtitle}>PostgreSQL</p>
                </div>
                <span style={styles.projectPercentage}>40%</span>
              </div>
              <ProgressBar value={40} />
            </div>
          </div>
        </div>
      </div>
      <div style={styles.tableCard}>
        <h2 style={styles.tableTitle}>Recent Tasks</h2>
        <p style={styles.tableDescription}>Your recently updated tasks</p>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Task</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Assignee</th>
              <th style={styles.tableHeader}>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {recentTasks.map((task) => (
              <tr key={task.id}>
                <td style={styles.tableCell}>{task.title}</td>
                <td style={styles.tableCell}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: task.status === "Completed" ? "#DEF7EC" : task.status === "In Progress" ? "#E1EFFE" : "#FEF3C7",
                    color: task.status === "Completed" ? "#03543F" : task.status === "In Progress" ? "#1E429F" : "#92400E"
                  }}>
                    {task.status}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <div style={styles.assignee}>
                    <div style={styles.avatar}>{task.assignee[0]}</div>
                    <span>{task.assignee}</span>
                  </div>
                </td>
                <td style={styles.tableCell}>{task.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6B7280',
  },
  cardContent: {},
  cardValue: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: '12px',
    color: '#6B7280',
  },
  chartGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  chartDescription: {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '16px',
  },
  chart: {
    height: '200px',
  },
  projectList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  project: {},
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  projectTitle: {
    fontSize: '14px',
    fontWeight: '500',
  },
  projectSubtitle: {
    fontSize: '12px',
    color: '#6B7280',
  },
  projectPercentage: {
    fontSize: '14px',
    fontWeight: '500',
  },
  progressBarContainer: {
    height: '8px',
    backgroundColor: '#E5E7EB',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  tableCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  tableDescription: {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '1px solid #E5E7EB',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6B7280',
  },
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #E5E7EB',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500',
  },
  assignee: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '500',
  },
};