import { createAsyncApiAction } from "../../util/asyncApi.utill";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface FetchUserDataParams {
    url: string;
    data: Record<string, any>; // Adjust the type of data as per your requirements
}

export const fetchAll = createAsyncApiAction("sessions", "fetchAll", "get");
export const fetchMessesgesBySession = createAsyncApiAction("sessions", "fetchMessesgesBySession", "get");
export const create = createAsyncApiAction("sessions", "create", "post");
export const remove = createAsyncApiAction("sessions", "delete", "delete");
export const update = createAsyncApiAction("sessions", "update", "put");
export const fetchSessionById = createAsyncApiAction("sessions", "fetchSessionById", "get");

export const fetchSessionMessageById = createAsyncApiAction("sessionMessages", "fetchSessionMessageById", "get");

export const createSessionMessage = createAsyncThunk(
  'sessionMessages/createSessionMessage',
  async ({ url, data }: FetchUserDataParams, thunkAPI) => {
    try {
      const response = await fetch(url, data);

      console.log("res", response);

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const reader = response.body?.getReader();

      console.log(reader, "reader");

      const decoder = new TextDecoder('utf-8');

      let responseData = ''; // Accumulate chunks into a string

      while (true) {
        if(reader?.read()) {
          const { done, value } = await reader?.read()

          if (done) {
            break;
          }
  
          responseData += decoder.decode(value || new Uint8Array(), { stream: true });

          // Check if the accumulated data includes '<ssi>'
          if (responseData.includes('<ssi>')) {
            break;
          }
        }
      }
      console.log(responseData, "responseData");

      return responseData;

    } catch (error: any) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }
);

export const removeSessionMessage = createAsyncApiAction("sessionMessages", "removeSessionMessage", "delete");
export const updateSessionMessage = createAsyncApiAction("sessionMessages", "updateSessionMessage", "put");