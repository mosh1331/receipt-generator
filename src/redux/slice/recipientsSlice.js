import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../db";

// 🧩 Thunks (Dexie-backed)
export const loadRecipients = createAsyncThunk(
  "recipients/load",
  async () => {
    const data = await db.recipients.toArray();
    return data.map((r) => r.name);
  }
);

export const addRecipientToDB = createAsyncThunk(
  "recipients/addToDB",
  async (name) => {
    await db.recipients.add({ name });
    const data = await db.recipients.toArray();
    return data.map((r) => r.name);
  }
);

export const removeRecipientFromDB = createAsyncThunk(
  "recipients/removeFromDB",
  async (name) => {
    const record = await db.recipients.where("name").equals(name).first();
    if (record) await db.recipients.delete(record.id);
    const data = await db.recipients.toArray();
    return data.map((r) => r.name);
  }
);

// 🧠 Slice
const recipientsSlice = createSlice({
  name: "recipients",
  initialState: {
    list: [],
  },
  reducers: {
    // still works for quick state updates
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
  extraReducers: (builder) => {
    builder
      .addCase(loadRecipients.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addRecipientToDB.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(removeRecipientFromDB.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  },
});

export const { addRecipient, removeRecipient, resetRecipients } = recipientsSlice.actions;
export default recipientsSlice.reducer;
