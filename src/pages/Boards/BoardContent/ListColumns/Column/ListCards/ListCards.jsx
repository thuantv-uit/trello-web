import { Box } from '@mui/material'
import Card from './Card/Card'

function ListCards() {
  return (
    <Box sx= {{
      p: '0 5px',
      m: '0 5px',
      display: 'grid',
      gap: 1,
      overflowX: 'hidden',
      overflowY: 'auto',
      maxHeight: (theme) => `calc( ${theme.trello.boardContentHeight} - 
        ${theme.spacing(5)} - 
        ${(theme) => theme.trello.COLUMN_HEADER_HEIGHT} -
        ${(theme) => theme.trello.COLUMN_FOOTER_HEIGHT}
        )`,
      '&::-webkit-scrollbar-thumb': { backgroundColor: '#cde1aa' },
      '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }
    }}>
      <Card />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />

    </Box>
  )
}

export default ListCards