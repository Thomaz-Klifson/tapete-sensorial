import React, { useEffect, useState, useRef, useContext } from 'react'
import { IoPawSharp } from 'react-icons/io5'
import { FaCloud, FaCircle, FaStar } from 'react-icons/fa'
import { TbHexagonFilled } from 'react-icons/tb'
import { GoHeartFill } from 'react-icons/go'
import { IoMoon } from 'react-icons/io5'
import { FaSquare } from 'react-icons/fa6'
import { BsSuitDiamondFill, BsTriangleFill } from 'react-icons/bs'
import { Label } from 'flowbite-react'
import { DndContext, useDraggable, DragOverlay, useDroppable } from '@dnd-kit/core'
import { BlockContext } from '@renderer/context/sound'

const blocks = [
  { id: 'animal-0', Icon: FaCloud, borderColor: 'border-yellow-200', bgColor: 'bg-yellow-200' },
  { id: 'animal-1', Icon: FaCircle, borderColor: 'border-fundo', bgColor: 'bg-fundo' },
  {
    id: 'animal-2',
    Icon: BsTriangleFill,
    borderColor: 'border-green-200',
    bgColor: 'bg-green-200'
  },
  { id: 'animal-3', Icon: GoHeartFill, borderColor: 'border-green-200', bgColor: 'bg-green-200' },
  { id: 'animal-4', Icon: IoMoon, borderColor: 'border-yellow-200', bgColor: 'bg-yellow-200' },
  { id: 'animal-5', Icon: FaSquare, borderColor: 'border-fundo', bgColor: 'bg-fundo' },
  {
    id: 'animal-6',
    Icon: BsSuitDiamondFill,
    borderColor: 'border-fundo',
    bgColor: 'bg-fundo',
    rotate: 'rotate-90'
  },
  {
    id: 'animal-7',
    Icon: TbHexagonFilled,
    borderColor: 'border-green-200',
    bgColor: 'bg-green-200',
    rotate: 'rotate-90'
  },
  { id: 'animal-8', Icon: FaStar, borderColor: 'border-yellow-200', bgColor: 'bg-yellow-200' }
]

function DraggableElement({ item, index, activeId }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-item-${index}`
  })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : '',
    opacity: activeId === `draggable-item-${index}` ? 0 : 1
  }

  return item ? (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center justify-center h-[6rem] w-[6rem] m-4 rounded-lg border-fundo border-2 bg-white"
    >
      <img
        src={item.data}
        alt={`imagem-${index}`}
        className="h-full w-full object-cover rounded-lg"
        onError={(e) => {
          console.log(`Failed to load image: ${JSON.stringify(item)}`)
          e.target.style.display = 'none'
        }}
      />
    </div>
  ) : (
    <div className="flex items-center justify-center h-[6rem] w-[6rem] m-4 rounded-lg border-fundo border-2 bg-white">
      <IoPawSharp className="text-linha text-4xl" />
    </div>
  )
}

function DroppableBlock({ block, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-block-${block.id}`
  })

  const style = {
    backgroundColor: isOver ? 'lightblue' : ''
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-center h-[6rem] w-[6rem] rounded-lg border-2 ${block.borderColor} ${block.bgColor}`}
    >
      {children}
    </div>
  )
}

export default function Animal(): JSX.Element {
  const { blockImages, setBlockImages } = useContext(BlockContext)
  const [images, setImages] = useState<{ name: string; data: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const tabBlocksRef = useRef(blocks)

  const [tabBlocks, setTabBlocks] = useState(tabBlocksRef.current)

  const fetchImages = async () => {
    const images = await (window as any).api.listActors()
    setImages(images)
    setLoading(false)
  }

  useEffect(() => {
    fetchImages()
    const intervalId = setInterval(fetchImages, 500)
    return () => clearInterval(intervalId)
  }, [])

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { over } = event
    if (over && activeId) {
      handleDrop(over.id)
    }
    setActiveId(null)
  }

  const handleDrop = (id) => {
    if (activeId && activeId.startsWith('draggable-item-')) {
      const index = parseInt(activeId.replace('draggable-item-', ''), 10)
      const newBlockIndex = tabBlocks.findIndex(
        (block) => block.id === id.replace('droppable-block-', '')
      )
      const newItems = [...tabBlocks]

      const newBlock = {
        ...newItems[newBlockIndex],
        Icon: () => (
          <img
            src={images[index].data}
            alt="dragged"
            className="h-full w-full object-cover rounded-lg"
          />
        )
      }
      newItems.splice(newBlockIndex, 1, newBlock)
      setTabBlocks(newItems)
      tabBlocksRef.current = newItems

      // Atualiza a variável do bloco
      const updatedBlockImages = {
        ...blockImages,
        [newBlock.id]: {
          name: images[index].name,
          type: images[index].data ? images[index].data.split(';')[0].split('/')[1] : '',
          data: images[index].data
        }
      }
      setBlockImages(updatedBlockImages)
      console.log(`Updated block ${newBlock.id}:`, updatedBlockImages[newBlock.id])
    }
  }

  useEffect(() => {
    Object.keys(blockImages).forEach((blockId) => {
      if (blockImages[blockId].data) {
        console.log(`Block ${blockId} updated:`, blockImages[blockId])
      }
    })
  }, [blockImages])

  const getActiveImage = () => {
    if (!activeId || !activeId.startsWith('draggable-item-')) return null
    const index = parseInt(activeId.replace('draggable-item-', ''), 10)
    return images[index].data
  }

  const renderItems = (items: ({ name: string; data: string } | null)[]) => {
    return (
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex w-full gap-x-[3%]">
          <div className="h-full w-[30%] flex flex-col px-6 py-2">
            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <div className="flex" key={rowIndex}>
                {items.slice(rowIndex * 3, rowIndex * 3 + 3).map((item, index) => (
                  <DraggableElement
                    key={index}
                    item={item}
                    index={rowIndex * 3 + index}
                    activeId={activeId}
                  />
                ))}
              </div>
            ))}
          </div>
          <div>
            <div className="flex w-[70%] h-full ml-[34.5%] items-center justify-center ">
              <Label className="relative flex w-[58rem] h-[24.6rem] flex-col items-center justify-center rounded-3xl border-linha border-2 bg-white">
                <div className="flex gap-x-5">
                  <div className="h-full w-full grid grid-cols-3 gap-x-[4.5rem] gap-y-[1.5rem] px-6 py-2">
                    {tabBlocks.map((block) => (
                      <DroppableBlock key={block.id} block={block}>
                        <block.Icon className={`text-white text-4xl ${block.rotate || ''}`} />
                      </DroppableBlock>
                    ))}
                  </div>
                </div>
              </Label>
            </div>
          </div>
        </div>
        <DragOverlay>
          {activeId && (
            <div className="flex items-center justify-center h-[6rem] w-[6rem] m-4 rounded-lg border-fundo border-2 bg-white">
              <img src={getActiveImage() || ''} className="h-full w-full object-cover rounded-lg" />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    )
  }

  return (
    <div className="h-full w-full">
      {loading
        ? null
        : images.length === 0
          ? renderItems([...Array(9).fill(null)])
          : renderItems(images)}
    </div>
  )
}
