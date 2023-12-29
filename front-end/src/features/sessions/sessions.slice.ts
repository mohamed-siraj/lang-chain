/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { fetchAll, fetchMessesgesBySession, fetchSessionById, create, remove, update, createSessionMessage, removeSessionMessage, updateSessionMessage } from "./sessions.service";

interface ModelState {
  sessions: any[];
  session: any;
  currentSession: any;
  messages: any[];
  message: any;
  msgBySession: any[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  loading: boolean;
}

const initialState: ModelState = {
  sessions: [],
  session: {},
  currentSession: {},
  messages: [],
  message: {},
  msgBySession: [],
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
            state.sessions = action.payload;
            state.status = "succeeded";
        })
        .addCase(fetchAll.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
        })
        // Fetch by Id
        .addCase(fetchSessionById.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(fetchSessionById.fulfilled, (state, action) => {
            state.session = action.payload;
            state.status = "succeeded";
        })
        .addCase(fetchSessionById.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
        })
        // fetch Messesges By Session
        .addCase(fetchMessesgesBySession.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(fetchMessesgesBySession.fulfilled, (state, action) => {
            state.msgBySession = action.payload;
            state.status = "succeeded";
        })
        .addCase(fetchMessesgesBySession.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
        })
        // Create
        .addCase(create.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(create.fulfilled, (state, action) => {
            state.currentSession = action.payload;
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
            state.sessions = state.sessions.filter((session) => session.id !== Number(deletedId));
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
            const index = state.sessions.findIndex((session) => session.id === updatedData.id);
            if (index !== -1) {
              state.sessions[index] = updatedData;
            }
            state.status = "succeeded";
          })
        .addCase(update.rejected, (state, action) => {
            state.loading = false;
        })
        // create Session Message
        .addCase(createSessionMessage.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(createSessionMessage.fulfilled, (state, action) => {
            console.log("createSessionMessage.fulfilled payload:", action.payload);
        
            state.msgBySession.push(action.payload);
            console.log(action.payload, "action.payload");
        
            state.status = "succeeded";
        })
        .addCase(createSessionMessage.rejected, (state, action) => {
            state.loading = false;
            state.status = "failed";
        })
        // remove Session Message
        .addCase(removeSessionMessage.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(removeSessionMessage.fulfilled, (state, action) => {
            const deletedId = action.payload;
            state.sessions = state.sessions.filter((session) => session.id !== Number(deletedId));
            state.status = "succeeded";
        })
        .addCase(removeSessionMessage.rejected, (state, action) => {
            state.loading = false;
        })

        // update Session Message
        .addCase(updateSessionMessage.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(updateSessionMessage.fulfilled, (state, action) => {
            const deletedId = action.payload;
            state.messages = state.messages.filter((message) => message.id !== Number(deletedId));
            state.status = "succeeded";
        })
        .addCase(updateSessionMessage.rejected, (state, action) => {
            state.loading = false;
        })
    },
  });

export default ModelSlice.reducer;
