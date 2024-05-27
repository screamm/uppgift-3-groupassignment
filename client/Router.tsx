import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "./src/pages/NotFound";
import { Home } from "./src/pages/Home";
import { Cancellation } from "./src/pages/Cancellation";
import { Confirmation } from "./src/pages/Confirmation";
import { Shopping } from "./src/pages/Shopping";

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
        path: "/shopping",
        element: <Shopping />,
      },
      {
        path: "/confirmation",
        element: <Confirmation />,
      },
      {
        path: "/cancellation",
        element: <Cancellation />,
      },
    ],
  },
]);