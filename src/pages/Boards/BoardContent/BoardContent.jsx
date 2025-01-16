import { Box } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
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
  defaultDropAnimationSideEffects,
  closestCorners
  // closestCenter
} from '@dnd-kit/core'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

// Khai báo biến Column và Card
const ACTIVE_DRAP_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAP_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAP_ITEM_TYPE_CARD'
}

function BoadrContent({ board, createNewColumn, createNewCard, moveColumns, moveCardInTheSameColumn }) {
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
  const [oldColumn, setOldColumn] = useState( [null] )

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  //  Tìm một Colum theo CardId
  const findColumnByCardId = (cardId) => {
    // Đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới.
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Function chung xử lý việc cập nhật lại state trong trường hợp di chuyển Card giữa các Columns khác nhau.
  const moveCardBetweenDifferenctColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      // Tìm vị trí (index) của cái overCard trong Column đích (nơi activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id ===overCardId)

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
        // Thêm Placeholder Card nếu Column rỗng: bị kéo hết Card đi
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      // Column mới
      if (nextOverColumns) {
        // Kiểm tra xem card đang kéo có tồn tại ở overColumn hay chưa, nếu có thì cần xóa nó trước
        nextOverColumns.cards = nextOverColumns.cards.filter(card => card._id !== activeDraggingCardId)
        // Đối với trường hợp 2 column khác nhau thì phải cập nhật lại giá trị "columnId" cho chính xác, tránh những lỗi không đáng có
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumns._id
        }
        // Xóa placeCard đi nếu nó đang có phần tử mới vào
        nextOverColumns.cards = nextOverColumns.cards.filter(card => !card.FE_PlaceholderCard)
        // Sau đó thêm card đang kéo vào overColumn theo vị trí index mới
        nextOverColumns.cards = nextOverColumns.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumns.cardOrderIds = nextOverColumns.cards.map(card => card._id)
      }
      return nextColumns
    })
  }

  // Trigger Khi bắt đầu kéo (drag) một phần tử
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDrapItemId(event?.active?.id)
    setActiveDrapItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAP_ITEM_TYPE.CARD : ACTIVE_DRAP_ITEM_TYPE.COLUMN)
    setActiveDrapItemData(event?.active?.data?.current)
    // Nếu mà kéo card thì mới thực hiện những hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumn(findColumnByCardId(event?.active?.id))
    }

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
      moveCardBetweenDifferenctColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  //Trigger khi kết thúc hành động kéo một phần tử => hành động thả (drop)
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event
    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì (tránh crash trang)
    if (!active || !over) return
    // Nếu vị trí sau khi kéo thả khác với vị trị ban đầu

    // Xử lí kéo thả Card
    if (activeDrapItemType === ACTIVE_DRAP_ITEM_TYPE.CARD) {
      // activeDraggingCard là card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard là card đang tương tác trên hoặc dưới so với card được kéo ở trên
      const { id: overCardId } = over
      // Tìm 2 cái columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      // Nếu không tồn tại một trong 2 column thì không làm gì hết, tránh crash Web
      if (!activeColumn || !overColumn) return
      // Đối với trường hợp 2 card khác column
      if (oldColumn._id !== overColumn._id) {
        moveCardBetweenDifferenctColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      }
      // Đối với trường hợp 2 card cùng column
      else {
        // Lấy vị trí cũ (từ oldColumn)
        const oldCard = oldColumn?.cards?.findIndex(c => c._id === activeDrapItemId)
        // Lấy vị trí cũ (từ oldColumn)
        const newCard = overColumn?.cards.findIndex(c => c._id === overCardId)
        // kéo card trong một column
        const dndOrderedCards = arrayMove(oldColumn?.cards, oldCard, newCard)
        const dndOrderedCardIds = dndOrderedCards.map(card => card._id)
        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          // Cập nhật lại 2 giá trị mới là card và carOderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardIds
          // Trả về dữ liệu ban sau sữa chữa
          return nextColumns
        })
        // Gọi lên props function moveCardInSameColumn nằm ở component cao nhất (board/_id.jsx)
        // Lưu ý: về sau sẽ đưa dữ liệu board ra ngoài Redux Global Store
        //
        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumn._id)
      }
    }

    // Xử lí kéo thẻ Column
    if (activeDrapItemType === ACTIVE_DRAP_ITEM_TYPE.COLUMN) {
      // Nếu vị trí sau khác vị trí ban đầu
      if (active.id !== over.id ) {
        // Lấy vị trí cũ (từ active)
        const oldColumn = orderedColumns.findIndex(c => c._id === active.id)
        // Lấy vị trí cũ (từ active)
        const newColumn = orderedColumns.findIndex(c => c._id === over.id)
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumn, newColumn)
        // Cập nhật lại state columns bao đầu sau khi kéo thả
        setOrderedColumns(dndOrderedColumns)
        // Gọi lên props function moveColumns nằm ở componet cao nhất (board/_id.jsx)
        // Sau này sẽ đưa dữ liệu Board ra ngoài Redux GloBal Store, việc này sẽ làm Clean code hơn
        moveColumns(dndOrderedColumns)
      }
    }
    // Những dữ liệu sau khi kéo thả này phải luôn đưa về giá trị null mặc định ban đầu
    setActiveDrapItemId(null)
    setActiveDrapItemType(null)
    setActiveDrapItemData(null)
    setOldColumn(null)
  }

  // Thêm hiệu ứng trong lúc kéo thả
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
      // Cảm biến
      sensors={mySensors}
      // Thuật toán phát hiện va chạm
      collisionDetection={closestCorners}
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
        <ListColumns
          // columns={board?.columns}
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
        />
        {/* Cập nhập hiệu ứng và các giá trị của Column và Card sau khi kéo thả */}
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