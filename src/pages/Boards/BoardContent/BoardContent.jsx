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
import { cloneDeep } from 'lodash'

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

  //  Tìm một Colum theo CardId
  const findColumnByCardId = (cardId) => {
    // Đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới.
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Trigger Khi bắt đầu kéo (drag) một phần tử
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDrapItemId(event?.active?.id)
    setActiveDrapItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAP_ITEM_TYPE.CARD : ACTIVE_DRAP_ITEM_TYPE.COLUMN)
    setActiveDrapItemData(event?.active?.data?.current)
  }

  // Trigger trong quá trình kéo (drag) một phần tử
  const handleDragOver = (event) => {
    // không làm gì thêm nếu đang kéo Column
    if (activeDrapItemType === ACTIVE_DRAP_ITEM_TYPE.COLUMN) return
    // Còn nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các columns
    // console.log('handleDragOver: ', event)
    const { active, over } = event
    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì (tránh crash trang)
    if (!active || !over) return
    // activeDraggingCard là card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard là card đang tương tác trên hoặc dưới so với card được kéo ở trên
    const { id: overCardId } = over
    // Tìm 2 cái columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // Nếu không tồn tại một trong 2 column thì không làm gì hết, tránh crash Web
    if (!activeColumn || !overColumn) return
    // Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu card trong chính card ban đầu của nó thì không làm gì hết
    // Vì đây đang là đoạn xử lý lúc kéo(handleDragOver), còn xử lý lúc kéo xong thì lại là vấn đề khác ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns(prevColumns => {
        // Tìm vị trí (index) của cái overCard trong Column đích (nơi activeCard sắp được thả)
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id ===overCardId)
        console.log('overCardIndex: ', overCardIndex)

        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumns = nextColumns.find(column => column._id === overColumn._id)
        // Column cũ
        if (nextActiveColumn) {
          // Xóa card ở column active (cũng có thể hiểu là column cũ, lúc mà kéo card ra khỏi nó để sang column khác)
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }
        // Column mới
        if (nextOverColumns) {
          // Kiểm tra xem card đang kéo có tồn tại ở overColumn hay chưa, nếu có thì cần xóa nó trước
          nextOverColumns.cards = nextOverColumns.cards.filter(card => card._id !== activeDraggingCardId)
          // Sau đó thêm card đang kéo vào overColumn theo vị trí index mới
          nextOverColumns.cards = nextOverColumns.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextOverColumns.cardOrderIds = nextOverColumns.cards.map(card => card._id)
        }
        console.log('nextColumns: ', nextColumns)
        return nextColumns
      })
    }
  }

  //Trigger khi kết thúc hành động kéo một phần tử => hành động thả (drop)
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)

    if (activeDrapItemType === ACTIVE_DRAP_ITEM_TYPE.CARD) {
      // console.log('Action drag and drop')
      return
    }

    const { active, over } = event
    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì (tránh crash trang)
    if (!active || !over) return
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

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '1'
        }
      }
    })
  }

  return (
    <DndContext
      sensors={mySensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
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
          {(activeDrapItemType === ACTIVE_DRAP_ITEM_TYPE.COLUMN) && <Column column={activeDrapItemData} />}
          {(activeDrapItemType === ACTIVE_DRAP_ITEM_TYPE.CARD) && <Card card={activeDrapItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoadrContent