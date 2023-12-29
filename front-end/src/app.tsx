import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { ChakraProvider } from '@chakra-ui/react'
import { router } from "./routes/main.routes";
import AppProvider from './context/AppProvider';
import { Toaster } from 'react-hot-toast';
import "./styles/main.scss";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <AppProvider>
        <Provider store={store}>
          <ChakraProvider theme={theme}>
            <RouterProvider router={router} />
            <Toaster position="bottom-center" reverseOrder={false}/>
          </ChakraProvider>
        </Provider>
      </AppProvider>
  </React.StrictMode>
);
