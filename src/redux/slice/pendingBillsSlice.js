import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

const pendingBillsSlice = createSlice({
  name: 'pendingBills',
  initialState: {
    list: []
  },
  reducers: {
    addPendingBill: (state, action) => {
      // action.payload = { id, customer, items, total, receivedAmount }
      const { id, customer, items, total, receivedAmount = 0 } = action.payload

      const transactions =
        receivedAmount > 0
          ? [{ amount: receivedAmount, date: dayjs().format("HH:MM a DD-MMM-YYYY") }]
          : []

      const balance = total - receivedAmount

      let status = 'unpaid'
      if (receivedAmount > 0 && receivedAmount < total) status = 'partial'
      if (receivedAmount >= total) status = 'paid'

      state.list.push({
        id,
        customer,
        items,
        total,
        receivedAmount,
        balance,
        transactions,
        status
      })
    },

    updatePendingBill: (state, action) => {
      const updatedBill = action.payload
      const index = state.list.findIndex(
        bill => bill.customer === updatedBill.customer
      )

      if (index !== -1) {
        const totalReceived = updatedBill.transactions.reduce(
          (sum, t) => sum + t.amount,
          0
        )
        const balance = updatedBill.total - totalReceived

        let status = 'unpaid'
        if (totalReceived > 0 && totalReceived < updatedBill.total)
          status = 'partial'
        if (totalReceived >= updatedBill.total) status = 'paid'

        state.list[index] = {
          ...updatedBill,
          receivedAmount: totalReceived,
          balance,
          status
        }
      }
    },

    removePendingBill: (state, action) => {
      // action.payload = bill id
      state.list = state.list.filter(bill => bill.id !== action.payload)
    },

    clearPendingBills: state => {
      state.list = []
    }
  }
})

export const {
  addPendingBill,
  updatePendingBill,
  removePendingBill,
  clearPendingBills
} = pendingBillsSlice.actions

export default pendingBillsSlice.reducer
