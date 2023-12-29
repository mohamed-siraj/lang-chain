import { createAsyncThunk } from "@reduxjs/toolkit";
import { createAsyncApiAction } from "../../util/asyncApi.utill";

export const fetchAll = createAsyncApiAction("indexes", "fetchAll", "get");
export const checkConnection = createAsyncApiAction("indexes", "checkConnection", "get");
export const fetchByName = createAsyncApiAction("indexes", "fetchByName", "get");
export const createObjFromLink = createAsyncApiAction("indexes", "createObjFromLink", "post");
export const remove = createAsyncApiAction("indexes", "delete", "delete");
export const update = createAsyncApiAction("indexes", "update", "put");

export const createPdfLink = createAsyncThunk(
    'indexes/createPdfLink',
    async ({ formData }: any, thunkAPI) => {
        console.log(formData, "rrrrr");
        
      try {

        const token = localStorage.getItem("@accessToken") || localStorage.getItem("@refreshToken");
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/indexes/multifile/`, {
            method: 'POST',
            body: formData,
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Assuming server returns JSON
        })
  
        // if (!response.ok) {
        //   throw new Error(`Failed to fetch data. Status: ${response.status}`);
        // }
  
        return response;
  
      } catch (error: any) {
        throw new Error(`Error fetching data: ${error.message}`);
      }
    }
  );
  