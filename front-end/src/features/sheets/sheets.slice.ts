/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { fetchAll, create, remove, update  } from "./sheets.service";
import toast from 'react-hot-toast';
interface SheetsState {
  sheets: any[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  loading: boolean;
}

const initialState: SheetsState = {
  sheets: [],
  status: "idle",
  error: null,
  loading: false
};

export const SheetsSlice = createSlice({
    name: "sheets",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Fetch All
        .addCase(fetchAll.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchAll.fulfilled, (state, action) => {
            state.sheets = action.payload;
            state.status = "succeeded";

        })
        .addCase(fetchAll.rejected, (state) => {
            state.loading = false;
            state.status = "failed";
        })
        // Create
        .addCase(create.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(create.fulfilled, (state, action) => {
            state.sheets.push(action.payload);
            console.log(action.payload, "action.payload");
            
            state.status = "succeeded";
            toast.success("Sheet created successfully")
        })
        .addCase(create.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
        })
        // Delete
        .addCase(remove.pending, (state, action) => {
          state.loading = true;
        })
        .addCase(remove.fulfilled, (state, action) => {
            state.status = "succeeded";
            toast.success("Sheet removed successfully")
        })
        .addCase(remove.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
        })
        // Update
        .addCase(update.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(update.fulfilled, (state, action) => {
            const updatedData = action.payload;
            const index = state.sheets.findIndex((sheet) => sheet.id === updatedData.id);
            if (index !== -1) {
              state.sheets[index] = updatedData;
            }
            state.status = "succeeded";
        })
        .addCase(update.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
        });
    },
  });

export default SheetsSlice.reducer;
