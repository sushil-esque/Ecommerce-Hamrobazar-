import AddProducts from "@/Pages/Admin/AddProducts";
import Categories from "@/Pages/Admin/Categories";
import EditProduct from "@/Pages/Admin/EditProduct";
import FileUpload from "@/Pages/Admin/FileUpload";
import ViewProducts from "@/Pages/Admin/ViewProducts";
import AdminPannel from "@/Pages/AdminPannel";
import Carts from "@/Pages/Carts";
import CategoryWiseProducts from "@/Pages/CategoryWiseProducts";
import SingleProduct from "@/Pages/SingleProduct";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import { RouterProvider } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Signup from "../Pages/SignIn";
import CategoryLayout from "@/Layouts/CategoryLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import CheckOut from "@/Pages/CheckOut";
import ProtectedRoute from "@/Components/ProtectedRoute";
import Layout from "@/Layouts/Layout";
import PaymentSucess from "@/Pages/PaymentSucess";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="category" element={<CategoryLayout />}>
          <Route path=":slug" element={<CategoryWiseProducts />} />
        </Route>

        <Route path="product/:id" element={<SingleProduct />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="cart" element={<Carts />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckOut />
            </ProtectedRoute>
          }
        />
        <Route
          path="paymentsuccess"
          element={
            <ProtectedRoute>
              <PaymentSucess />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/AdminDashboard"
        element={
          <ProtectedRoute isAdminRoute={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminPannel />} />
        <Route path="AddProducts" element={<AddProducts />} />
        <Route path="ViewProducts" element={<ViewProducts />} />
        <Route path="EditProduct/:id" element={<EditProduct />} />
        <Route path="FileUpload" element={<FileUpload />} />
        <Route path="Categories" element={<Categories />} />
      </Route>
    </>,
  ),
);
function Routes() {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default Routes;
