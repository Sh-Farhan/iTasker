// export interface Subtask {
//   id: string;
//   content: string;
//   completed: boolean;
// }

// export interface Task {
//   id: string;
//   content: string;
//   status: "todo" | "inprogress" | "done";
//   createdAt: string; // Add this
//   dueDate?: string; // Add this. Optional as not all tasks might have a due date.
//   subtasks: Subtask[];
// }

// export interface Column {
//   id: string;
//   title: string;
//   tasks: Task[];
//   color: string;
//   textColor: string;
// }
export interface Subtask {
  id: string;
  content: string;
  completed: boolean;
  dueDate?: string;
}

export interface Task {
  id: string;
  content: string;
  status: "todo" | "inprogress" | "done";
  createdAt: string;
  dueDate?: string;
  subtasks: Subtask[];
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
  textColor: string;
}