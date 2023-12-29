import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import todoReducer from "../features/todo/todo.slice";
import DatabaseReducer from "../features/database/database.slice";
import ModelsReducer from "../features/models/models.slice";
import SheetsReducer from "../features/sheets/sheets.slice";
import indexesReducer from "../features/indexes/indexes.slice";
import sessionsReducer from "../features/sessions/sessions.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
    user: userReducer,
    todo: todoReducer,
    database: DatabaseReducer,
    models: ModelsReducer,
    sheets: SheetsReducer,
    indexes: indexesReducer,
    sessions: sessionsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
