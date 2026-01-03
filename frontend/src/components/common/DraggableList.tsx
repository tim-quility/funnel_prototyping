
import React, { useState, useRef } from 'react';

interface DraggableListProps<T> {
    items: T[];
    onReorder: (newItems: T[]) => void;
    renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode;
}

const DraggableList = <T extends {}>(
    { items, onReorder, renderItem }: DraggableListProps<T>
) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const dragItem = useRef<number | null>(null); // Index of the item being dragged
    const dragOverItem = useRef<number | null>(null); // Index of the item currently being hovered over

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        dragItem.current = index;
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault(); // Necessary to allow drop
        dragOverItem.current = index;
        // Only reorder if we are hovering over a different item
        if (dragItem.current !== dragOverItem.current) {
            const newItems = [...items];
            const [reorderedItem] = newItems.splice(dragItem.current!, 1);
            newItems.splice(dragOverItem.current!, 0, reorderedItem);

            dragItem.current = dragOverItem.current; // Update dragged item position
            onReorder(newItems); // Trigger re-render with new order
        }
    };

    const handleDragEnd = () => {
        dragItem.current = null;
        dragOverItem.current = null;
        setDraggedIndex(null);
    };

    return (
        <div>
            {items.map((item, index) => (
                <div
                    key={String(item)} // FIX: Use a stable unique identifier as the key. Since T is a string (keyof Lead or LeadLayoutBlockType), item itself is unique.
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()} // Important for drop to work
                    className="cursor-grab"
                >
                    {renderItem(item, index, draggedIndex === index)}
                </div>
            ))}
        </div>
    );
};

export default DraggableList;
