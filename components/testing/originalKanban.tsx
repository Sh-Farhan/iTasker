"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  LayoutDashboard,
  List,
  Edit,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const KanbanTodo = () => {
  const [columns, setColumns] = useState([
    { id: "todo", title: "To Do", tasks: [], color: "bg-blue-500" },
    {
      id: "inprogress",
      title: "In Progress",
      tasks: [],
      color: "bg-yellow-500",
    },
    { id: "done", title: "Done", tasks: [], color: "bg-green-500" },
  ]);
  const [newTask, setNewTask] = useState("");
  const [viewMode, setViewMode] = useState("kanban");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const startEditingTask = (taskId: string, currentContent: string) => {
    setEditingTask(taskId);
    setEditingContent(currentContent);
  };

  const saveEditedTask = async (columnId: string, taskId: string) => {
    await editTask(columnId, taskId, editingContent);
    setEditingTask(null);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // check

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const tasks = await response.json();
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: tasks.filter((task: any) => task.status === col.id),
        }))
      );
      setIsLoading(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination } = result;
      const sourceCol = columns.find((col) => col.id === source.droppableId);
      const destCol = columns.find((col) => col.id === destination.droppableId);

      if (!sourceCol || !destCol) return;

      const sourceTasks = [...sourceCol.tasks];
      const destTasks = [...destCol.tasks];
      const [moved] = sourceTasks.splice(source.index, 1);
      const updated = { ...moved, status: destCol.id };
      destTasks.splice(destination.index, 0, updated);

      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === sourceCol.id) return { ...col, tasks: sourceTasks };
          if (col.id === destCol.id) return { ...col, tasks: destTasks };
          return col;
        })
      );

      try {
        const res = await fetch(`/api/users`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        if (!res.ok) throw new Error();
        toast({ title: "Success", description: "Task moved." });
      } catch {
        toast({
          title: "Error",
          description: "Failed to move task.",
          variant: "destructive",
        });
      }
    },
    [columns, toast]
  );

const addTask = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newTask.trim()) return;

  const task = {
    content: newTask.trim(),
    status: 'todo',
  };

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error('Failed to add task');
    }

    const addedTask = await response.json();

    // ✅ Ensure it’s added to the correct column
    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === 'todo'
          ? { ...col, tasks: [...col.tasks, addedTask] }
          : col
      )
    );

    setNewTask('');
  } catch (error) {
    console.error('Error adding task:', error);
    toast({
      title: "Error",
      description: "Failed to add task. Please try again.",
      variant: "destructive",
    });
  }
};



  const editTask = useCallback(
    async (columnId: string, taskId: string, content: string) => {
      const column = columns.find((col) => col.id === columnId);
      const task = column?.tasks.find((t) => t.id === taskId);
      if (!task) return;

      const updated = { ...task, content };

      try {
        const res = await fetch(`/api/users`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        if (!res.ok) throw new Error();

        setColumns((prev) =>
          prev.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  tasks: col.tasks.map((t) => (t.id === taskId ? updated : t)),
                }
              : col
          )
        );
        toast({ title: "Updated", description: "Task updated." });
      } catch {
        toast({
          title: "Error",
          description: "Failed to update task.",
          variant: "destructive",
        });
      }
    },
    [columns, toast]
  );

const deleteTask = useCallback(async (columnId, taskId) => {
  try {
    const response = await fetch(`/api/users`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: taskId }), // ✅ send taskId
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    setColumns(prevColumns =>
      prevColumns.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: col.tasks.filter(task => task.id !== taskId),
          };
        }
        return col;
      })
    );

    toast({
      title: "Success",
      description: "Task deleted successfully.",
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    toast({
      title: "Error",
      description: "Failed to delete task. Please try again.",
      variant: "destructive",
    });
  }
}, [toast]);

  const renderKanbanView = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id}>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <Card className="bg-secondary">
                  <CardHeader className={`${column.color} text-white`}>
                    <CardTitle className="flex justify-between items-center">
                      {column.title}
                      <Badge variant="secondary">{column.tasks.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-h-[300px] space-y-2"
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={String(task.id)}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-background p-3 rounded-lg border shadow"
                            >
                              {editingTask === task.id ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={editingContent}
                                    onChange={(e) =>
                                      setEditingContent(e.target.value)
                                    }
                                    className="flex-grow"
                                  />
                                  <Button
                                    size="icon"
                                    onClick={() =>
                                      saveEditedTask(column.id, task.id)
                                    }
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex justify-between items-center">
                                  <span>{task.content}</span>
                                  <div className="flex gap-2">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() =>
                                        startEditingTask(task.id, task.content)
                                      }
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button size="icon" variant="ghost">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will delete the task.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() =>
                                              deleteTask(column.id, task.id)
                                            }
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              )}
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Kanban Todo</h1>

      <form onSubmit={addTask} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="flex-grow"
          />
          <Button type="submit">
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </form>

      <Tabs value={viewMode} onValueChange={setViewMode} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="kanban">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Kanban
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" /> List
          </TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">{renderKanbanView()}</TabsContent>
        <TabsContent value="list">List View Coming Soon...</TabsContent>
      </Tabs>
    </div>
  );
};

export default KanbanTodo;

// "use client"

// import type React from "react"
// import { useState, useEffect, useCallback } from "react"
// import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
// import { Plus, LayoutDashboard, List, Edit, Trash2, Check, Sparkles } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { useToast } from "@/hooks/use-toast"

// const KanbanTodo = () => {
//   const [columns, setColumns] = useState([
//     { id: "todo", title: "To Do", tasks: [], color: "bg-primary", textColor: "text-primary" },
//     {
//       id: "inprogress",
//       title: "In Progress",
//       tasks: [],
//       color: "bg-amber-500",
//       textColor: "text-amber-500",
//     },
//     { id: "done", title: "Done", tasks: [], color: "bg-emerald-500", textColor: "text-emerald-500" },
//   ])
//   const [newTask, setNewTask] = useState("")
//   const [viewMode, setViewMode] = useState("kanban")
//   const [isLoading, setIsLoading] = useState(true)
//   const { toast } = useToast()
//   const [editingTask, setEditingTask] = useState<string | null>(null)
//   const [editingContent, setEditingContent] = useState("")
//   const [draggedTask, setDraggedTask] = useState<string | null>(null)

//   const startEditingTask = (taskId: string, currentContent: string) => {
//     setEditingTask(taskId)
//     setEditingContent(currentContent)
//   }

//   const saveEditedTask = async (columnId: string, taskId: string) => {
//     await editTask(columnId, taskId, editingContent)
//     setEditingTask(null)
//   }

//   useEffect(() => {
//     fetchTodos()
//   }, [])

//   const fetchTodos = async () => {
//     try {
//       const response = await fetch("/api/users")
//       if (!response.ok) throw new Error("Failed to fetch tasks")

//       const tasks = await response.json()
//       setColumns((prev) =>
//         prev.map((col) => ({
//           ...col,
//           tasks: tasks.filter((task: any) => task.status === col.id),
//         })),
//       )
//       setIsLoading(false)
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch tasks.",
//         variant: "destructive",
//       })
//       setIsLoading(false)
//     }
//   }

