import { Ellipsis, Plus } from "lucide-react";
import React, { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import TaskCard from "./task-card";
import { useModal } from "@/hooks/useModal";
import { Button } from "@/components/ui/button";

type QuoteCard = {
  id: string;
  quote: string;
};

type Column = {
  id: string;
  name: string;
  items: QuoteCard[];
};

const initialData: { columns: Column[] } = {
  columns: [
    {
      id: "jake",
      name: "Qilish kerak",
      items: [
        {
          id: "2",
          quote:
            "Sucking at something is the first step towards being sorta good at something.",
        },
        { id: "3", quote: "You got to focus on what's real, man" },
      ],
    },
    {
      id: "bmo",
      name: "Qilish",
      items: [
        { id: "1", quote: "Sometimes life is scary and dark" },
        { id: "5", quote: "Homies help homies. Always" },
        {
          id: "9",
          quote:
            "Don’t you always call sweatpants 'give up on life pants,' Jake?",
        },
        {
          id: "4",
          quote: "Is that where creativity comes from? From sad biz?",
        },
        {
          id: "8",
          quote:
            "People make mistakes. It's all a part of growing up and you never really stop growing",
        },
      ],
    },
    {
      id: "finn",
      name: "Test Jarayoni",
      items: [
        {
          id: "7",
          quote:
            "That’s it! The answer was so simple, I was too smart to see it!",
        },
      ],
    },
    {
      id: "bubblegum",
      name: "Tugatildi",
      items: [
        { id: "10", quote: "I should not have drunk that much tea!" },
        { id: "11", quote: "Please! I need the real you!" },
        {
          id: "12",
          quote: "Haven't slept for a solid 83 hours, but, yeah, I'm good.",
        },
        { id: "6", quote: "Responsibility demands sacrifice" },
      ],
    },
  ],
};

const TaskDnd: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(initialData.columns);
  const { openModal } = useModal("task-modal");

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    // COLUMN DRAG
    if (type === "column") {
      const newColumns = [...columns];
      const [moved] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, moved);
      setColumns(newColumns);
      return;
    }

    // CARD DRAG
    const sourceColIndex = columns.findIndex(
      (col) => col.id === source.droppableId,
    );
    const destColIndex = columns.findIndex(
      (col) => col.id === destination.droppableId,
    );

    const sourceItems = [...columns[sourceColIndex].items];
    const destItems = [...columns[destColIndex].items];
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItem);
      const newColumns = [...columns];
      newColumns[sourceColIndex].items = sourceItems;
      setColumns(newColumns);
    } else {
      destItems.splice(destination.index, 0, movedItem);
      const newColumns = [...columns];
      newColumns[sourceColIndex].items = sourceItems;
      newColumns[destColIndex].items = destItems;
      setColumns(newColumns);
    }
  };

  return (
    <div className="py-3">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex gap-2 items-start "
            >
              {columns.map((column, colIndex) => (
                <Draggable
                  key={column.id}
                  draggableId={column.id}
                  index={colIndex}
                >
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className="bg-background px-1  rounded-md"
                    >
                      <Droppable droppableId={column.id} type="card">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              minHeight: 50,
                            }}
                            className="bg-zinc-800 p-2 rounded-lg  min-w-72"
                          >
                            <div className="flex items-center gap-2 rounded-xl p-2  justify-between">
                              <h1>{column.name}</h1>
                              <span className="rounded-lg p-2 hover:bg-zinc-700 cursor-pointer">
                                <Ellipsis size={16} />
                              </span>
                            </div>
                            <div className="no-scrollbar-x overflow-y-auto h-full max-h-[70vh]">
                              {column.items.map((item, index) => (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        marginBottom: 8,
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <TaskCard/>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                            <Button onClick={openModal}  className="w-full">
                              <Plus size={16} />
                              Yangi qo'shish
                            </Button>
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskDnd;
