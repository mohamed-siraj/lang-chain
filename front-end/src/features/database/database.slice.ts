/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { fetchAll, checkConnection, fetchByName, create, remove, update  } from "./database.service";
import toast from 'react-hot-toast';

interface DatabaseState {
  databases: any[];
  database: any;
  connectionStatus: any;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  loading: boolean;
}

const initialState: DatabaseState = {
  databases: [],
  database: {},
  status: "idle",
  error: null,
  loading: false,
  connectionStatus: {}
};

export const DatabaseSlice = createSlice({
    name: "databases",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // FetchAll
        .addCase(fetchAll.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(fetchAll.fulfilled, (state, action) => {
            state.databases = action.payload;
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
            state.database = action.payload;
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
        .addCase(create.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(create.fulfilled, (state, action) => {
            state.databases.push(action.payload);
            state.status = "succeeded";
            toast.success("Database created successfully")
        })
        .addCase(create.rejected, (state, action) => {
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
            state.databases = state.databases.filter((database) => database.id !== Number(deletedId));
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
            const index = state.databases.findIndex((database) => database.id === updatedData.id);
            if (index !== -1) {
              state.databases[index] = updatedData;
            }
            state.status = "succeeded";
          })
        .addCase(update.rejected, (state, action) => {
            state.loading = false;
        });
    },
  });

export default DatabaseSlice.reducer;
