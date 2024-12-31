import { Box } from '@mui/material'

function BoadrContent() {
  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode == 'dark' ? '#34495e' : '#1976d2'),
      width: '100%',
      height: 'calc(100vh - 58px - 58px)',
      // height: (theme) => `calc(100vh - ${theme.trello.appBarheight} - ${theme.trello.boardBarHeight})`
      display: 'flex',
      alignItems: 'center'
    }}>
    Board Center
    </Box>
  )
}

export default BoadrContent