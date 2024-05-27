import { createBrowserRouter } from "react-router-dom";
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
    //   {
    //     path: "/shopping",
    //     element: <Shopping />,
    //   },
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