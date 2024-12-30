import { Box } from '@mui/material'

function BoadrContent() {
  return (
    <Box sx={{
      backgroundColor: 'primary.light',
      width: '100%',
      height: 'calc(100vh - 58px - 48px)',
      // height: (theme) => `calc(100vh - ${theme.trello.appBarheight} - ${theme.trello.boardBarHeight})`
      display: 'flex',
      alignItems: 'center'
    }}>
    Board Center
    </Box>
  )
}

export default BoadrContent