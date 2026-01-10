import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

const pendingBillsSlice = createSlice({
  name: 'pendingBills',
  initialState: {
    list: []
  },
  reducers: {
    addPendingBill: (state, action) => {
      // action.payload = { id, customer, items, total, receivedAmount? }
      const { id, customer, items, total, receivedAmount = 0 } = action.payload
      // 🔒 Prevent duplicate pending bills for same customer
        console.log(state.list,'bill cust')

      const existingIndex = state.list.findIndex(
        bill => bill.customer === customer
      )

      // Build initial transactions array
      const transactions =
        receivedAmount > 0
          ? [
              {
                amount: Number(receivedAmount),
                date: dayjs().format('HH:mm a DD-MMM-YYYY')
              }
            ]
          : []

      const totalReceived = transactions.reduce((sum, t) => sum + t.amount, 0)

      const balance = total - totalReceived

      let status = 'unpaid'
      if (totalReceived > 0 && totalReceived < total) status = 'partial'
      if (totalReceived >= total) status = 'paid'

      const billData = {
        id,
        customer,
        items,
        total,
        transactions,
        receivedAmount: totalReceived,
        balance,
        status
      }

      // 🔁 Replace existing bill OR add new
      if (existingIndex !== -1) {
        state.list[existingIndex] = billData
      } else {
        state.list.push(billData)
      }
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
