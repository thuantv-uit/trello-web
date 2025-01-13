import { Box } from '@mui/material'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'
// import { Tooltip } from 'react-tooltip'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': { color: 'white' },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode == 'dark' ? '#34495e' : '#1976d2'),
      padding: '8px',
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label={board?.title}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />} label="Add to GoogleDrive"
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />} label="Automation"
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />} label="Filters"
          clickable
        />

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<GroupAddIcon/>}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>

        <AvatarGroup
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
          max={4}>
          <Avatar alt="Remy Sharp" src="https://petsastherapy.org/images/uploads/cutouts/Cats_for_website_2.0_copy_.png" />
          <Avatar alt="Travis Howard" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUL1_1NLwMJQ7iJHbwI1Qdhph8FTrj3Y7TKw&s" />
          <Avatar alt="Cindy Baker" src="https://wwfgifts-files.worldwildlife.org/wwfgifts/images/black-footed-cat-large-photo.jpg" />
          <Avatar alt="Agnes Walker" src="https://cdn.royalcanin-weshare-online.io/WWkRPmYBG95Xk-RB2d3n/v1/ec2h-does-a-cat-fit-with-your-lifestyle-hero-cat" />
          <Avatar alt="Trevor Henderson" src="https://www.cats.org.uk/media/3236/choosing-a-cat.jpg" />
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar