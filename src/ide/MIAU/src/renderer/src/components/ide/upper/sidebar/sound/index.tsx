import React, { useContext, useState, useEffect, useRef } from 'react';
import { BlockContext } from '@renderer/context/sound';
import { FaCircle, FaCloud, FaMusic, FaSquare, FaStar } from "react-icons/fa";
import { DndContext, useDraggable, DragOverlay, useDroppable } from '@dnd-kit/core';
import { BsTriangleFill, BsSuitDiamondFill } from 'react-icons/bs';
import { GoHeartFill } from 'react-icons/go';
import { IoMoon } from 'react-icons/io5';
import { TbHexagonFilled } from 'react-icons/tb';

function DraggableAudio({ audio, index, activeId }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-audio-${index}`,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : '',
    opacity: activeId === `draggable-audio-${index}` ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center justify-center h-[6rem] w-[6rem] m-4 rounded-lg border-fundo border-2 bg-white"
    >
      <FaMusic className="text-linha text-4xl" />
      <span className="text-xs text-linha mt-2">{audio?.name.replace('audio_', '')}</span>
    </div>
  );
}

function DroppableBlock({ block, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-block-${block.id}`,
  });

  const style = {
    backgroundColor: isOver ? 'lightblue' : '',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-center h-[6rem] w-[6rem] rounded-lg border-2 ${block.borderColor} ${block.bgColor}`}
    >
      {children}
    </div>
  );
}

const blocks = [
  { id: 'sound-0', Icon: FaCloud, borderColor: "border-yellow-200", bgColor: "bg-yellow-200" },
  { id: 'sound-1', Icon: FaCircle, borderColor: "border-fundo", bgColor: "bg-fundo" },
  { id: 'sound-2', Icon: BsTriangleFill, borderColor: "border-green-200", bgColor: "bg-green-200" },
  { id: 'sound-3', Icon: GoHeartFill, borderColor: "border-green-200", bgColor: "bg-green-200" },
  { id: 'sound-4', Icon: IoMoon, borderColor: "border-yellow-200", bgColor: "bg-yellow-200" },
  { id: 'sound-5', Icon: FaSquare, borderColor: "border-fundo", bgColor: "bg-fundo" },
  { id: 'sound-6', Icon: BsSuitDiamondFill, borderColor: "border-fundo", bgColor: "bg-fundo", rotate: "rotate-90" },
  { id: 'sound-7', Icon: TbHexagonFilled, borderColor: "border-green-200", bgColor: "bg-green-200", rotate: "rotate-90" },
  { id: 'sound-8', Icon: FaStar, borderColor: "border-yellow-200", bgColor: "bg-yellow-200" }
];

export default function Sound() {
  const { blockAudios, setBlockAudios } = useContext(BlockContext);
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const tabBlocksRef = useRef(blocks);

  const [tabBlocks, setTabBlocks] = useState(tabBlocksRef.current);

  const fetchAudios = async () => {
    const audios = await (window as any).api.listAudios();
    setAudios(audios);
    setLoading(false);
  };

  useEffect(() => {
    fetchAudios();
    const intervalId = setInterval(fetchAudios, 500);
    return () => clearInterval(intervalId);
  }, []);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { over } = event;
    if (over && activeId) {
      handleDrop(over.id);
    }
    setActiveId(null);
  };

  const handleDrop = (id) => {
    if (activeId && activeId.startsWith('draggable-audio-')) {
      const index = parseInt(activeId.replace('draggable-audio-', ''), 10);
      const newBlockIndex = tabBlocks.findIndex((block) => block.id === id.replace('droppable-block-', ''));
      const newItems = [...tabBlocks];

      const newBlock = {
        ...newItems[newBlockIndex],
        Icon: () => (
          <div className="flex flex-col items-center">
            <FaMusic className="text-linha text-4xl" />
            <span className="text-sm text-linha mt-2">{audios[index]?.name.replace('audio_', '')}</span>
          </div>
        ),
      };
      newItems.splice(newBlockIndex, 1, newBlock);
      setTabBlocks(newItems);
      tabBlocksRef.current = newItems; 

      // Atualiza a variável do bloco
      const updatedBlockAudios = {
        ...blockAudios,
        [newBlock.id]: { name: audios[index].name, type: audios[index].path.split('.').pop() },
      };
      setBlockAudios(updatedBlockAudios);
      console.log(`Updated block ${newBlock.id}: ${updatedBlockAudios[newBlock.id].name}.${updatedBlockAudios[newBlock.id].type}`);
    }
  };

  useEffect(() => {
    Object.keys(blockAudios).forEach((blockId) => {
      if (blockAudios[blockId].name) {
        console.log(`Block ${blockId} updated: ${blockAudios[blockId].name}.${blockAudios[blockId].type}`);
      }
    });
  }, [blockAudios]);

  const getActiveAudio = () => {
    if (!activeId || !activeId.startsWith('draggable-audio-')) return null;
    const index = parseInt(activeId.replace('draggable-audio-', ''), 10);
    return audios[index];
  };

  const renderItems = (items) => {
    return (
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex w-full gap-x-[3%]">
        <div className="h-full w-[30%] flex flex-col px-6 py-2">
            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <div className="flex" key={rowIndex}>
                {items.slice(rowIndex * 3, rowIndex * 3 + 3).map((item, index) => (
                  <DraggableAudio key={index} audio={item} index={rowIndex * 3 + index} activeId={activeId} />
                ))}
              </div>
            ))}
          </div>
          <div>
          <div className="flex w-[70%] h-full ml-[34.5%] items-center justify-center ">
          <div className="relative flex w-[58rem] h-[24.6rem] flex-col items-center justify-center rounded-3xl border-linha border-2 bg-white">
                <div className="flex gap-x-5">
                  <div className="h-full w-full grid grid-cols-3 gap-x-[4.5rem] gap-y-[1.5rem] px-6 py-2">
                    {tabBlocks.map((block) => (
                      <DroppableBlock key={block.id} block={block}>
                        <block.Icon className={`text-white text-4xl ${block.rotate || ''}`} />
                      </DroppableBlock>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DragOverlay>
          {activeId && (
            <div className="flex flex-col items-center justify-center h-[6rem] w-[6rem] m-4 rounded-lg border-fundo border-2 bg-white">
              <FaMusic className="text-linha text-4xl" />
              <span className="text-xs text-linha mt-2">{getActiveAudio()?.name.replace('audio_', '')}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    );
  };

  return (
    <div className="h-full w-full">
      {loading ? null : (audios.length === 0 ? renderItems([...Array(9).fill(null)]) : renderItems(audios))}
    </div>
  );
}