//   const onDragStart = (start: any) => {
//     setDraggedTask(start.draggableId)
//   }

//   const onDragEnd = useCallback(
//     async (result: DropResult) => {
//       setDraggedTask(null)
//       if (!result.destination) return

//       const { source, destination } = result
//       const sourceCol = columns.find((col) => col.id === source.droppableId)
//       const destCol = columns.find((col) => col.id === destination.droppableId)

//       if (!sourceCol || !destCol) return

//       const sourceTasks = [...sourceCol.tasks]
//       const destTasks = [...destCol.tasks]
//       const [moved] = sourceTasks.splice(source.index, 1)
//       const updated = { ...moved, status: destCol.id }
//       destTasks.splice(destination.index, 0, updated)

//       setColumns((prev) =>
//         prev.map((col) => {
//           if (col.id === sourceCol.id) return { ...col, tasks: sourceTasks }
//           if (col.id === destCol.id) return { ...col, tasks: destTasks }
//           return col
//         }),
//       )

//       try {
//         const res = await fetch(`/api/users`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updated),
//         })
//         if (!res.ok) throw new Error()
//         toast({
//           title: "Success",
//           description: "Task moved successfully!",
//           duration: 2000,
//         })
//       } catch {
//         toast({
//           title: "Error",
//           description: "Failed to move task.",
//           variant: "destructive",
//         })
//       }
//     },
//     [columns, toast],
//   )

//   const addTask = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!newTask.trim()) return

//     const task = {
//       content: newTask.trim(),
//       status: "todo",
//     }

//     try {
//       const response = await fetch("/api/users", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(task),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to add task")
//       }

//       const addedTask = await response.json()

//       setColumns((prevColumns) =>
//         prevColumns.map((col) => (col.id === "todo" ? { ...col, tasks: [...col.tasks, addedTask] } : col)),
//       )

//       setNewTask("")
//       toast({
//         title: "Task Added!",
//         description: "Your new task has been created successfully.",
//         duration: 2000,
//       })
//     } catch (error) {
//       console.error("Error adding task:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add task. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const editTask = useCallback(
//     async (columnId: string, taskId: string, content: string) => {
//       const column = columns.find((col) => col.id === columnId)
//       const task = column?.tasks.find((t) => t.id === taskId)
//       if (!task) return

//       const updated = { ...task, content }

//       try {
//         const res = await fetch(`/api/users`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updated),
//         })
//         if (!res.ok) throw new Error()

//         setColumns((prev) =>
//           prev.map((col) =>
//             col.id === columnId
//               ? {
//                   ...col,
//                   tasks: col.tasks.map((t) => (t.id === taskId ? updated : t)),
//                 }
//               : col,
//           ),
//         )
//         toast({ title: "Updated", description: "Task updated successfully!" })
//       } catch {
//         toast({
//           title: "Error",
//           description: "Failed to update task.",
//           variant: "destructive",
//         })
//       }
//     },
//     [columns, toast],
//   )

//   const deleteTask = useCallback(
//     async (columnId, taskId) => {
//       try {
//         const response = await fetch(`/api/users`, {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ id: taskId }),
//         })

//         if (!response.ok) {
//           throw new Error("Failed to delete task")
//         }

//         setColumns((prevColumns) =>
//           prevColumns.map((col) => {
//             if (col.id === columnId) {
//               return {
//                 ...col,
//                 tasks: col.tasks.filter((task) => task.id !== taskId),
//               }
//             }
//             return col
//           }),
//         )

//         toast({
//           title: "Task Deleted",
//           description: "Task has been removed successfully.",
//           duration: 2000,
//         })
//       } catch (error) {
//         console.error("Error deleting task:", error)
//         toast({
//           title: "Error",
//           description: "Failed to delete task. Please try again.",
//           variant: "destructive",
//         })
//       }
//     },
//     [toast],
//   )

//   const renderKanbanView = () => (
//     <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {columns.map((column) => (
//           <div key={column.id} className="fade-in">
//             <Droppable droppableId={column.id}>
//               {(provided, snapshot) => (
//                 <Card
//                   className={`column-card bg-card shadow-sm border-0 ${snapshot.isDraggingOver ? "ring-2 ring-primary/20 bg-primary/5" : ""}`}
//                 >
//                   <CardHeader className={`${column.color} text-white rounded-t-lg`}>
//                     <CardTitle className="flex justify-between items-center text-lg font-semibold">
//                       {column.title}
//                       <Badge variant="secondary" className="bg-white/20 text-white border-0">
//                         {column.tasks.length}
//                       </Badge>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="p-4">
//                     <ul ref={provided.innerRef} {...provided.droppableProps} className="min-h-[400px] space-y-3">
//                       {column.tasks.map((task, index) => (
//                         <Draggable key={task.id} draggableId={String(task.id)} index={index}>
//                           {(provided, snapshot) => (
//                             <li
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               className={`task-card bg-background p-4 rounded-xl border shadow-sm hover:shadow-md ${
//                                 snapshot.isDragging ? "task-card-dragging shadow-2xl" : ""
//                               } ${draggedTask === String(task.id) ? "opacity-50" : ""}`}
//                             >
//                               {editingTask === task.id ? (
//                                 <div className="flex items-center gap-2">
//                                   <Input
//                                     value={editingContent}
//                                     onChange={(e) => setEditingContent(e.target.value)}
//                                     className="flex-grow border-primary/20 focus:border-primary"
//                                     autoFocus
//                                   />
//                                   <Button
//                                     size="icon"
//                                     onClick={() => saveEditedTask(column.id, task.id)}
//                                     className="bg-primary hover:bg-primary/90 transition-colors"
//                                   >
//                                     <Check className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               ) : (
//                                 <div className="flex justify-between items-start gap-3">
//                                   <span className="text-sm font-medium text-foreground leading-relaxed flex-grow">
//                                     {task.content}
//                                   </span>
//                                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                     <Button
//                                       size="icon"
//                                       variant="ghost"
//                                       className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
//                                       onClick={() => startEditingTask(task.id, task.content)}
//                                     >
//                                       <Edit className="h-3 w-3" />
//                                     </Button>
//                                     <AlertDialog>
//                                       <AlertDialogTrigger asChild>
//                                         <Button
//                                           size="icon"
//                                           variant="ghost"
//                                           className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
//                                         >
//                                           <Trash2 className="h-3 w-3" />
//                                         </Button>
//                                       </AlertDialogTrigger>
//                                       <AlertDialogContent className="border-0 shadow-2xl">
//                                         <AlertDialogHeader>
//                                           <AlertDialogTitle className="text-foreground">Delete Task?</AlertDialogTitle>
//                                           <AlertDialogDescription className="text-muted-foreground">
//                                             This action cannot be undone. The task will be permanently removed.
//                                           </AlertDialogDescription>
//                                         </AlertDialogHeader>
//                                         <AlertDialogFooter>
//                                           <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
//                                           <AlertDialogAction
//                                             onClick={() => deleteTask(column.id, task.id)}
//                                             className="bg-destructive hover:bg-destructive/90"
//                                           >
//                                             Delete
//                                           </AlertDialogAction>
//                                         </AlertDialogFooter>
//                                       </AlertDialogContent>
//                                     </AlertDialog>
//                                   </div>
//                                 </div>
//                               )}
//                             </li>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                       {column.tasks.length === 0 && (
//                         <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
//                           <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
//                             <Sparkles className="w-8 h-8" />
//                           </div>
//                           <p className="text-sm font-medium">No tasks yet</p>
//                           <p className="text-xs">Drag tasks here or create new ones</p>
//                         </div>
//                       )}
//                     </ul>
//                   </CardContent>
//                 </Card>
//               )}
//             </Droppable>
//           </div>
//         ))}
//       </div>
//     </DragDropContext>
//   )

//   const renderListView = () => (
//     <div className="space-y-6">
//       {columns.map((column, columnIndex) => (
//         <Card
//           key={column.id}
//           className="column-card bg-card shadow-sm border-0 slide-up"
//           style={{ animationDelay: `${columnIndex * 0.1}s` }}
//         >
//           <CardHeader className={`${column.color} text-white rounded-t-lg`}>
//             <CardTitle className="flex justify-between items-center text-lg font-semibold">
//               {column.title}
//               <Badge variant="secondary" className="bg-white/20 text-white border-0">
//                 {column.tasks.length}
//               </Badge>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-4">
//             {column.tasks.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
//                 <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
//                   <Sparkles className="w-6 h-6" />
//                 </div>
//                 <p className="text-sm font-medium">No tasks in this category</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {column.tasks.map((task, taskIndex) => (
//                   <div
//                     key={task.id}
//                     className="task-card bg-background p-4 rounded-xl border shadow-sm group fade-in"
//                     style={{ animationDelay: `${taskIndex * 0.05}s` }}
//                   >
//                     {editingTask === task.id ? (
//                       <div className="flex items-center gap-2">
//                         <Input
//                           value={editingContent}
//                           onChange={(e) => setEditingContent(e.target.value)}
//                           className="flex-grow border-primary/20 focus:border-primary"
//                           autoFocus
//                         />
//                         <Button
//                           size="icon"
//                           onClick={() => saveEditedTask(column.id, task.id)}
//                           className="bg-primary hover:bg-primary/90 transition-colors"
//                         >
//                           <Check className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     ) : (
//                       <div className="flex justify-between items-center">
//                         <div className="flex items-center gap-3">
//                           <div className={`w-3 h-3 rounded-full ${column.color} shadow-sm`} />
//                           <span className="font-medium text-foreground leading-relaxed">{task.content}</span>
//                         </div>
//                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                           <Button
//                             size="icon"
//                             variant="ghost"
//                             className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
//                             onClick={() => startEditingTask(task.id, task.content)}
//                           >
//                             <Edit className="h-3 w-3" />
//                           </Button>
//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button
//                                 size="icon"
//                                 variant="ghost"
//                                 className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
//                               >
//                                 <Trash2 className="h-3 w-3" />
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent className="border-0 shadow-2xl">
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle className="text-foreground">Delete Task?</AlertDialogTitle>
//                                 <AlertDialogDescription className="text-muted-foreground">
//                                   This action cannot be undone. The task will be permanently removed.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() => deleteTask(column.id, task.id)}
//                                   className="bg-destructive hover:bg-destructive/90"
//                                 >
//                                   Delete
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )

//   if (isLoading) {
//     return (
//       <div className="container mx-auto p-6 max-w-6xl">
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="flex flex-col items-center gap-4">
//             <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
//             <p className="text-muted-foreground">Loading your tasks...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto p-6 max-w-6xl">
//       <div className="text-center mb-8 fade-in">
//         <h1 className="text-5xl font-bold mb-2 gradient-bg bg-clip-text text-transparent">Kanban Todo</h1>
//         <p className="text-muted-foreground text-lg">Organize your tasks with style</p>
//       </div>

//       <form onSubmit={addTask} className="mb-8 bounce-in">
//         <div className="flex gap-3 max-w-2xl mx-auto">
//           <Input
//             type="text"
//             value={newTask}
//             onChange={(e) => setNewTask(e.target.value)}
//             placeholder="What needs to be done?"
//             className="flex-grow h-12 text-base border-border focus:border-primary transition-colors"
//           />
//           <Button type="submit" className="h-12 px-6 bg-primary hover:bg-primary/90 transition-all hover:scale-105">
//             <Plus className="mr-2 h-5 w-5" /> Add Task
//           </Button>
//         </div>
//       </form>

//       <Tabs value={viewMode} onValueChange={setViewMode} className="mb-8">
//         <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-muted p-1 h-12">
//           <TabsTrigger
//             value="kanban"
//             className="h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
//           >
//             <LayoutDashboard className="mr-2 h-4 w-4" /> Kanban
//           </TabsTrigger>
//           <TabsTrigger
//             value="list"
//             className="h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
//           >
//             <List className="mr-2 h-4 w-4" /> List
//           </TabsTrigger>
//         </TabsList>
//         <TabsContent value="kanban" className="mt-8">
//           {renderKanbanView()}
//         </TabsContent>
//         <TabsContent value="list" className="mt-8">
//           {renderListView()}
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// export default KanbanTodo
// "use client"

// import type React from "react"
// import { useState, useEffect, useCallback } from "react"
// import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
// import { Plus, LayoutDashboard, List, Edit, Trash2, Check, Sparkles } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { useToast } from "@/hooks/use-toast"

// const KanbanTodo = () => {
//   const [columns, setColumns] = useState([
//     { id: "todo", title: "To Do", tasks: [], color: "bg-primary", textColor: "text-primary" },
//     {
//       id: "inprogress",
//       title: "In Progress",
//       tasks: [],
//       color: "bg-amber-500",
//       textColor: "text-amber-500",
//     },
//     { id: "done", title: "Done", tasks: [], color: "bg-emerald-500", textColor: "text-emerald-500" },
//   ])
//   const [newTask, setNewTask] = useState("")
//   const [viewMode, setViewMode] = useState("kanban")
//   const [isLoading, setIsLoading] = useState(true)
//   const { toast } = useToast()
//   const [editingTask, setEditingTask] = useState<string | null>(null)
//   const [editingContent, setEditingContent] = useState("")
//   const [draggedTask, setDraggedTask] = useState<string | null>(null)

//   const startEditingTask = (taskId: string, currentContent: string) => {
//     setEditingTask(taskId)
//     setEditingContent(currentContent)
//   }

//   const saveEditedTask = async (columnId: string, taskId: string) => {
//     await editTask(columnId, taskId, editingContent)
//     setEditingTask(null)
//   }

//   useEffect(() => {
//     fetchTodos()
//   }, [])

//   const fetchTodos = async () => {
//     try {
//       const response = await fetch("/api/users")
//       if (!response.ok) throw new Error("Failed to fetch tasks")

//       const tasks = await response.json()
//       setColumns((prev) =>
//         prev.map((col) => ({
//           ...col,
//           tasks: tasks.filter((task: any) => task.status === col.id),
//         })),
//       )
//       setIsLoading(false)
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch tasks.",
//         variant: "destructive",
//       })
//       setIsLoading(false)
//     }
//   }

//   const onDragStart = (start: any) => {
//     setDraggedTask(start.draggableId)
//   }

//   const onDragEnd = useCallback(
//     async (result: DropResult) => {
//       setDraggedTask(null)
//       if (!result.destination) return

//       const { source, destination } = result
//       const sourceCol = columns.find((col) => col.id === source.droppableId)
//       const destCol = columns.find((col) => col.id === destination.droppableId)

//       if (!sourceCol || !destCol) return

//       const sourceTasks = [...sourceCol.tasks]
//       const destTasks = [...destCol.tasks]
//       const [moved] = sourceTasks.splice(source.index, 1)
//       const updated = { ...moved, status: destCol.id }
//       destTasks.splice(destination.index, 0, updated)

//       setColumns((prev) =>
//         prev.map((col) => {
//           if (col.id === sourceCol.id) return { ...col, tasks: sourceTasks }
//           if (col.id === destCol.id) return { ...col, tasks: destTasks }
//           return col
//         }),
//       )

//       try {
//         const res = await fetch(`/api/users`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updated),
//         })
//         if (!res.ok) throw new Error()
//         toast({
//           title: "Success",
//           description: "Task moved successfully!",
//           duration: 2000,
//         })
//       } catch {
//         toast({
//           title: "Error",
//           description: "Failed to move task.",
//           variant: "destructive",
//         })
//       }
//     },
//     [columns, toast],
//   )

//   const addTask = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!newTask.trim()) return

//     const task = {
//       content: newTask.trim(),
//       status: "todo",
//     }

//     try {
//       const response = await fetch("/api/users", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(task),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to add task")
//       }

//       const addedTask = await response.json()

//       setColumns((prevColumns) =>
//         prevColumns.map((col) => (col.id === "todo" ? { ...col, tasks: [...col.tasks, addedTask] } : col)),
//       )

//       setNewTask("")
//       toast({
//         title: "Task Added!",
//         description: "Your new task has been created successfully.",
//         duration: 2000,
//       })
//     } catch (error) {
//       console.error("Error adding task:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add task. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const editTask = useCallback(
//     async (columnId: string, taskId: string, content: string) => {
//       const column = columns.find((col) => col.id === columnId)
//       const task = column?.tasks.find((t) => t.id === taskId)
//       if (!task) return

//       const updated = { ...task, content }

//       try {
//         const res = await fetch(`/api/users`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updated),
//         })
//         if (!res.ok) throw new Error()

//         setColumns((prev) =>
//           prev.map((col) =>
//             col.id === columnId
//               ? {
//                   ...col,
//                   tasks: col.tasks.map((t) => (t.id === taskId ? updated : t)),
//                 }
//               : col,
//           ),
//         )
//         toast({ title: "Updated", description: "Task updated successfully!" })
//       } catch {
//         toast({
//           title: "Error",
//           description: "Failed to update task.",
//           variant: "destructive",
//         })
//       }
//     },
//     [columns, toast],
//   )

//   const deleteTask = useCallback(
//     async (columnId, taskId) => {
//       try {
//         const response = await fetch(`/api/users`, {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ id: taskId }),
//         })

//         if (!response.ok) {
//           throw new Error("Failed to delete task")
//         }

//         setColumns((prevColumns) =>
//           prevColumns.map((col) => {
//             if (col.id === columnId) {
//               return {
//                 ...col,
//                 tasks: col.tasks.filter((task) => task.id !== taskId),
//               }
//             }
//             return col
//           }),
//         )

//         toast({
//           title: "Task Deleted",
//           description: "Task has been removed successfully.",
//           duration: 2000,
//         })
//       } catch (error) {
//         console.error("Error deleting task:", error)
//         toast({
//           title: "Error",
//           description: "Failed to delete task. Please try again.",
//           variant: "destructive",
//         })
//       }
//     },
//     [toast],
//   )

//   const renderKanbanView = () => (
//     <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {columns.map((column) => (
//           <div key={column.id} className="fade-in">
//             <Droppable droppableId={column.id}>
//               {(provided, snapshot) => (
//                 <Card
//                   className={`column-card bg-card shadow-sm border-0 ${snapshot.isDraggingOver ? "ring-2 ring-primary/20 bg-primary/5" : ""}`}
//                 >
//                   <CardHeader className={`${column.color} text-white rounded-t-lg`}>
//                     <CardTitle className="flex justify-between items-center text-lg font-semibold">
//                       {column.title}
//                       <Badge variant="secondary" className="bg-white/20 text-white border-0">
//                         {column.tasks.length}
//                       </Badge>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="p-4">
//                     <ul ref={provided.innerRef} {...provided.droppableProps} className="min-h-[400px] space-y-3">
//                       {column.tasks.map((task, index) => (
//                         <Draggable key={task.id} draggableId={String(task.id)} index={index}>
//                           {(provided, snapshot) => (
//                             <li
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               tabIndex={0}
//                               className={`group bg-background p-4 rounded-xl border shadow-sm hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-shadow ${
//                                 snapshot.isDragging ? "shadow-2xl" : ""
//                               } ${draggedTask === String(task.id) ? "opacity-50" : ""}`}
//                             >
//                               {editingTask === task.id ? (
//                                 <div className="flex items-center gap-2">
//                                   <Input
//                                     value={editingContent}
//                                     onChange={(e) => setEditingContent(e.target.value)}
//                                     onKeyDown={(e) => {
//                                       if (e.key === "Enter") saveEditedTask(column.id, task.id)
//                                       if (e.key === "Escape") {
//                                         setEditingTask(null)
//                                         setEditingContent("")
//                                       }
//                                     }}
//                                     className="flex-grow border-primary/20 focus:border-primary"
//                                     autoFocus
//                                   />
//                                   <Button
//                                     size="icon"
//                                     onClick={() => saveEditedTask(column.id, task.id)}
//                                     className="bg-primary hover:bg-primary/90 transition-colors"
//                                     aria-label="Save task"
//                                   >
//                                     <Check className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               ) : (
//                                 <div className="flex justify-between items-start gap-3">
//                                   <span className="text-sm font-medium text-foreground leading-relaxed flex-grow">
//                                     {task.content}
//                                   </span>
//                                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                     <Button
//                                       size="icon"
//                                       variant="ghost"
//                                       className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
//                                       onClick={() => startEditingTask(task.id, task.content)}
//                                       aria-label="Edit task"
//                                     >
//                                       <Edit className="h-3 w-3" />
//                                     </Button>
//                                     <AlertDialog>
//                                       <AlertDialogTrigger asChild>
//                                         <Button
//                                           size="icon"
//                                           variant="ghost"
//                                           className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
//                                           aria-label="Delete task"
//                                         >
//                                           <Trash2 className="h-3 w-3" />
//                                         </Button>
//                                       </AlertDialogTrigger>
//                                       <AlertDialogContent className="border-0 shadow-2xl">
//                                         <AlertDialogHeader>
//                                           <AlertDialogTitle className="text-foreground">Delete Task?</AlertDialogTitle>
//                                           <AlertDialogDescription className="text-muted-foreground">
//                                             This action cannot be undone. The task will be permanently removed.
//                                           </AlertDialogDescription>
//                                         </AlertDialogHeader>
//                                         <AlertDialogFooter>
//                                           <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
//                                           <AlertDialogAction
//                                             onClick={() => deleteTask(column.id, task.id)}
//                                             className="bg-destructive hover:bg-destructive/90"
//                                           >
//                                             Delete
//                                           </AlertDialogAction>
//                                         </AlertDialogFooter>
//                                       </AlertDialogContent>
//                                     </AlertDialog>
//                                   </div>
//                                 </div>
//                               )}
//                             </li>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                       {column.tasks.length === 0 && (
//                         <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
//                           <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
//                             <Sparkles className="w-8 h-8" />
//                           </div>
//                           <p className="text-sm font-medium">No tasks yet</p>
//                           <p className="text-xs">Drag tasks here or create new ones</p>
//                         </div>
//                       )}
//                     </ul>
//                   </CardContent>
//                 </Card>
//               )}
//             </Droppable>
//           </div>
//         ))}
//       </div>
//     </DragDropContext>
//   )

