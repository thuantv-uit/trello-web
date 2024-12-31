
import { Container } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoadrContent from './BoardContent/BoardContent'

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