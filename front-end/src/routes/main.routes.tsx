import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";


import { Protected } from "../middleware/Protected";
const Users = lazy(() => import("../pages/Users"));
const UserDetails = lazy(() => import("../pages/UserDetails"));
const Home = lazy(() => import("../pages/Home"));
const Contact = lazy(() => import("../pages/Contact"));
const About = lazy(() => import("../pages/About"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const LandingPage = lazy(() => import("../pages/Landing"));
const Login = lazy(() => import("../pages/Login"));
const SignUp = lazy(() => import("../pages/SignUp"));
const NewChat = lazy(() => import("../pages/Chat/NewChat"));

import ChatDetails from "../pages/Chat/ChatDetails";
import PublicLayout from "../layouts/PublicLayout";
import ChatLayout from "../layouts/ChatLayout";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "contact",
        element: <Contact />,
        children: [
          {
            path: "number",
            element: <h1>Contact me on this no: 09234232342342342344</h1>,
          },
          {
            path: "email",
            element: <h1>Contact me on this account: contactme@gmail.com</h1>,
          },
        ],
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
  {
    path: "/signin",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/chat", // Define a new main path for PrivateLayout
    element: <ChatLayout />,
    children: [
      {
        path: "/chat/new",
        element: <NewChat />,
      },
      {
        path: "/chat/:id",
        element: <ChatDetails />,
      },
      {
        path: "users/:id",
        element: (
          <Protected>
            <UserDetails />
          </Protected>
        ),
      },
    ],
  },
]);
