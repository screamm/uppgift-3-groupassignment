import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "./pages/NotFound";
import { Home } from "./pages/Home";
import { MyPages } from "./pages/MyPages";
import { Layout } from "./pages/Layout";
import { Admin } from "./pages/Admin";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/login";
import { Register } from "./pages/Register";
import { Checkout } from "./pages/Checkout"; // Importera Checkout-komponenten
import { Confirmation } from "./pages/Confirmation";

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
        element: <MyPages />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/confirmation/:sessionId",
        element: <Confirmation />,
      },
    ],
  },
]);
