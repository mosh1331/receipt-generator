import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../db";

// 🧩 Thunks
export const loadItems = createAsyncThunk("items/load", async () => {
  const data = await db.products.toArray();
  return data;
});

export const addItemToDB = createAsyncThunk("items/addToDB", async (item) => {
  await db.products.add(item);
  return await db.products.toArray();
});

export const removeItemFromDB = createAsyncThunk("items/removeFromDB", async (id) => {
  await db.products.delete(id);
  return await db.products.toArray();
});

export const resetItemsInDB = createAsyncThunk("items/resetInDB", async () => {
  await db.products.clear();
  return [];
});

// 🧠 Slice
const itemsSlice = createSlice({
  name: "items",
  initialState: {
    list: [],
  },
  reducers: {
    addItem: (state, action) => {
      state.list.push(action.payload);
    },
    removeItem: (state, action) => {
      state.list = state.list.filter((_, idx) => idx !== action.payload);
    },
    resetItems: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadItems.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addItemToDB.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(removeItemFromDB.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(resetItemsInDB.fulfilled, (state, action) => {
        state.list = [];
      });
  },
});

export const { addItem, removeItem, resetItems } = itemsSlice.actions;
export default itemsSlice.reducer;
