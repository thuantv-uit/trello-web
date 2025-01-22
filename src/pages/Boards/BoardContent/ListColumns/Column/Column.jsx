import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Cloud from '@mui/icons-material/Cloud'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import { mapOrder } from '~/utils/sorts'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import { useConfirm } from 'material-ui-confirm'
import { createNewCardAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { deleteColumnDetailsAPI } from '~/apis'

import { toast } from 'react-toastify'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Column({ column }) {

  const dispatch = useDispatch()

  const board = useSelector(selectCurrentActiveBoard)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })
  const dndKitColumnStyles = {
    touchAction: 'none',
    // use Translate not Transform
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const orderdCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

  const [newCardTitle, setNewCardTitle] = useState('')
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)
  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Please enter Card title', { position: 'bottom-left' })
      return
    }

    // Tạo dữ liệu Card để gọi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }
    // Func này có nhiệm vụ gọi API tạo mới Card và làm lại dữ liệu State Board
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Đang fix không biết bị lỗi UI hay lỗi data nữa :((
    // Cập nhât state board (Card)
    const newBoard = cloneDeep(board)
    // const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    dispatch(updateCurrentActiveBoard(newBoard))

    // Đóng trạng thái thêm Column mới & Clean Input
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  // Xử lý kéo thả một Column và Cards bên trong nó
  const confirmDeleteColumn = new useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete Column?',
      description: 'This action will permanently delete your Column and its Cards! Are you sure ?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel',
      dialogProps: { maxWidth: 'xs' },
      allowClose: false
    })
      .then(() => {
        // Cập nhật lại state board
        const newBoard = { ...board }
        newBoard.columns = newBoard.columns.filter(c => c._id !== column._id)
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== column._id)
        // setBoard(newBoard)
        dispatch(updateCurrentActiveBoard(newBoard))
        // Gọi API xử lí phía BE
        deleteColumnDetailsAPI(column._id).then(res => {
          toast.success(res?.deleteResult)
        })
      })
      .catch(() => {
        /* ... */
      })
  }

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode == 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc( ${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}>

        {/* Box Column Header */}
        <Box sx={{
          height: (theme) => theme.trello.COLUMN_HEADER_HEIGHT,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant='h6' sx={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            {column?.title}
          </Typography>
          <Box>
            <Tooltip title='More opnions'>
              <KeyboardArrowDownIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
              onClick={handleClose}
            >
              <MenuItem
                onClick={toggleOpenNewCardForm}
                sx={{
                  '&:hover': { color: 'success.light', '& .add-card-icon': { color: 'success.light' }
                  }
                }}
              >
                <ListItemIcon><AddCardIcon className="add-card-icon" fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{ '&:hover': { color: 'warning.dark', '& .delete-icon': { color: 'warning.dark' } } }}>
                <ListItemIcon><DeleteIcon className="delete-icon" fontSize="small" /></ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* List Cards */}
        <ListCards cards={orderdCards} />

        {/* Box column Footer */}
        <Box sx={{
          height: (theme) => theme.trello.COLUMN_FOOTER_HEIGHT,
          p: 2
        }}>
          {!openNewCardForm
            ? <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button startIcon={<AddCardIcon/>} onClick={toggleOpenNewCardForm}>Add new card</Button>
              <Tooltip title='Drag to move'>
                <DragHandleIcon sx={{ cursor: 'pointer' }}/>
              </Tooltip>
            </Box>
            : <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TextField
                label="Enter card title..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dard' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  onClick={addNewCard}
                  variant="contained" color="success" size="small"
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}
                >Add</Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer'
                    // '&:hover': { color: (theme) => theme.palette.error.light }
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column