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

      // case 1: no amount received
      if (receivedAmount === 0) {
        state.list.push({ ...action.payload, status: "unpaid", balance: total });
      }
      // case 2: partial payment
      else if (receivedAmount < total) {
        state.list.push({
          ...action.payload,
          status: "partial",
          balance: total - receivedAmount,
        });
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

export const { addPendingBill, removePendingBill, clearPendingBills } = pendingBillsSlice.actions;
export default pendingBillsSlice.reducer;
