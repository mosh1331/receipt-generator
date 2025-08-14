import { createSlice } from "@reduxjs/toolkit";

const recipientsSlice = createSlice({
  name: "recipients",
  initialState: {
    list: [],
  },
  reducers: {
    addRecipient: (state, action) => {
      state.list.push(action.payload);
    },
    removeRecipient: (state, action) => {
      state.list = state.list.filter((_, idx) => idx !== action.payload);
    },
    resetRecipients: (state) => {
      state.list = [];
    },
  },
});

export const { addRecipient, removeRecipient, resetRecipients } = recipientsSlice.actions;
export default recipientsSlice.reducer;
