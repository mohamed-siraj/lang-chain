/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { fetchAll, fetchById, fetchByName, create, remove, update  } from "./models.service";

interface ModelState {
  models: any[];
  model: any;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  loading: boolean;
}

const initialState: ModelState = {
  models: [],
  model: {},
  status: "idle",
  error: null,
  loading: false,
};

export const ModelSlice = createSlice({
    name: "model",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // FetchAll
        .addCase(fetchAll.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(fetchAll.fulfilled, (state, action) => {
            state.models = action.payload;
            state.status = "succeeded";
        })
        .addCase(fetchAll.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
        })
        // Fetch by Name
        .addCase(fetchByName.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(fetchByName.fulfilled, (state, action) => {
            state.model = action.payload;
            state.status = "succeeded";
        })
        .addCase(fetchByName.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
        })
        // Fetch by Id
        .addCase(fetchById.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(fetchById.fulfilled, (state, action) => {
            state.model = action.payload;
            state.status = "succeeded";
        })
        .addCase(fetchById.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
        })
        // Create
        .addCase(create.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(create.fulfilled, (state, action) => {
            state.models.push(action.payload);
            state.status = "succeeded";
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
            const deletedId = action.payload;
            state.models = state.models.filter((model) => model.id !== Number(deletedId));
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
            const index = state.models.findIndex((model) => model.id === updatedData.id);
            if (index !== -1) {
              state.models[index] = updatedData;
            }
            state.status = "succeeded";
          })
        .addCase(update.rejected, (state, action) => {
            state.loading = false;
        });
    },
  });

export default ModelSlice.reducer;
