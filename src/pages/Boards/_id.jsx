
import { useEffect, useState } from 'react'
import { Box, Container } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoadrContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock_data'
import { toast } from 'react-toastify'
import {
  fetchBoardDatailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import CircularProgress from '@mui/material/CircularProgress'

function Board() {

  const [board, setBoard] = useState(null)
  useEffect(() => {
    // Hiện tại fix cứng boardId, về sau sẽ sử dụng react-router-dom để lấy chuẩn boardId từ URL về.
    const boardId = '6783ac4b67296cc4957c45fa'
    // Call API
    fetchBoardDatailsAPI(boardId).then(board => {
      // Xử lí vấn đề kéo thả vào Column rỗng (đã được đề cập ở phía Front-end)
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })
      setBoard(board)
    })
  }, [])

  // Func này có nhiệm vụ gọi API tạo mới Column và làm lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    // Xử lí vấn đề kéo thả vào Column rỗng (đã được đề cập ở phía Front-end)
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]
    // Cập nhât state board (Column)
    // Phía Front-end tự làm đúng lại state data board (thay vì gọi lại API fetchBoardDatailsAPI)
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  // Func này có nhiệm vụ gọi API tạo mới Card và làm lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    // Cập nhât state board (Card)
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  // Function này có nhiệm vụ gọi API và xử lý khi kéo thả Column xong
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    // Update cho chuẩn dữ liệu state Board
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  // Khi di chuyển Card trong cùng một Column
  // Chỉ cần gọi API để cập nhật mảng cardOrderIds của Column chứa nó (thay đổi vị trí trong mảng)
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Update cho chuẩn dữ liệu state Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)
    // Gọi API update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  // khi di chuyển card sang Column khác
  // B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (Dễ hiểu là xóa _id của Card ra khỏi mảng)
  // B2: Cập nhật lại trường CardOrderIds của Column tiếp theo (Dễ hieerur là thêm _id của Card vào mảng)
  // B3: Cập nhật lại trường columnId mới của Card đã kéo
  // Làm một API support riêng
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // Update cho chuẩn dữ liệu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API xử lí phía Back-end
    // Xử lí dữ liệu trước khi trả lên Front-end (không đẩy id có chứa placehoder-card lên FE)
    // Để giải quyết vấn đề kéo thả Card cuối cùng ra khỏi Column
    let prevCardOederIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    if (prevCardOederIds[0].includes('placehoder-card')) prevCardOederIds = []
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOederIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  // Xử lý kéo thả một Column và Cards bên trong nó
  const deleteColumnDetails = (coulumnId) => {
    // Cập nhật lại state board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(c => c._id !== coulumnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== coulumnId)
    setBoard(newBoard)

    // Gọi API xử lí phía BE
    deleteColumnDetailsAPI(coulumnId).then(res => {
      toast.success(res?.deleteResult)
    })
  }

  // Xử lí UI lúc load Board
  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vw'
      }}>
        <CircularProgress/>
      </Box>
    )
  }

  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height:'100vh' }}>
        <AppBar/>
        <BoardBar board={board} />
        <BoadrContent
          board={board}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          moveColumns={moveColumns}
          moveCardInTheSameColumn={moveCardInTheSameColumn}
          moveCardToDifferentColumn={moveCardToDifferentColumn}
          deleteColumnDetails={deleteColumnDetails}
        />
      </Container>
    </>
  )
}

export default Board