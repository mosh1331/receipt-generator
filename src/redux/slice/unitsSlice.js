import { createSlice } from "@reduxjs/toolkit";

const unitsSlice = createSlice({
  name: "units",
  initialState: {
    list: ["pcs", "kg", "litre", "cm"],
  },
  reducers: {
    addUnit: (state, action) => {
      if (!state.list.includes(action.payload)) {
        state.list.push(action.payload);
      }
    },
    removeUnit: (state, action) => {
      state.list = state.list.filter((u) => u !== action.payload);
    },
  },
});

export const { addUnit, removeUnit } = unitsSlice.actions;
export default unitsSlice.reducer;
