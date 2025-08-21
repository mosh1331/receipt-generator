import { createSlice } from "@reduxjs/toolkit";

const pendingBillsSlice = createSlice({
  name: "pendingBills",
  initialState: {
    list: [],
  },
  reducers: {
    addPendingBill: (state, action) => {
      // action.payload = { id, customer, items, total, receivedAmount }
      const { total, receivedAmount = 0 } = action.payload;

      if (receivedAmount === 0) {
        state.list.push({ ...action.payload, status: "unpaid", balance: total });
      } else if (receivedAmount < total) {
        state.list.push({
          ...action.payload,
          status: "partial"
        });
      }
    },

    updatePendingBill: (state, action) => {
      // action.payload = { id, ...updates }
      const { id,customer, ...updates } = action.payload;
      const index = state.list.findIndex((bill) => bill.customer === customer);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...updates };
      }
    },

    removePendingBill: (state, action) => {
      // action.payload = bill id
      state.list = state.list.filter((bill) => bill.id !== action.payload);
    },

    clearPendingBills: (state) => {
      state.list = [];
    },
  },
});

export const {
  addPendingBill,
  updatePendingBill,
  removePendingBill,
  clearPendingBills,
} = pendingBillsSlice.actions;

export default pendingBillsSlice.reducer;
