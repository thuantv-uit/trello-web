import { Box } from '@mui/material'
import Column from './Column/Column'
import { Button } from '@mui/material'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { createNewColumnAPI } from '~/apis'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useSelector } from 'react-redux'
import { generatePlaceholderCard } from '~/utils/formatters'

import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
// import { cloneDeep } from 'lodash'
// import { useDispatch } from 'react-redux'

function ListColumns({ columns }) {

  const board = useSelector(selectCurrentActiveBoard)
  // const dispatch = useDispatch()


  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter Column Title!')
      return
    }
    // Taọ dữ liệu Column để gọi API
    const newColumnData = {
      title: newColumnTitle
    }
    // Func này có nhiệm vụ gọi API tạo mới Column và làm lại dữ liệu State Board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    // Xử lí vấn đề kéo thả vào Column rỗng (đã được đề cập ở phía Front-end)
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Đang fix không biết bị lỗi UI hay lỗi data nữa :((
    // Cập nhât state board (Column)
    // Phía Front-end tự làm đúng lại state data board (thay vì gọi lại API fetchBoardDatailsAPI)
    // Đoạn này sẽ dính lỗi object is not extensible bởi vì dù đã copy/clone giá trị newBoard nhưng bản chất
    // của spread operator là Shallow Copy/Clone, nên dính phải rules Immtability trong Redux Toolkit không
    // dùng được hàm PUSH (sửa giá trị mảng trực tiếp), cách đơn giản nhất trong trường hợp này của chúng ta là dùng
    // tới Deep Copy/Clone toàn bộ cái bảng Board cho dễ hiểu và code ngắn gọn
    // const newBoard = { ...board }
    // const newBoard = cloneDeep(board)
    // newBoard.columns.push(createdColumn)
    // newBoard.columnOrderIds.push(createdColumn._id)
    // setBoard(newBoard)
    // dispatch(updateCurrentActiveBoard(newBoard))
    // Gọi API ở đây ...
    // Đóng trạng thái thêm Column mới & Clean Input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {columns?.map(column =>
          <Column key={column._id} column={column}/>
        )}

        {/* Button add  */}
        {!openNewColumnForm
          ? <Box onClick={toggleOpenNewColumnForm} sx={{
            minWidth: '250px',
            maxWidth: '250px',
            bgcolor: '#ffffff3d',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content'
          }}>
            <Button
              startIcon= {<NoteAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}>
              Add new column
            </Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              label="Enter column title..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }

              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={addNewColumn}
                variant="contained" color="success" size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >Add Column</Button>
              <CloseIcon
                fontSize='small'
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.error.light }
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns