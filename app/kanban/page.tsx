// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from "@hello-pangea/dnd";
// import {
//   Plus,
//   LayoutDashboard,
//   List,
//   Edit,
//   Trash2,
//   Check,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
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
// } from "@/components/ui/alert-dialog";
// import { useToast } from "@/hooks/use-toast";

// const KanbanTodo = () => {
//   const [columns, setColumns] = useState([
//     { id: "todo", title: "To Do", tasks: [], color: "bg-blue-500" },
//     {
//       id: "inprogress",
//       title: "In Progress",
//       tasks: [],
//       color: "bg-yellow-500",
//     },
//     { id: "done", title: "Done", tasks: [], color: "bg-green-500" },
//   ]);
//   const [newTask, setNewTask] = useState("");
//   const [viewMode, setViewMode] = useState("kanban");
//   const [isLoading, setIsLoading] = useState(true);
//   const { toast } = useToast();
//   const [editingTask, setEditingTask] = useState<string | null>(null);
//   const [editingContent, setEditingContent] = useState("");

//   const startEditingTask = (taskId: string, currentContent: string) => {
//     setEditingTask(taskId);
//     setEditingContent(currentContent);
//   };

//   const saveEditedTask = async (columnId: string, taskId: string) => {
//     await editTask(columnId, taskId, editingContent);
//     setEditingTask(null);
//   };

//   useEffect(() => {
//     fetchTodos();
//   }, []);

//   // check

//   const fetchTodos = async () => {
//     try {
//       const response = await fetch("/api/users");
//       if (!response.ok) throw new Error("Failed to fetch tasks");

//       const tasks = await response.json();
//       setColumns((prev) =>
//         prev.map((col) => ({
//           ...col,
//           tasks: tasks.filter((task: any) => task.status === col.id),
//         }))
//       );
//       setIsLoading(false);
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch tasks.",
//         variant: "destructive",
//       });
//       setIsLoading(false);
//     }
//   };

//   const onDragEnd = useCallback(
//     async (result: DropResult) => {
//       if (!result.destination) return;

//       const { source, destination } = result;
//       const sourceCol = columns.find((col) => col.id === source.droppableId);
//       const destCol = columns.find((col) => col.id === destination.droppableId);

//       if (!sourceCol || !destCol) return;

//       const sourceTasks = [...sourceCol.tasks];
//       const destTasks = [...destCol.tasks];
//       const [moved] = sourceTasks.splice(source.index, 1);
//       const updated = { ...moved, status: destCol.id };
//       destTasks.splice(destination.index, 0, updated);

//       setColumns((prev) =>
//         prev.map((col) => {
//           if (col.id === sourceCol.id) return { ...col, tasks: sourceTasks };
//           if (col.id === destCol.id) return { ...col, tasks: destTasks };
//           return col;
//         })
//       );

//       try {
//         const res = await fetch(`/api/users`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updated),
//         });
//         if (!res.ok) throw new Error();
//         toast({ title: "Success", description: "Task moved." });
//       } catch {
//         toast({
//           title: "Error",
//           description: "Failed to move task.",
//           variant: "destructive",
//         });
//       }
//     },
//     [columns, toast]
//   );

// const addTask = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!newTask.trim()) return;

//   const task = {
//     content: newTask.trim(),
//     status: 'todo',
//   };

//   try {
//     const response = await fetch('/api/users', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(task),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to add task');
//     }

//     const addedTask = await response.json();

//     // ✅ Ensure it’s added to the correct column
//     setColumns(prevColumns =>
//       prevColumns.map(col =>
//         col.id === 'todo'
//           ? { ...col, tasks: [...col.tasks, addedTask] }
//           : col
//       )
//     );

//     setNewTask('');
//   } catch (error) {
//     console.error('Error adding task:', error);
//     toast({
//       title: "Error",
//       description: "Failed to add task. Please try again.",
//       variant: "destructive",
//     });
//   }
// };



//   const editTask = useCallback(
//     async (columnId: string, taskId: string, content: string) => {
//       const column = columns.find((col) => col.id === columnId);
//       const task = column?.tasks.find((t) => t.id === taskId);
//       if (!task) return;

//       const updated = { ...task, content };

//       try {
//         const res = await fetch(`/api/users`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updated),
//         });
//         if (!res.ok) throw new Error();

//         setColumns((prev) =>
//           prev.map((col) =>
//             col.id === columnId
//               ? {
//                   ...col,
//                   tasks: col.tasks.map((t) => (t.id === taskId ? updated : t)),
//                 }
//               : col
//           )
//         );
//         toast({ title: "Updated", description: "Task updated." });
//       } catch {
//         toast({
//           title: "Error",
//           description: "Failed to update task.",
//           variant: "destructive",
//         });
//       }
//     },
//     [columns, toast]
//   );

