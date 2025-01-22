import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

// Khởi tạo giá trị State của 1 cái Slice trong Redux
const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchBoardDatailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDatailsAPI',
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    //Lưu ý: axios sẽ trả về kết quả về qua property của nó là data
    return response.data
  }
)

// Khởi tạo một Slice trong kho lưu trữ Redux Store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    // Lưu ý luôn là ở đây luôn luôn cần cặp ngoặc nhọn cho function trong reducer cho dù code bên trong chỉ có 1 dòng, đây là rule của Redux
    updateCurrentActiveBoard: (state, action) => {
    // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
      const board = action.payload
      // Xử lý dữ liệu nếu cần thiết ...
      // ...

      // Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    }
  },

  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDatailsAPI.fulfilled, (state, action) => {
    // action.payload ở đây chính là response.data trả về ở trên
      let board = action.payload

      // Xử lí vấn đề kéo thả vào Column rỗng (đã được đề cập ở phía Front-end)
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })

      // Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    })
  }

})

// Action: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thất properties actions đâu cả, bởi vì những cái action này đơn giản là được thằng redux tạo tự động theo tên của reducer
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// Cái file này tên là activeBoardSlice nhưng ta sẽ export một thứ tên là Reducer, mọi người lưu ý
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer