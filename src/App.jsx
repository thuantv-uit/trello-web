
import { useColorScheme } from '@mui/material/styles'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import { Box, Container } from '@mui/material'


function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    const selectedMode = event.target.value
    setMode(selectedMode)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="label-select-dark-light">Mode</InputLabel>
      <Select
        labelId="label-select-dark-light"
        id="label-select-dark-light"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        <MenuItem value='light'>
          <div style={{ display: 'flex', alignContent: 'center', gap: '8px' }}>
            <LightModeIcon fontSize='small'></LightModeIcon>Light
          </div>
        </MenuItem>

        <MenuItem value='dark'>
          <Box sx={{ display: 'flex', alignContent: 'center', gap: 2 }}>
            <DarkModeOutlinedIcon fontSize='small'></DarkModeOutlinedIcon>Dark
          </Box>
        </MenuItem>

        <MenuItem value='system'>
          <Box sx={{ display: 'flex', alignContent: 'center', gap: 2 }}>
            <SettingsBrightnessIcon fontSize='small'></SettingsBrightnessIcon>System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

function App() {
  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height:'100vh' }}>
        <Box sx={{
          backgroundColor: 'primary.light',
          width: '100%',
          height: (theme) => theme.trello.appBarHeight,
          display: 'flex',
          alignItems: 'center'
        }}>
          <ModeSelect/>
        </Box>
        <Box sx={{
          backgroundColor: 'primary.dark',
          width: '100%',
          height: (theme) => theme.trello.boardBarHeight,
          display: 'flex',
          alignItems: 'center'
        }}>
          Board Bar
        </Box>
        <Box sx={{
          backgroundColor: 'primary.light',
          width: '100%',
          height: 'calc(100vh - 58px - 48px)'
          // height: (theme) => `calc(100vh - ${theme.trello.appBarheight} - ${theme.trello.boardBarHeight})`
        }}>
          Board Center
        </Box>
      </Container>

    </>
  )
}

export default App
