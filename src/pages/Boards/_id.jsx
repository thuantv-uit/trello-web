
import { Container } from '@mui/material'
import AppBar from '../../components/AppBar'
import BoardBar from './BoardBar'
import BoadrContent from './BoardContent'

function Board() {
  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height:'100vh' }}>
        <AppBar></AppBar>
        <BoardBar></BoardBar>
        <BoadrContent></BoadrContent>
      </Container>
    </>
  )
}

export default Board