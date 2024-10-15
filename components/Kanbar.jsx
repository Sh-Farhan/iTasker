// import React, { useState } from 'react'
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
// import { Plus } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// export default function KanbanTodo() {
//   const [columns, setColumns] = useState([
//     { id: 'todo', title: 'To Do', tasks: [] },
//     { id: 'inprogress', title: 'In Progress', tasks: [] },
//     { id: 'done', title: 'Done', tasks: [] },
//   ])
//   const [newTask, setNewTask] = useState('')

//   const onDragEnd = (result) => {
//     if (!result.destination) return

//     const { source, destination } = result
//     const sourceColumn = columns.find(col => col.id === source.droppableId)
//     const destColumn = columns.find(col => col.id === destination.droppableId)
    
//     if (sourceColumn && destColumn) {
//       const sourceTasks = Array.from(sourceColumn.tasks)
//       const destTasks = Array.from(destColumn.tasks)
//       const [removed] = sourceTasks.splice(source.index, 1)
//       destTasks.splice(destination.index, 0, removed)

//       setColumns(columns.map(col => {
//         if (col.id === source.droppableId) {
//           return { ...col, tasks: sourceTasks }
//         }
//         if (col.id === destination.droppableId) {
//           return { ...col, tasks: destTasks }
//         }
//         return col
//       }))
//     }
//   }

//   const addTask = (e) => {
//     e.preventDefault()
//     if (!newTask.trim()) return

//     const task = {
//       id: Date.now().toString(),
//       content: newTask.trim()
//     }

//     setColumns(columns.map(col => {
//       if (col.id === 'todo') {
//         return { ...col, tasks: [...col.tasks, task] }
//       }
//       return col
//     }))

//     setNewTask('')
//   }

//   return (
//     <div className="p-4 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Kanban Todo</h1>
      
//       <form onSubmit={addTask} className="mb-4 flex gap-2">
//         <Input
//           type="text"
//           value={newTask}
//           onChange={(e) => setNewTask(e.target.value)}
//           placeholder="Add a new task"
//           className="flex-grow"
//         />
//         <Button type="submit">
//           <Plus className="mr-2 h-4 w-4" /> Add Task
//         </Button>
//       </form>

//       <DragDropContext onDragEnd={onDragEnd}>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {columns.map(column => (
//             <Card key={column.id}>
//               <CardHeader>
//                 <CardTitle>{column.title}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Droppable droppableId={column.id}>
//                   {(provided) => (
//                     <ul
//                       {...provided.droppableProps}
//                       ref={provided.innerRef}
//                       className="min-h-[200px]"
//                     >
//                       {column.tasks.map((task, index) => (
//                         <Draggable key={task.id} draggableId={task.id} index={index}>
//                           {(provided) => (
//                             <li
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               className="bg-secondary p-2 mb-2 rounded shadow"
//                             >
//                               {task.content}
//                             </li>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </ul>
//                   )}
//                 </Droppable>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </DragDropContext>
//     </div>
//   )
// }
"use client"
import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

function InnermostWithForceUpdate({ children, ...props }) {
  const [, setRender] = useState(0);
  useEffect(() => {
    setRender(render => render + 1);
  }, []);
  return children(props);
}

export default function KanbanTodo() {
  const [columns, setColumns] = useState([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'inprogress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] },
  ])
  const [newTask, setNewTask] = useState('')
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setEnabled(true), 500)
    return () => clearTimeout(timeout)
  }, [])

  const onDragEnd = (result) => {
    if (!result.destination) return
    const { source, destination } = result
    const sourceColumn = columns.find(col => col.id === source.droppableId)
    const destColumn = columns.find(col => col.id === destination.droppableId)
   
    if (sourceColumn && destColumn) {
      const sourceTasks = Array.from(sourceColumn.tasks)
      const destTasks = Array.from(destColumn.tasks)
      const [removed] = sourceTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, removed)
      setColumns(columns.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceTasks }
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: destTasks }
        }
        return col
      }))
    }
  }

  const addTask = (e) => {
    e.preventDefault()
    if (!newTask.trim()) return
    const task = {
      id: Date.now().toString(),
      content: newTask.trim()
    }
    setColumns(columns.map(col => {
      if (col.id === 'todo') {
        return { ...col, tasks: [...col.tasks, task] }
      }
      return col
    }))
    setNewTask('')
  }

  if (!enabled) {
    return null
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kanban Todo</h1>
     
      <form onSubmit={addTask} className="mb-4 flex gap-2">
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
      </form>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(column => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <Card>
                  <CardHeader>
                    <CardTitle>{column.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[200px]"
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
                                  className="bg-secondary p-2 mb-2 rounded shadow"
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
    </div>
  )
}