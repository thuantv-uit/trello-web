
import { Container } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoadrContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock_data'

function Board() {
  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height:'100vh' }}>
        <AppBar/>
        <BoardBar board={mockData?.board} />
        <BoadrContent board={mockData?.board} />
      </Container>
    </>
  )
}

export default Board