// components/StrictModeDroppable.tsx
"use client"; // This directive marks the component as a Client Component

import React, { useEffect, useState } from 'react';
import { Droppable, DroppableProps } from '@hello-pangea/dnd';

// Fixes hydration errors for Droppable in Next.js Strict Mode
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};