//   const renderListView = () => (
//     <div className="space-y-6">
//       {columns.map((column, columnIndex) => (
//         <Card
//           key={column.id}
//           className="column-card bg-card shadow-sm border-0 slide-up"
//           style={{ animationDelay: `${columnIndex * 0.1}s` }}
//         >
//           <CardHeader className={`${column.color} text-white rounded-t-lg`}>
//             <CardTitle className="flex justify-between items-center text-lg font-semibold">
//               {column.title}
//               <Badge variant="secondary" className="bg-white/20 text-white border-0">
//                 {column.tasks.length}
//               </Badge>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-4">
//             {column.tasks.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
//                 <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
//                   <Sparkles className="w-6 h-6" />
//                 </div>
//                 <p className="text-sm font-medium">No tasks in this category</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {column.tasks.map((task, taskIndex) => (
//                   <div
//                     key={task.id}
//                     className="task-card bg-background p-4 rounded-xl border shadow-sm group fade-in"
//                     style={{ animationDelay: `${taskIndex * 0.05}s` }}
//                   >
//                     {editingTask === task.id ? (
//                       <div className="flex items-center gap-2">
//                         <Input
//                           value={editingContent}
//                           onChange={(e) => setEditingContent(e.target.value)}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") saveEditedTask(column.id, task.id)
//                             if (e.key === "Escape") {
//                               setEditingTask(null)
//                               setEditingContent("")
//                             }
//                           }}
//                           className="flex-grow border-primary/20 focus:border-primary"
//                           autoFocus
//                         />
//                         <Button
//                           size="icon"
//                           onClick={() => saveEditedTask(column.id, task.id)}
//                           className="bg-primary hover:bg-primary/90 transition-colors"
//                           aria-label="Save task"
//                         >
//                           <Check className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     ) : (
//                       <div className="flex justify-between items-center">
//                         <div className="flex items-center gap-3">
//                           <div className={`w-3 h-3 rounded-full ${column.color} shadow-sm`} />
//                           <span className="font-medium text-foreground leading-relaxed">{task.content}</span>
//                         </div>
//                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                           <Button
//                             size="icon"
//                             variant="ghost"
//                             className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
//                             onClick={() => startEditingTask(task.id, task.content)}
//                             aria-label="Edit task"
//                           >
//                             <Edit className="h-3 w-3" />
//                           </Button>
//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button
//                                 size="icon"
//                                 variant="ghost"
//                                 className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
//                                 aria-label="Delete task"
//                               >
//                                 <Trash2 className="h-3 w-3" />
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent className="border-0 shadow-2xl">
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle className="text-foreground">Delete Task?</AlertDialogTitle>
//                                 <AlertDialogDescription className="text-muted-foreground">
//                                   This action cannot be undone. The task will be permanently removed.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() => deleteTask(column.id, task.id)}
//                                   className="bg-destructive hover:bg-destructive/90"
//                                 >
//                                   Delete
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )

//   if (isLoading) {
//     return (
//       <div className="container mx-auto p-6 max-w-6xl">
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="flex flex-col items-center gap-4">
//             <div
//               className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
//               aria-hidden="true"
//             />
//             <span className="sr-only">Loading</span>
//             <p className="text-muted-foreground">Loading your tasks...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto p-6 max-w-6xl">
//       <div className="text-center mb-8">
//         <h1 className="text-4xl md:text-5xl font-bold mb-2 text-balance text-foreground">Kanban Todo</h1>
//         <p className="text-muted-foreground text-lg">Organize your tasks with style</p>
//       </div>

//       <form onSubmit={addTask} className="mb-8 bounce-in">
//         <div className="flex gap-3 max-w-2xl mx-auto">
//           <Input
//             type="text"
//             value={newTask}
//             onChange={(e) => setNewTask(e.target.value)}
//             placeholder="What needs to be done?"
//             className="flex-grow h-12 text-base border-border focus:border-primary transition-colors"
//           />
//           <Button type="submit" className="h-12 px-6 bg-primary hover:bg-primary/90 transition-all hover:scale-105">
//             <Plus className="mr-2 h-5 w-5" /> Add Task
//           </Button>
//         </div>
//       </form>

//       <Tabs value={viewMode} onValueChange={setViewMode} className="mb-8">
//         <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-muted p-1 h-12 rounded-lg shadow-sm">
//           <TabsTrigger
//             value="kanban"
//             className="h-10 rounded-md focus-visible:ring-2 focus-visible:ring-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
//             aria-label="Kanban view"
//           >
//             <LayoutDashboard className="mr-2 h-4 w-4" /> Kanban
//           </TabsTrigger>
//           <TabsTrigger
//             value="list"
//             className="h-10 rounded-md focus-visible:ring-2 focus-visible:ring-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
//             aria-label="List view"
//           >
//             <List className="mr-2 h-4 w-4" /> List
//           </TabsTrigger>
//         </TabsList>
//         <TabsContent value="kanban" className="mt-8">
//           {renderKanbanView()}
//         </TabsContent>
//         <TabsContent value="list" className="mt-8">
//           {renderListView()}
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// export default KanbanTodo

// "use client"

// import type React from "react"
// import { useState, useEffect, useCallback, useMemo } from "react"
// import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
// import {
//   Plus,
//   LayoutDashboard,
//   List,
//   Edit,
//   Trash2,
//   Check,
//   Sparkles,
//   Search,
//   ArrowUpDown,
//   ArrowUp,
//   ArrowDown,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { useToast } from "@/hooks/use-toast"
// // import AiAssistant from "@/components/ai-assistant"
// import AiAssistant from "@/components/ai_assistant"

// const KanbanTodo = () => {
//   const [columns, setColumns] = useState([
//     { id: "todo", title: "To Do", tasks: [], color: "bg-primary", textColor: "text-primary" },
//     {
//       id: "inprogress",
//       title: "In Progress",
//       tasks: [],
//       color: "bg-amber-500",
//       textColor: "text-amber-500",
//     },
//     { id: "done", title: "Done", tasks: [], color: "bg-emerald-500", textColor: "text-emerald-500" },
//   ])
//   const [newTask, setNewTask] = useState("")
//   const [viewMode, setViewMode] = useState("kanban")
//   const [isLoading, setIsLoading] = useState(true)
//   const { toast } = useToast()
//   const [editingTask, setEditingTask] = useState<string | null>(null)
//   const [editingContent, setEditingContent] = useState("")
//   const [draggedTask, setDraggedTask] = useState<string | null>(null)

//   const [searchQuery, setSearchQuery] = useState("")
//   const [sortField, setSortField] = useState<"content" | "status" | "none">("none")
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
//   const [statusFilter, setStatusFilter] = useState<string>("all")

//   const allTasks = useMemo(() => {
//     return columns.flatMap((column) =>
//       column.tasks.map((task) => ({
//         ...task,
//         status: column.id,
//         statusTitle: column.title,
//         statusColor: column.color,
//       })),
//     )
//   }, [columns])

//   const filteredAndSortedTasks = useMemo(() => {
//     let filtered = allTasks

//     // Apply search filter
//     if (searchQuery.trim()) {
//       filtered = filtered.filter((task) => task.content.toLowerCase().includes(searchQuery.toLowerCase()))
//     }

//     // Apply status filter
//     if (statusFilter !== "all") {
//       filtered = filtered.filter((task) => task.status === statusFilter)
//     }

//     // Apply sorting
//     if (sortField !== "none") {
//       filtered = [...filtered].sort((a, b) => {
//         const aValue = sortField === "content" ? a.content : a.statusTitle
//         const bValue = sortField === "content" ? b.content : b.statusTitle

//         const comparison = aValue.localeCompare(bValue)
//         return sortDirection === "asc" ? comparison : -comparison
//       })
//     }

//     return filtered
//   }, [allTasks, searchQuery, statusFilter, sortField, sortDirection])

//   const handleSort = (field: "content" | "status") => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc")
//     } else {
//       setSortField(field)
//       setSortDirection("asc")
//     }
//   }

//   const startEditingTask = (taskId: string, currentContent: string) => {
//     setEditingTask(taskId)
//     setEditingContent(currentContent)
//   }

//   const saveEditedTask = async (columnId: string, taskId: string) => {
//     await editTask(columnId, taskId, editingContent)
//     setEditingTask(null)
//   }

//   useEffect(() => {
//     fetchTodos()
//   }, [])

//   const fetchTodos = async () => {
//     try {
//       const response = await fetch("/api/users")
//       if (!response.ok) throw new Error("Failed to fetch tasks")

//       const tasks = await response.json()
//       setColumns((prev) =>
//         prev.map((col) => ({
//           ...col,
//           tasks: tasks.filter((task: any) => task.status === col.id),
//         })),
//       )
//       setIsLoading(false)
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch tasks.",
//         variant: "destructive",
//       })
//       setIsLoading(false)
//     }
//   }

//   const onDragStart = (start: any) => {
//     setDraggedTask(start.draggableId)
//   }

//   const onDragEnd = useCallback(
//     async (result: DropResult) => {
//       setDraggedTask(null)
//       if (!result.destination) return

//       const { source, destination } = result
//       const sourceCol = columns.find((col) => col.id === source.droppableId)
//       const destCol = columns.find((col) => col.id === destination.droppableId)

//       if (!sourceCol || !destCol) return

//       const sourceTasks = [...sourceCol.tasks]
//       const destTasks = [...destCol.tasks]
//       const [moved] = sourceTasks.splice(source.index, 1)
//       const updated = { ...moved, status: destCol.id }
//       destTasks.splice(destination.index, 0, updated)

//       setColumns((prev) =>
//         prev.map((col) => {
//           if (col.id === sourceCol.id) return { ...col, tasks: sourceTasks }
//           if (col.id === destCol.id) return { ...col, tasks: destTasks }
//           return col
//         }),
//       )

//       try {
//         const res = await fetch(`/api/users`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updated),
//         })
//         if (!res.ok) throw new Error()
//         toast({
//           title: "Success",
//           description: "Task moved successfully!",
//           duration: 2000,
//         })
//       } catch {
//         toast({
//           title: "Error",
//           description: "Failed to move task.",
//           variant: "destructive",
//         })
//       }
//     },
//     [columns, toast],
//   )

//   const addTask = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!newTask.trim()) return

//     const task = {
//       content: newTask.trim(),
//       status: "todo",
//     }

//     try {
//       const response = await fetch("/api/users", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(task),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to add task")
//       }

//       const addedTask = await response.json()

//       setColumns((prevColumns) =>
//         prevColumns.map((col) => (col.id === "todo" ? { ...col, tasks: [...col.tasks, addedTask] } : col)),
//       )

//       setNewTask("")
//       toast({
//         title: "Task Added!",
//         description: "Your new task has been created successfully.",
//         duration: 2000,
//       })
//     } catch (error) {
//       console.error("Error adding task:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add task. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const addTasksFromAI = useCallback(
//     async (tasks: { title: string; description?: string }[], status: string) => {
//       try {
//         const created: any[] = []
//         for (const t of tasks) {
//           const payload = { content: t.title + (t.description ? ` — ${t.description}` : ""), status }
//           const res = await fetch("/api/users", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//           })
//           if (res.ok) {
//             const item = await res.json()
//             created.push(item)
//           }
//         }
//         if (created.length) {
//           setColumns((prev) =>
//             prev.map((col) => (col.id === status ? { ...col, tasks: [...col.tasks, ...created] } : col)),
//           )
//         }
//       } catch {
//         toast({ title: "Error", description: "Failed to add AI tasks.", variant: "destructive" })
//       }
//     },
//     [toast],
//   )

//   const getBoard = useCallback(() => {
//     return {
//       columns: columns.map((c: any) => ({
//         id: c.id,
//         title: c.title,
//         tasks: (c.tasks || []).map((t: any) => ({ id: t.id, title: t.content })),
//       })),
//     }
//   }, [columns])

//   const editTask = useCallback(
//     async (columnId: string, taskId: string, content: string) => {
//       const column = columns.find((col) => col.id === columnId)
//       const task = column?.tasks.find((t) => t.id === taskId)
//       if (!task) return

//       const updated = { ...task, content }

//       try {
//         const res = await fetch(`/api/users`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updated),
//         })
//         if (!res.ok) throw new Error()

//         setColumns((prev) =>
//           prev.map((col) =>
//             col.id === columnId
//               ? {
//                   ...col,
//                   tasks: col.tasks.map((t) => (t.id === taskId ? updated : t)),
//                 }
//               : col,
//           ),
//         )
//         toast({ title: "Updated", description: "Task updated successfully!" })
//       } catch {
//         toast({
//           title: "Error",
//           description: "Failed to update task.",
//           variant: "destructive",
//         })
//       }
//     },
//     [columns, toast],
//   )

//   const deleteTask = useCallback(
//     async (columnId, taskId) => {
//       try {
//         const response = await fetch(`/api/users`, {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ id: taskId }),
//         })

//         if (!response.ok) {
//           throw new Error("Failed to delete task")
//         }

//         setColumns((prevColumns) =>
//           prevColumns.map((col) => {
//             if (col.id === columnId) {
//               return {
//                 ...col,
//                 tasks: col.tasks.filter((task) => task.id !== taskId),
//               }
//             }
//             return col
//           }),
//         )

//         toast({
//           title: "Task Deleted",
//           description: "Task has been removed successfully.",
//           duration: 2000,
//         })
//       } catch (error) {
//         console.error("Error deleting task:", error)
//         toast({
//           title: "Error",
//           description: "Failed to delete task. Please try again.",
//           variant: "destructive",
//         })
//       }
//     },
//     [toast],
//   )

//   const updateTaskStatus = useCallback(
//     async (taskId: string, newStatus: string) => {
//       const currentTask = allTasks.find((task) => task.id === taskId)
//       if (!currentTask) return

//       const updated = { ...currentTask, status: newStatus }

//       try {
//         const res = await fetch(`/api/users`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updated),
//         })
//         if (!res.ok) throw new Error()

//         setColumns((prev) =>
//           prev.map((col) => {
//             if (col.id === currentTask.status) {
//               return {
//                 ...col,
//                 tasks: col.tasks.filter((t) => t.id !== taskId),
//               }
//             }
//             if (col.id === newStatus) {
//               return {
//                 ...col,
//                 tasks: [...col.tasks, { ...currentTask, status: newStatus }],
//               }
//             }
//             return col
//           }),
//         )
//         toast({ title: "Updated", description: "Task status updated successfully!" })
//       } catch {
//         toast({
//           title: "Error",
//           description: "Failed to update task status.",
//           variant: "destructive",
//         })
//       }
//     },
//     [allTasks, toast],
//   )

//   const renderKanbanView = () => (
//     <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {columns.map((column) => (
//           <div key={column.id} className="fade-in">
//             <Droppable droppableId={column.id}>
//               {(provided, snapshot) => (
//                 <Card
//                   className={`column-card bg-card shadow-sm border-0 ${snapshot.isDraggingOver ? "ring-2 ring-primary/20 bg-primary/5" : ""}`}
//                 >
//                   <CardHeader className={`${column.color} text-white rounded-t-lg`}>
//                     <CardTitle className="flex justify-between items-center text-lg font-semibold">
//                       {column.title}
//                       <Badge variant="secondary" className="bg-black/30 text-white border-0 font-medium">
//                         {column.tasks.length}
//                       </Badge>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="p-4">
//                     <ul
//                       ref={provided.innerRef}
//                       {...provided.droppableProps}
//                       className="min-h-[400px] max-h-[600px] overflow-y-auto space-y-3 pr-2"
//                     >
//                       {column.tasks.map((task, index) => (
//                         <Draggable key={task.id} draggableId={String(task.id)} index={index}>
//                           {(provided, snapshot) => (
//                             <li
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               tabIndex={0}
//                               className={`group bg-background p-4 rounded-xl border shadow-sm hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-shadow ${
//                                 snapshot.isDragging ? "shadow-2xl" : ""
//                               } ${draggedTask === String(task.id) ? "opacity-50" : ""}`}
//                             >
//                               {editingTask === task.id ? (
//                                 <div className="flex items-center gap-2">
//                                   <Input
//                                     value={editingContent}
//                                     onChange={(e) => setEditingContent(e.target.value)}
//                                     onKeyDown={(e) => {
//                                       if (e.key === "Enter") saveEditedTask(column.id, task.id)
//                                       if (e.key === "Escape") {
//                                         setEditingTask(null)
//                                         setEditingContent("")
//                                       }
//                                     }}
//                                     className="flex-grow border-primary/20 focus:border-primary transition-colors"
//                                     autoFocus
//                                   />
//                                   <Button
//                                     size="icon"
//                                     onClick={() => saveEditedTask(column.id, task.id)}
//                                     className="bg-primary hover:bg-primary/90 transition-colors"
//                                     aria-label="Save task"
//                                   >
//                                     <Check className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               ) : (
//                                 <div className="flex justify-between items-start gap-3">
//                                   <span className="text-sm font-medium text-foreground leading-relaxed flex-grow">
//                                     {task.content}
//                                   </span>
//                                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                     <Button
//                                       size="icon"
//                                       variant="ghost"
//                                       className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
//                                       onClick={() => startEditingTask(task.id, task.content)}
//                                       aria-label="Edit task"
//                                     >
//                                       <Edit className="h-3 w-3" />
//                                     </Button>
//                                     <AlertDialog>
//                                       <AlertDialogTrigger asChild>
//                                         <Button
//                                           size="icon"
//                                           variant="ghost"
//                                           className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
//                                           aria-label="Delete task"
//                                         >
//                                           <Trash2 className="h-3 w-3" />
//                                         </Button>
//                                       </AlertDialogTrigger>
//                                       <AlertDialogContent className="border-0 shadow-2xl">
//                                         <AlertDialogHeader>
//                                           <AlertDialogTitle className="text-foreground">Delete Task?</AlertDialogTitle>
//                                           <AlertDialogDescription className="text-muted-foreground">
//                                             This action cannot be undone. The task will be permanently removed.
//                                           </AlertDialogDescription>
//                                         </AlertDialogHeader>
//                                         <AlertDialogFooter>
//                                           <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
//                                           <AlertDialogAction
//                                             onClick={() => deleteTask(column.id, task.id)}
//                                             className="bg-destructive hover:bg-destructive/90"
//                                           >
//                                             Delete
//                                           </AlertDialogAction>
//                                         </AlertDialogFooter>
//                                       </AlertDialogContent>
//                                     </AlertDialog>
//                                   </div>
//                                 </div>
//                               )}
//                             </li>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                       {column.tasks.length === 0 && (
//                         <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
//                           <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
//                             <Sparkles className="w-8 h-8" />
//                           </div>
//                           <p className="text-sm font-medium">No tasks yet</p>
//                           <p className="text-xs">Drag tasks here or create new ones</p>
//                         </div>
//                       )}
//                     </ul>
//                   </CardContent>
//                 </Card>
//               )}
//             </Droppable>
//           </div>
//         ))}
//       </div>
//     </DragDropContext>
//   )

