"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Plus, LayoutDashboard, List, Edit, Trash2, Check } from 'lucide-react'
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
    { id: 'todo', title: 'To Do', tasks: [], color: 'bg-blue-500' },
    { id: 'inprogress', title: 'In Progress', tasks: [], color: 'bg-yellow-500' },
    { id: 'done', title: 'Done', tasks: [], color: 'bg-green-500' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [viewMode, setViewMode] = useState('kanban');
  // const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  //
  const [editingTask, setEditingTask] = useState(null);
const [editingContent, setEditingContent] = useState(''); // Local state for editing content

const startEditingTask = (taskId, currentContent) => {
  setEditingTask(taskId);
  setEditingContent(currentContent); // Initialize local state with current content
};

const saveEditedTask = async (columnId, taskId) => {
  await editTask(columnId, taskId, editingContent); // Save changes via editTask function
  setEditingTask(null); // Exit editing mode
};

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasks = await response.json();
      setColumns(prevColumns => prevColumns.map(column => ({
        ...column,
        tasks: tasks.filter(task => task.status === column.id)
      })));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const onDragEnd = useCallback(async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (sourceColumn && destColumn) {
      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTasks = Array.from(destColumn.tasks);
      const [removed] = sourceTasks.splice(source.index, 1);
      const updatedTask = { ...removed, status: destColumn.id };
      destTasks.splice(destination.index, 0, updatedTask);

      setColumns(prevColumns => prevColumns.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: destTasks };
        }
        return col;
      }));

      try {
        const response = await fetch(`/api/users`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        });
        if (!response.ok) {
          throw new Error('Failed to update task');
        }
        toast({
          title: "Success",
          description: "Task moved successfully.",
        });
      } catch (error) {
        console.error('Error updating task:', error);
        toast({
          title: "Error",
          description: "Failed to move task. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [columns, toast]);

  // const addTask = async (e) => {
  //   e.preventDefault();
  //   if (!newTask.trim()) return;
  //   const task = {
  //     content: newTask.trim(),
  //     status: 'todo'
  //   };
  //   try {
  //     const response = await fetch('/api/users', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(task),
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to add task');
  //     }
  //     const addedTask = await response.json();
  //     setColumns(prevColumns => prevColumns.map(col => {
  //       if (col.id === 'todo') {
  //         return { ...col, tasks: [...col.tasks, addedTask] };
  //       }
  //       return col;
  //     }));
  //     setNewTask('');
  //     toast({
  //       title: "Success",
  //       description: "New task added successfully.",
  //     });
  //   } catch (error) {
  //     console.error('Error adding task:', error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to add task. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const addTask = async (e) => {
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
      setColumns(prevColumns =>
        prevColumns.map(col =>
          col.id === 'todo'
            ? { ...col, tasks: [...col.tasks, addedTask] } // Add the new task to the 'todo' column
            : col
        )
      );
      setNewTask(''); // Clear the input field
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    }
  };
  

  const editTask = useCallback(async (columnId, taskId, newContent) => {
    const column = columns.find(col => col.id === columnId);
    const task = column.tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask = { ...task, content: newContent };
    try {
      const response = await fetch(`/api/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      setColumns(prevColumns => prevColumns.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: col.tasks.map(t => t.id === taskId ? updatedTask : t)
          };
        }
        return col;
      }));
      setEditingTask(null);
      toast({
        title: "Success",
        description: "Task updated successfully.",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  }, [columns, toast]);

  const deleteTask = useCallback(async (columnId, taskId) => {
    try {
      const response = await fetch(`/api/users`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setColumns(prevColumns => prevColumns.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: col.tasks.filter(task => task.id !== taskId)
          };
        }
        return col;
      }));
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // const renderKanbanView = () => (
  //   <DragDropContext onDragEnd={onDragEnd}>
  //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //       {columns.map(column => (
  //         <Droppable key={column.id} droppableId={column.id}>
  //           {(provided) => (
  //             <Card className="bg-secondary">
  //               <CardHeader className={`${column.color} text-white rounded-t-lg`}>
  //                 <CardTitle className="flex justify-between items-center">
  //                   {column.title}
  //                   <Badge variant="secondary" className="text-xs">
  //                     {column.tasks.length}
  //                   </Badge>
  //                 </CardTitle>
  //               </CardHeader>
  //               <CardContent>
  //                 <ul
  //                   {...provided.droppableProps}
  //                   ref={provided.innerRef}
  //                   className="min-h-[300px] space-y-2"
  //                 >
  //                   {column.tasks.map((task, index) => (
  //                     <Draggable key={task.id} draggableId={task.id} index={index}>
  //                       {(provided) => (
  //                         <li
  //                           ref={provided.innerRef}
  //                           {...provided.draggableProps}
  //                           {...provided.dragHandleProps}
  //                           className="bg-background p-3 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow duration-200"
  //                         >
  //                           {editingTask === task.id ? (
  //                             <div className="flex items-center gap-2">
  //                               <Input
  //                                 value={task.content}
  //                                 onChange={(e) => editTask(column.id, task.id, e.target.value)}
  //                                 className="flex-grow"
  //                               />
  //                               <Button size="icon" onClick={() => setEditingTask(null)}>
  //                                 <Check className="h-4 w-4" />
  //                               </Button>
  //                             </div>
  //                           ) : (
  //                             <div className="flex items-center justify-between">
  //                               <span>{task.content}</span>
  //                               <div className="flex gap-2">
  //                                 <Button size="icon" variant="ghost" onClick={() => setEditingTask(task.id)}>
  //                                   <Edit className="h-4 w-4" />
  //                                 </Button>
  //                                 <AlertDialog>
  //                                   <AlertDialogTrigger asChild>
  //                                     <Button size="icon" variant="ghost">
  //                                       <Trash2 className="h-4 w-4" />
  //                                     </Button>
  //                                   </AlertDialogTrigger>
  //                                   <AlertDialogContent>
  //                                     <AlertDialogHeader>
  //                                       <AlertDialogTitle>Are you sure?</AlertDialogTitle>
  //                                       <AlertDialogDescription>
  //                                         This action cannot be undone. This will permanently delete the task.
  //                                       </AlertDialogDescription>
  //                                     </AlertDialogHeader>
  //                                     <AlertDialogFooter>
  //                                       <AlertDialogCancel>Cancel</AlertDialogCancel>
  //                                       <AlertDialogAction onClick={() => deleteTask(column.id, task.id)}>
  //                                         Delete
  //                                       </AlertDialogAction>
  //                                     </AlertDialogFooter>
  //                                   </AlertDialogContent>
  //                                 </AlertDialog>
  //                               </div>
  //                             </div>
  //                           )}
  //                         </li>
  //                       )}
  //                     </Draggable>
  //                   ))}
  //                   {provided.placeholder}
  //                 </ul>
  //               </CardContent>
  //             </Card>
  //           )}
  //         </Droppable>
  //       ))}
  //     </div>
  //   </DragDropContext>
  // );
  const renderKanbanView = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <Card className="bg-secondary">
                <CardHeader className={`${column.color} text-white rounded-t-lg`}>
                  <CardTitle className="flex justify-between items-center">
                    {column.title}
                    <Badge variant="secondary" className="text-xs">
                      {column.tasks.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[300px] space-y-2"
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-background p-3 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow duration-200"
                          >
                            {editingTask === task.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editingContent} // Use local state for input value
                                  onChange={(e) => setEditingContent(e.target.value)} // Update local state
                                  className="flex-grow"
                                />
                                <Button size="icon" onClick={() => saveEditedTask(column.id, task.id)}>
                                  <Check className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <span>{task.content}</span>
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
                                        <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete the task.
                                        </AlertDialogDescription>
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
        ))}
      </div>
    </DragDropContext>
  );
  const renderListView = () => (
    <Card>
      <CardContent>
        <ul className="space-y-2">
          {columns.flatMap((col) =>
            col.tasks.map((task) => (
              <li
                key={`${col.id}-${task.id}`}
                className="flex justify-between items-center bg-secondary p-3 rounded-lg shadow-sm border border-border"
              >
                {editingTask === task.id ? (
                  <div className="flex items-center gap-2 flex-grow">
                    <Input
                      value={task.content}
                      onChange={(e) => editTask(col.id, task.id, e.target.value)}
                      className="flex-grow"
                    />
                    <Button size="icon" onClick={() => setEditingTask(null)}>
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span>{task.content}</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${col.color} bg-opacity-20 text-xs`}
                      >
                        {col.title}
                      </Badge>
                      <Button size="icon" variant="ghost" onClick={() => setEditingTask(task.id)}>
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
                              This action cannot be undone. This will permanently delete the task.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteTask(col.id, task.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
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
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Kanban View
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">
          {renderKanbanView()}
        </TabsContent>
        <TabsContent value="list">
          {renderListView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KanbanTodo;


