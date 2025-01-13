
import { useEffect, useState } from 'react'
import { Container } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoadrContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock_data'
import { fetchBoardDatailsAPI } from '~/apis'

function Board() {

  const [board, setBoard] = useState(null)
  useEffect(() => {
    // Hiện tại fix cứng boardId, về sau sẽ sử dụng react-router-dom để lấy chuẩn boardId từ URL về.
    const boardId = '6783ac4b67296cc4957c45fa'
    // Call API
    fetchBoardDatailsAPI(boardId).then(boardId => {
      setBoard(boardId)
    })
  }, [])

  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height:'100vh' }}>
        <AppBar/>
        <BoardBar board={board} />
        <BoadrContent board={mockData.board} />
      </Container>
    </>
  )
}

export default Board