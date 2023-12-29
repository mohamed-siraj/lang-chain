/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { fetchAll, checkConnection, fetchByName, createObjFromLink, remove, update, createPdfLink  } from "./indexes.service";
import toast from 'react-hot-toast';

interface indexesState {
  indexes: any[];
  singleIndex: any;
  connectionStatus: any;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  loading: boolean;
}

const initialState: indexesState = {
  indexes: [],
  singleIndex: {},
  status: "idle",
  error: null,
  loading: false,
  connectionStatus: {}
};

export const IndexesSlice = createSlice({
    name: "indexes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // FetchAll
        .addCase(fetchAll.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(fetchAll.fulfilled, (state, action) => {
            state.indexes = action.payload;
            state.status = "succeeded";
            toast('Initiated!', {
                icon: '⏳',
            });
        })
        .addCase(fetchAll.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
            toast.error("Something went wrong")
        })
        // Fetch by Name
        .addCase(fetchByName.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(fetchByName.fulfilled, (state, action) => {
            state.singleIndex = action.payload;
            state.status = "succeeded";
        })
        .addCase(fetchByName.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
        })
        // check Connection
        .addCase(checkConnection.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(checkConnection.fulfilled, (state, action) => {
            state.connectionStatus = action.payload;
            state.status = "succeeded";
        })
        .addCase(checkConnection.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
        })
        // Create
        .addCase(createObjFromLink.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(createObjFromLink.fulfilled, (state, action) => {
            state.indexes.push(action.payload);
            state.status = "succeeded";
            toast.success("Object created successfully")
        })
        .addCase(createObjFromLink.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
            toast.error("Internal Server Error")
        })
        .addCase(createPdfLink.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(createPdfLink.fulfilled, (state, action) => {
            state.indexes.push(action.payload);
            state.status = "succeeded";
            toast.success("PDF Uploaded successfully")
        })
        .addCase(createPdfLink.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
            toast.error("Internal Server Error")
        })
        // Delete
        .addCase(remove.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(remove.fulfilled, (state, action) => {
            const deletedId = action.payload;
            state.indexes = state.indexes.filter((database) => database.id !== Number(deletedId));
            state.status = "succeeded";
        })
        .addCase(remove.rejected, (state, action) => {
            state.loading = false;
        })
        // Update
        .addCase(update.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(update.fulfilled, (state, action) => {
            const updatedData = action.payload;
            const index = state.indexes.findIndex((database) => database.id === updatedData.id);
            if (index !== -1) {
              state.indexes[index] = updatedData;
            }
            state.status = "succeeded";
          })
        .addCase(update.rejected, (state, action) => {
            state.loading = false;
        });
    },
  });

export default IndexesSlice.reducer;
