"use client"

import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Plus, LayoutDashboard, List } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const InnermostWithForceUpdate = ({ children, ...props }) => {
  const [, setRender] = useState(0);
  useEffect(() => {
    setRender(render => render + 1);
  }, []);
  return children(props);
};

const KanbanTodo = () => {
  const [columns, setColumns] = useState([
    { id: 'todo', title: 'To Do', tasks: [], color: 'bg-blue-500' },
    { id: 'inprogress', title: 'In Progress', tasks: [], color: 'bg-yellow-500' },
    { id: 'done', title: 'Done', tasks: [], color: 'bg-green-500' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [viewMode, setViewMode] = useState('kanban');

  useEffect(() => {
    const timeout = setTimeout(() => setEnabled(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (sourceColumn && destColumn) {
      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTasks = Array.from(destColumn.tasks);
      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);
      setColumns(columns.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: destTasks };
        }
        return col;
      }));
    }
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const task = {
      id: Date.now().toString(),
      content: newTask.trim()
    };
    setColumns(columns.map(col => {
      if (col.id === 'todo') {
        return { ...col, tasks: [...col.tasks, task] };
      }
      return col;
    }));
    setNewTask('');
  };

  if (!enabled) {
    return null;
  }

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
                          <InnermostWithForceUpdate>
                            {() => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-background p-3 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow duration-200"
                              >
                                {task.content}
                              </li>
                            )}
                          </InnermostWithForceUpdate>
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
          {columns.flatMap(col =>
            col.tasks.map(task => (
              <li
                key={task.id}
                className="flex justify-between items-center bg-secondary p-3 rounded-lg shadow-sm border border-border"
              >
                <span>{task.content}</span>
                <Badge variant="outline" className={`${col.color} bg-opacity-20 text-xs`}>
                  {col.title}
                </Badge>
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