import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import { RouterProvider } from "react-router-dom";
import Layout from "../Components/Layout";
import Signup from "../Pages/SignIn";
import SingleProduct from "@/Pages/SingleProduct";
import Carts from "@/Pages/Carts";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />} >
      <Route index element={<Home />} />
      <Route path="home" element={<Home />} />
      <Route path="product/:id" element={<SingleProduct/>} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="cart" element={<Carts />} />
      </Route>
    </>
  )
);
function Routes() {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default Routes;
