import { createSlice } from '@reduxjs/toolkit'

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    list: []
  },
  reducers: {
    addItem: (state, action) => {
      state.list.push(action.payload)
    },
    removeItem: (state, action) => {
      state.list = state.list.filter((_, idx) => idx !== action.payload)
    },
    resetItems: state => {
      state.list = []
    }
  }
})

export const { addItem, removeItem, resetItems } =
  itemsSlice.actions
export default itemsSlice.reducer