// const deleteTask = useCallback(async (columnId, taskId) => {
//   try {
//     const response = await fetch(`/api/users`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ id: taskId }), // ✅ send taskId
//     });

//     if (!response.ok) {
//       throw new Error('Failed to delete task');
//     }

//     setColumns(prevColumns =>
//       prevColumns.map(col => {
//         if (col.id === columnId) {
//           return {
//             ...col,
//             tasks: col.tasks.filter(task => task.id !== taskId),
//           };
//         }
//         return col;
//       })
//     );

//     toast({
//       title: "Success",
//       description: "Task deleted successfully.",
//     });
//   } catch (error) {
//     console.error('Error deleting task:', error);
//     toast({
//       title: "Error",
//       description: "Failed to delete task. Please try again.",
//       variant: "destructive",
//     });
//   }
// }, [toast]);

//   const renderKanbanView = () => (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {columns.map((column) => (
//           <div key={column.id}>
//             <Droppable droppableId={column.id}>
//               {(provided) => (
//                 <Card className="bg-secondary">
//                   <CardHeader className={`${column.color} text-white`}>
//                     <CardTitle className="flex justify-between items-center">
//                       {column.title}
//                       <Badge variant="secondary">{column.tasks.length}</Badge>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <ul
//                       ref={provided.innerRef}
//                       {...provided.droppableProps}
//                       className="min-h-[300px] space-y-2"
//                     >
//                       {column.tasks.map((task, index) => (
//                         <Draggable
//                           key={task.id}
//                           draggableId={String(task.id)}
//                           index={index}
//                         >
//                           {(provided) => (
//                             <li
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               className="bg-background p-3 rounded-lg border shadow"
//                             >
//                               {editingTask === task.id ? (
//                                 <div className="flex items-center gap-2">
//                                   <Input
//                                     value={editingContent}
//                                     onChange={(e) =>
//                                       setEditingContent(e.target.value)
//                                     }
//                                     className="flex-grow"
//                                   />
//                                   <Button
//                                     size="icon"
//                                     onClick={() =>
//                                       saveEditedTask(column.id, task.id)
//                                     }
//                                   >
//                                     <Check className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               ) : (
//                                 <div className="flex justify-between items-center">
//                                   <span>{task.content}</span>
//                                   <div className="flex gap-2">
//                                     <Button
//                                       size="icon"
//                                       variant="ghost"
//                                       onClick={() =>
//                                         startEditingTask(task.id, task.content)
//                                       }
//                                     >
//                                       <Edit className="h-4 w-4" />
//                                     </Button>
//                                     <AlertDialog>
//                                       <AlertDialogTrigger asChild>
//                                         <Button size="icon" variant="ghost">
//                                           <Trash2 className="h-4 w-4" />
//                                         </Button>
//                                       </AlertDialogTrigger>
//                                       <AlertDialogContent>
//                                         <AlertDialogHeader>
//                                           <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                                           <AlertDialogDescription>
//                                             This will delete the task.
//                                           </AlertDialogDescription>
//                                         </AlertDialogHeader>
//                                         <AlertDialogFooter>
//                                           <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                           <AlertDialogAction
//                                             onClick={() =>
//                                               deleteTask(column.id, task.id)
//                                             }
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
//                     </ul>
//                   </CardContent>
//                 </Card>
//               )}
//             </Droppable>
//           </div>
//         ))}
//       </div>
//     </DragDropContext>
//   );

//   return (
//     <div className="container mx-auto p-6 max-w-6xl">
//       <h1 className="text-4xl font-bold mb-8 text-center">Kanban Todo</h1>

//       <form onSubmit={addTask} className="mb-8">
//         <div className="flex gap-2">
//           <Input
//             type="text"
//             value={newTask}
//             onChange={(e) => setNewTask(e.target.value)}
//             placeholder="Add a new task"
//             className="flex-grow"
//           />
//           <Button type="submit">
//             <Plus className="mr-2 h-4 w-4" /> Add Task
//           </Button>
//         </div>
//       </form>

//       <Tabs value={viewMode} onValueChange={setViewMode} className="mb-8">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="kanban">
//             <LayoutDashboard className="mr-2 h-4 w-4" /> Kanban
//           </TabsTrigger>
//           <TabsTrigger value="list">
//             <List className="mr-2 h-4 w-4" /> List
//           </TabsTrigger>
//         </TabsList>
//         <TabsContent value="kanban">{renderKanbanView()}</TabsContent>
//         <TabsContent value="list">List View Coming Soon...</TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default KanbanTodo;
"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Plus, LayoutDashboard, List, Edit, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

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
  ])
  const [newTask, setNewTask] = useState("")
  const [viewMode, setViewMode] = useState("kanban")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")

  const startEditingTask = (taskId: string, currentContent: string) => {
    setEditingTask(taskId)
    setEditingContent(currentContent)
  }

  const saveEditedTask = async (columnId: string, taskId: string) => {
    await editTask(columnId, taskId, editingContent)
    setEditingTask(null)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Failed to fetch tasks")

      const tasks = await response.json()
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: tasks.filter((task: any) => task.status === col.id),
        })),
      )
      setIsLoading(false)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      if (!result.destination) return

      const { source, destination } = result
      const sourceCol = columns.find((col) => col.id === source.droppableId)
      const destCol = columns.find((col) => col.id === destination.droppableId)

      if (!sourceCol || !destCol) return

      const sourceTasks = [...sourceCol.tasks]
      const destTasks = [...destCol.tasks]
      const [moved] = sourceTasks.splice(source.index, 1)
      const updated = { ...moved, status: destCol.id }
      destTasks.splice(destination.index, 0, updated)

      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === sourceCol.id) return { ...col, tasks: sourceTasks }
          if (col.id === destCol.id) return { ...col, tasks: destTasks }
          return col
        }),
      )

      try {
        const res = await fetch(`/api/users`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        })
        if (!res.ok) throw new Error()
        toast({ title: "Success", description: "Task moved." })
      } catch {
        toast({
          title: "Error",
          description: "Failed to move task.",
          variant: "destructive",
        })
      }
    },
    [columns, toast],
  )

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    const task = {
      content: newTask.trim(),
      status: "todo",
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      })

      if (!response.ok) {
        throw new Error("Failed to add task")
      }

      const addedTask = await response.json()

      setColumns((prevColumns) =>
        prevColumns.map((col) => (col.id === "todo" ? { ...col, tasks: [...col.tasks, addedTask] } : col)),
      )

      setNewTask("")
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const editTask = useCallback(
    async (columnId: string, taskId: string, content: string) => {
      const column = columns.find((col) => col.id === columnId)
      const task = column?.tasks.find((t) => t.id === taskId)
      if (!task) return

      const updated = { ...task, content }

      try {
        const res = await fetch(`/api/users`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        })
        if (!res.ok) throw new Error()

        setColumns((prev) =>
          prev.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  tasks: col.tasks.map((t) => (t.id === taskId ? updated : t)),
                }
              : col,
          ),
        )
        toast({ title: "Updated", description: "Task updated." })
      } catch {
        toast({
          title: "Error",
          description: "Failed to update task.",
          variant: "destructive",
        })
      }
    },
    [columns, toast],
  )

  const deleteTask = useCallback(
    async (columnId, taskId) => {
      try {
        const response = await fetch(`/api/users`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: taskId }),
        })

        if (!response.ok) {
          throw new Error("Failed to delete task")
        }

        setColumns((prevColumns) =>
          prevColumns.map((col) => {
            if (col.id === columnId) {
              return {
                ...col,
                tasks: col.tasks.filter((task) => task.id !== taskId),
              }
            }
            return col
          }),
        )

        toast({
          title: "Success",
          description: "Task deleted successfully.",
        })
      } catch (error) {
        console.error("Error deleting task:", error)
        toast({
          title: "Error",
          description: "Failed to delete task. Please try again.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

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
                    <ul ref={provided.innerRef} {...provided.droppableProps} className="min-h-[300px] space-y-2">
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
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
                                    onChange={(e) => setEditingContent(e.target.value)}
                                    className="flex-grow"
                                  />
                                  <Button size="icon" onClick={() => saveEditedTask(column.id, task.id)}>
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
                                      onClick={() => startEditingTask(task.id, task.content)}
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
                                          <AlertDialogDescription>This will delete the task.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => deleteTask(column.id, task.id)}>
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
  )

  const renderListView = () => (
    <div className="space-y-6">
      {columns.map((column) => (
        <Card key={column.id} className="bg-secondary">
          <CardHeader className={`${column.color} text-white`}>
            <CardTitle className="flex justify-between items-center">
              {column.title}
              <Badge variant="secondary">{column.tasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {column.tasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No tasks in this category</p>
            ) : (
              <div className="space-y-2">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-background p-3 rounded-lg border shadow flex justify-between items-center"
                  >
                    {editingTask === task.id ? (
                      <div className="flex items-center gap-2 flex-grow">
                        <Input
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="flex-grow"
                        />
                        <Button size="icon" onClick={() => saveEditedTask(column.id, task.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${column.color}`} />
                          <span className="font-medium">{task.content}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={() => startEditingTask(task.id, task.content)}>
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
                                <AlertDialogDescription>This will delete the task permanently.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteTask(column.id, task.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )

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
        <TabsContent value="list">{renderListView()}</TabsContent>
      </Tabs>
    </div>
  )
}

export default KanbanTodo


