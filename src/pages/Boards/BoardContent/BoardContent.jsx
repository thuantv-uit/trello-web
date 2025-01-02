import { Box } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
// import { DndContext } from '@dnd-kit/core'
import { useState } from 'react'
import { useEffect } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAP_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAP_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAP_ITEM_TYPE_CARD'
}

function BoadrContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor, {activationConstraint: { distance: 10 } })
  // yêu cầu chuột di chuyển 10px thì mới chuyển mới kích hợp event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  const mySensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState( [] )

  // Cùng thời điểm chỉ có một phần tử đang được kéo (Column hoặc Card)
  const [activeDrapItemId, setActiveDrapItemId] = useState( [null] )
  const [activeDrapItemType, setActiveDrapItemType] = useState( [null] )
  const [activeDrapItemData, setActiveDrapItemData] = useState( [null] )

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Trigger Khi bắt đầu kéo (drag) một phần tử
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDrapItemId(event?.active?.id)
    setActiveDrapItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAP_ITEM_TYPE.CARD : ACTIVE_DRAP_ITEM_TYPE.COLUMN)
    setActiveDrapItemData(event?.active?.data?.current)
  }

  //Trigger khi kết thúc hành động kéo một phần tử => hành động thả (drop)
  const handleDragEnd = (event) => {
    const { active, over } = event
    // Kiểm tra nếu không tồn tại over (kéo ra nơi không có data và cick vào nó thì return để tránh lỗi)
    if (!over) return
    // Nếu vị trí sau khi kéo thả khác với vị trị ban đầu
    if (active.id !== over.id ) {
      // Lấy vị trí cũ (từ active)
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // Lấy vị trí cũ (từ active)
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // Cập nhật lại state columns bao đầu sau khi kéo thả
      setOrderedColumns(dndOrderedColumns)
    }
    setActiveDrapItemId(null)
    setActiveDrapItemType(null)
    setActiveDrapItemData(null)

  }
  // console.log('activeDrapItemId:', activeDrapItemId)
  // console.log('activeDrapItemType:', activeDrapItemType)
  // console.log('activeDrapItemData:', activeDrapItemData)

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  return (
    <DndContext
      sensors={mySensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode == 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns}/>
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDrapItemType && null}
          {(activeDrapItemType === ACTIVE_DRAP_ITEM_TYPE.COLUMN) && <Column column={setActiveDrapItemData} />}
          {(activeDrapItemType === ACTIVE_DRAP_ITEM_TYPE.CARD) && <Card card={setActiveDrapItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoadrContent