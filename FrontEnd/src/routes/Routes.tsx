import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import Home from "../views/Home";
import Protected  from "../security/Protected.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: (
        <Protected>
          <Home/>
        </Protected>
    )
  },
]);
const Routes = () => {
  return <RouterProvider router={router} />;
};
export default Routes;