//   const renderListView = () => (
//     <div className="space-y-6">
//       {/* Search and Filter Controls */}
//       <Card className="bg-card shadow-sm border-0">
//         <CardContent className="p-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//               <Input
//                 placeholder="Search tasks..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 h-10"
//               />
//             </div>
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-full md:w-48 h-10">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="todo">To Do</SelectItem>
//                 <SelectItem value="inprogress">In Progress</SelectItem>
//                 <SelectItem value="done">Done</SelectItem>
//               </SelectContent>
//             </Select>
//             <div className="text-sm text-muted-foreground flex items-center">
//               {filteredAndSortedTasks.length} of {allTasks.length} tasks
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Tasks Table */}
//       <Card className="bg-card shadow-sm border-0">
//         <CardContent className="p-0">
//           <div className="max-h-[300px] overflow-y-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="border-b">
//                   <TableHead className="w-12">#</TableHead>
//                   <TableHead className="min-w-[300px]">
//                     <Button
//                       variant="ghost"
//                       className="h-auto p-0 font-semibold hover:bg-transparent"
//                       onClick={() => handleSort("content")}
//                     >
//                       Task
//                       {sortField === "content" &&
//                         (sortDirection === "asc" ? (
//                           <ArrowUp className="ml-2 h-4 w-4" />
//                         ) : (
//                           <ArrowDown className="ml-2 h-4 w-4" />
//                         ))}
//                       {sortField !== "content" && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
//                     </Button>
//                   </TableHead>
//                   <TableHead className="w-40">
//                     <Button
//                       variant="ghost"
//                       className="h-auto p-0 font-semibold hover:bg-transparent"
//                       onClick={() => handleSort("status")}
//                     >
//                       Status
//                       {sortField === "status" &&
//                         (sortDirection === "asc" ? (
//                           <ArrowUp className="ml-2 h-4 w-4" />
//                         ) : (
//                           <ArrowDown className="ml-2 h-4 w-4" />
//                         ))}
//                       {sortField !== "status" && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
//                     </Button>
//                   </TableHead>
//                   <TableHead className="w-32 text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredAndSortedTasks.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={4} className="h-32 text-center">
//                       <div className="flex flex-col items-center justify-center text-muted-foreground">
//                         <Sparkles className="w-8 h-8 mb-2" />
//                         <p className="font-medium">No tasks found</p>
//                         <p className="text-sm">Try adjusting your search or filters</p>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   filteredAndSortedTasks.map((task, index) => (
//                     <TableRow key={task.id} className="group hover:bg-muted/50">
//                       <TableCell className="font-mono text-sm text-muted-foreground">{index + 1}</TableCell>
//                       <TableCell>
//                         {editingTask === task.id ? (
//                           <div className="flex items-center gap-2">
//                             <Input
//                               value={editingContent}
//                               onChange={(e) => setEditingContent(e.target.value)}
//                               onKeyDown={(e) => {
//                                 if (e.key === "Enter") saveEditedTask(task.status, task.id)
//                                 if (e.key === "Escape") {
//                                   setEditingTask(null)
//                                   setEditingContent("")
//                                 }
//                               }}
//                               className="flex-grow border-primary/20 focus:border-primary"
//                               autoFocus
//                             />
//                             <Button
//                               size="icon"
//                               onClick={() => saveEditedTask(task.status, task.id)}
//                               className="bg-primary hover:bg-primary/90 transition-colors h-8 w-8"
//                               aria-label="Save task"
//                             >
//                               <Check className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         ) : (
//                           <span className="font-medium text-foreground leading-relaxed">{task.content}</span>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Select value={task.status} onValueChange={(newStatus) => updateTaskStatus(task.id, newStatus)}>
//                           <SelectTrigger className="w-full h-8">
//                             <div className="flex items-center gap-2">
//                               <div className={`w-2 h-2 rounded-full ${task.statusColor}`} />
//                               <SelectValue />
//                             </div>
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="todo">
//                               <div className="flex items-center gap-2">
//                                 <div className="w-2 h-2 rounded-full bg-primary" />
//                                 To Do
//                               </div>
//                             </SelectItem>
//                             <SelectItem value="inprogress">
//                               <div className="flex items-center gap-2">
//                                 <div className="w-2 h-2 rounded-full bg-amber-500" />
//                                 In Progress
//                               </div>
//                             </SelectItem>
//                             <SelectItem value="done">
//                               <div className="flex items-center gap-2">
//                                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
//                                 Done
//                               </div>
//                             </SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
//                           <Button
//                             size="icon"
//                             variant="ghost"
//                             className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
//                             onClick={() => startEditingTask(task.id, task.content)}
//                             aria-label="Edit task"
//                           >
//                             <Edit className="h-3 w-3" />
//                           </Button>
//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button
//                                 size="icon"
//                                 variant="ghost"
//                                 className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
//                                 aria-label="Delete task"
//                               >
//                                 <Trash2 className="h-3 w-3" />
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent className="border-0 shadow-2xl">
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle className="text-foreground">Delete Task?</AlertDialogTitle>
//                                 <AlertDialogDescription className="text-muted-foreground">
//                                   This action cannot be undone. The task will be permanently removed.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() => deleteTask(task.status, task.id)}
//                                   className="bg-destructive hover:bg-destructive/90"
//                                 >
//                                   Delete
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )

//   if (isLoading) {
//     return (
//       <div className="container mx-auto p-6 max-w-6xl">
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="flex flex-col items-center gap-4">
//             <div
//               className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
//               aria-hidden="true"
//             />
//             <span className="sr-only">Loading</span>
//             <p className="text-muted-foreground">Loading your tasks...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto p-6 max-w-6xl">
//       <div className="text-center mb-8">
//         <h1 className="text-4xl md:text-5xl font-bold mb-2 text-balance text-foreground">i-Tasker</h1>
//         <p className="text-muted-foreground text-lg">Organize your tasks with style</p>
//       </div>

//       <form onSubmit={addTask} className="mb-8 bounce-in">
//         <div className="flex gap-3 max-w-2xl mx-auto">
//           <Input
//             type="text"
//             value={newTask}
//             onChange={(e) => setNewTask(e.target.value)}
//             placeholder="What needs to be done?"
//             className="flex-grow h-12 text-base border-border focus:border-primary transition-colors"
//           />
//           <Button type="submit" className="h-12 px-6 bg-primary hover:bg-primary/90 transition-all hover:scale-105">
//             <Plus className="mr-2 h-5 w-5" /> Add Task
//           </Button>
//           <AiAssistant getBoard={getBoard} addTasks={addTasksFromAI} />
//         </div>
//       </form>

//       <Tabs value={viewMode} onValueChange={setViewMode} className="mb-8">
//         <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-muted p-1 h-12 rounded-lg shadow-sm">
//           <TabsTrigger
//             value="kanban"
//             className="h-10 rounded-md focus-visible:ring-2 focus-visible:ring-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
//             aria-label="Kanban view"
//           >
//             <LayoutDashboard className="mr-2 h-4 w-4" /> Kanban
//           </TabsTrigger>
//           <TabsTrigger
//             value="list"
//             className="h-10 rounded-md focus-visible:ring-2 focus-visible:ring-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
//             aria-label="List view"
//           >
//             <List className="mr-2 h-4 w-4" /> Table
//           </TabsTrigger>
//         </TabsList>
//         <TabsContent value="kanban" className="mt-8">
//           {renderKanbanView()}
//         </TabsContent>
//         <TabsContent value="list" className="mt-8">
//           {renderListView()}
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// export default KanbanTodo

// app/kanban/page.tsx