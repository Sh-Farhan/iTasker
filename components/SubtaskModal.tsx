"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Task, Subtask } from "@/app/types/task";
import { X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubtaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (task: Task) => void;
}

export const SubtaskModal: React.FC<SubtaskModalProps> = ({ task, isOpen, onClose, onUpdateTask }) => {
  const [newSubtaskContent, setNewSubtaskContent] = useState("");
  const [currentSubtasks, setCurrentSubtasks] = useState<Subtask[]>([]);

  useEffect(() => {
    if (task) {
      setCurrentSubtasks(task.subtasks || []);
    }
  }, [task]);

  if (!task) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskContent.trim()) return;

    const newSubtask: Subtask = {
      id: `new-${new Date().toISOString()}`, // Temporary unique ID
      content: newSubtaskContent,
      completed: false,
    };

    const updatedSubtasks = [...currentSubtasks, newSubtask];
    setCurrentSubtasks(updatedSubtasks); // Update local state immediately
    onUpdateTask({ ...task, subtasks: updatedSubtasks }); // Pass updated task to parent
    setNewSubtaskContent("");
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = currentSubtasks.map(sub =>
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    );
    setCurrentSubtasks(updatedSubtasks);
    onUpdateTask({ ...task, subtasks: updatedSubtasks });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = currentSubtasks.filter(sub => sub.id !== subtaskId);
    setCurrentSubtasks(updatedSubtasks);
    onUpdateTask({ ...task, subtasks: updatedSubtasks });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task.content}</DialogTitle>
          <DialogDescription>
            Manage the subtasks for this item.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              value={newSubtaskContent}
              onChange={(e) => setNewSubtaskContent(e.target.value)}
              placeholder="Add a new subtask..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddSubtask();
                }
              }}
            />
            <Button onClick={handleAddSubtask} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {currentSubtasks.length > 0 ? (
              currentSubtasks.map(subtask => (
                <div key={subtask.id} className="flex items-center justify-between group bg-secondary p-2 rounded-md">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => handleToggleSubtask(subtask.id)}
                      className="form-checkbox h-4 w-4 text-primary rounded"
                    />
                    <span className={cn("text-sm", subtask.completed && "line-through text-muted-foreground")}>
                      {subtask.content}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100"
                    onClick={() => handleDeleteSubtask(subtask.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No subtasks yet.</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};