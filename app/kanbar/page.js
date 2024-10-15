// "use client"
// 'use client'

// import React, { useState } from 'react'
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
// import { Plus } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// export default function KanbanTodo() {
//   const [columns, setColumns] = useState({
//     'todo': {
//       id: 'todo',
//       title: 'To Do',
//       tasks: []
//     },
//     'inprogress': {
//       id: 'inprogress',
//       title: 'In Progress',
//       tasks: []
//     },
//     'done': {
//       id: 'done',
//       title: 'Done',
//       tasks: []
//     }
//   })
//   const [newTask, setNewTask] = useState('')

//   const onDragEnd = (result) => {
//     const { source, destination } = result
//     if (!destination) return

//     const sourceColumn = columns[source.droppableId]
//     const destColumn = columns[destination.droppableId]
//     const sourceTasks = [...sourceColumn.tasks]
//     const destTasks = [...destColumn.tasks]

//     const [removed] = sourceTasks.splice(source.index, 1)
//     destTasks.splice(destination.index, 0, removed)

//     setColumns({
//       ...columns,
//       [source.droppableId]: {
//         ...sourceColumn,
//         tasks: sourceTasks
//       },
//       [destination.droppableId]: {
//         ...destColumn,
//         tasks: destTasks
//       }
//     })
//   }

//   const addTask = (e) => {
//     e.preventDefault()
//     if (!newTask.trim()) return

//     const task = {
//       id: Date.now().toString(),
//       content: newTask.trim()
//     }

//     setColumns(prevColumns => ({
//       ...prevColumns,
//       'todo': {
//         ...prevColumns.todo,
//         tasks: [...prevColumns.todo.tasks, task]
//       }
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
//           {Object.values(columns).map(column => (
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

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function KanbanTodo() {
  const [columns, setColumns] = useState({
    todo: { id: 'todo', title: 'To Do', tasks: [] },
    inprogress: { id: 'inprogress', title: 'In Progress', tasks: [] },
    done: { id: 'done', title: 'Done', tasks: [] }
  })
  const [newTask, setNewTask] = useState('')

  const onDragEnd = (result) => {
    const { source, destination } = result
    if (!destination) return

    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]

    const sourceTasks = Array.from(sourceColumn.tasks)
    const destTasks = Array.from(destColumn.tasks)

    const [removed] = sourceTasks.splice(source.index, 1)
    destTasks.splice(destination.index, 0, removed)

    setColumns((prev) => ({
      ...prev,
      [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
      [destination.droppableId]: { ...destColumn, tasks: destTasks }
    }))
  }

  const addTask = (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    const task = { id: Date.now().toString(), content: newTask.trim() }

    setColumns((prev) => ({
      ...prev,
      todo: { ...prev.todo, tasks: [...prev.todo.tasks, task] }
    }))

    setNewTask('')
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
          {Object.values(columns).map((column) => (
            <Card key={column.id}>
              <CardHeader>
                <CardTitle>{column.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[200px] bg-gray-100 p-2 rounded"
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-secondary p-2 mb-2 rounded shadow cursor-move"
                            >
                              {task.content}
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
