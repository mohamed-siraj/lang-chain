/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { fetchAll, create, remove, update  } from "./todo.service";

interface TodoState {
  todos: any[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  status: "idle",
  error: null,
};

export const TodoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchAll.fulfilled, (state, action) => {
          state.todos = action.payload;
          state.status = "succeeded";
        })
        .addCase(create.fulfilled, (state, action) => {
          state.todos.push(action.payload);
          state.status = "succeeded";
        })
        .addCase(remove.fulfilled, (state, action) => {
          const deletedId = action.payload;
          state.todos = state.todos.filter((todo) => todo.id !== Number(deletedId));
          state.status = "succeeded";
        })
        .addCase(update.fulfilled, (state, action) => {
          const updatedData = action.payload;
          const index = state.todos.findIndex((todo) => todo.id === updatedData.id);
          if (index !== -1) {
            state.todos[index] = updatedData;
          }
          state.status = "succeeded";
        });
    },
  });

export default TodoSlice.reducer;
