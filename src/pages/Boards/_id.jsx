
import { useEffect, useState } from 'react'
import { Container } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoadrContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock_data'
import { fetchBoardDatailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis'

function Board() {

  const [board, setBoard] = useState(null)
  useEffect(() => {
    // Hiện tại fix cứng boardId, về sau sẽ sử dụng react-router-dom để lấy chuẩn boardId từ URL về.
    const boardId = '6783ac4b67296cc4957c45fa'
    // Call API
    fetchBoardDatailsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])

  // Func này có nhiệm vụ gọi API tạo mới Column và làm lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    console.log('createdColumn: ', createdColumn)
    // Cập nhât state board
  }

  // Func này có nhiệm vụ gọi API tạo mới Card và làm lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    console.log('createdColumn: ', createdCard)
    // Cập nhât state board
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
        />
      </Container>
    </>
  )
}

export default Board