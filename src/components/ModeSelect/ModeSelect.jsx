import { useColorScheme } from '@mui/material/styles'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import { Box } from '@mui/material'


function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    const selectedMode = event.target.value
    setMode(selectedMode)
  }

  return (
    <FormControl size="small" sx={{ minWidth: '120px' }}>
      <InputLabel
        id="label-select-dark-light"
        sx={{
          color: 'white',
          '&.Mui-focused': { color: 'white' }
        }}
      >
          Mode
      </InputLabel>
      <Select
        labelId="label-select-dark-light"
        id="label-select-dark-light"
        value={mode}
        label="Mode"
        onChange={handleChange}
        sx={{
          color: 'white',
          '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
          '.MuiSvgIcon-root': { color: 'white' }


        }}
      >
        <MenuItem value='light'>
          <Box sx={{ display: 'flex', alignContent: 'center', gap: 1 }}>
            <LightModeIcon fontSize='small'></LightModeIcon>Light
          </Box>
        </MenuItem>

        <MenuItem value='dark'>
          <Box sx={{ display: 'flex', alignContent: 'center', gap: 1 }}>
            <DarkModeOutlinedIcon fontSize='small'></DarkModeOutlinedIcon>Dark
          </Box>
        </MenuItem>

        <MenuItem value='system'>
          <Box sx={{ display: 'flex', alignContent: 'center', gap: 1 }}>
            <SettingsBrightnessIcon fontSize='small'></SettingsBrightnessIcon>System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default ModeSelect