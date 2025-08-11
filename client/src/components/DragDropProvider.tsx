import React, { createContext, useContext, useState, ReactNode } from 'react';
import { type VideoResult } from '@/lib/types';

interface DragItem {
  type: 'video';
  video: VideoResult;
  sourceType: 'search' | 'queue';
}

interface DragDropContextType {
  dragItem: DragItem | null;
  isDragging: boolean;
  dragStart: (item: DragItem) => void;
  dragEnd: () => void;
  setDropTarget: (target: string | null) => void;
  dropTarget: string | null;
}

const DragDropContext = createContext<DragDropContextType | null>(null);

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
}

interface DragDropProviderProps {
  children: ReactNode;
}

export function DragDropProvider({ children }: DragDropProviderProps) {
  const [dragItem, setDragItem] = useState<DragItem | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const isDragging = dragItem !== null;

  const dragStart = (item: DragItem) => {
    setDragItem(item);
  };

  const dragEnd = () => {
    setDragItem(null);
    setDropTarget(null);
  };

  return (
    <DragDropContext.Provider
      value={{
        dragItem,
        isDragging,
        dragStart,
        dragEnd,
        setDropTarget,
        dropTarget,
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
}