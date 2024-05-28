import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "./pages/NotFound"; // Import the NotFound component
import { Home } from "./pages/Home"; // Import the NotFound component
// import { Login } from "./pages/Login"; // Import the NotFound component
import React from "react";

export const router = createBrowserRouter([
  {
    path: "/",

    errorElement: <NotFound />,

    children: [
      {
        path: "/",
        element: <Home />,
        index: true,
      },
      {
        path: "/Login",
        // element: <Login />,
      },
      //   {
      //     path: "/confirmation",
      //     element: <Confirmation />,
      //   },
      //   {
      //     path: "/cancellation",
      //     element: <Cancellation />,
      //   },
    ],
  },
]);
