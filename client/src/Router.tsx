import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "./pages/NotFound"; 
import { Home } from "./pages/Home";
import { MyPages } from "./pages/MyPages";
import { Layout } from "./pages/Layout";
import { Admin } from "./pages/Admin";
import { Login } from "./pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,

    children: [
      {
        path: "/",
        element: <Home />,
        index: true,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
      path: "/mypages",
       element: <MyPages />
       },
       {
        path: "/admin",
         element: <Admin />
         },
    ],
  },
]);
