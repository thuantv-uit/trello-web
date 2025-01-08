
import { useEffect, useState } from 'react'
import { Container } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoadrContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock_data'
import { fetchBoardDatailsAPI } from '~/apis/index'

function Board() {

  const [board, setBoard] = useState(null)
  useEffect(() => {
    // Hiện tại fix cứng boardId, về sau sẽ sử dụng react-router-dom để lấy chuẩn boardId từ URL về.
    const boardId = '677eb044d2b1fc52753d1ddd'
    // Call API
    fetchBoardDatailsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])

  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height:'100vh' }}>
        <AppBar/>
        <BoardBar board={board} />
        <BoadrContent board={board} />
      </Container>
    </>
  )
}

export default Board