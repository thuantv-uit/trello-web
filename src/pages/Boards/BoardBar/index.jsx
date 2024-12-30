import { Box } from '@mui/material'
// import FaceIcon from '@mui/icons-material/Face'
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

const MENU_STYLES = {
  color: 'primary.main',
  bgcolor: 'white',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      borderTop: '1px solid #00bfa5',
      padding: '8px'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />} label="Thuan Tran"
          clickable
          // onClick={() => {}}
        />

        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />} label="Public/Private Workspace"
          clickable
          // onClick={() => {}}
        />

        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />} label="Add to GoogleDrive"
          clickable
          // onClick={() => {}}
        />

        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />} label="Automation"
          clickable
          // onClick={() => {}}
        />

        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />} label="Filters"
          clickable
          // onClick={() => {}}
        />

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" startIcon={<GroupAddIcon/>}>Invite</Button>

        <AvatarGroup
          sx={{
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16
            }
          }}
          max={4}>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
          <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar