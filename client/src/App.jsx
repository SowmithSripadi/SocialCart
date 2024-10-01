import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import {
  AdminLayout,
  UserAuthLayout,
  UserShoppingLayout,
  CheckAuth,
} from "./components";
import {
  AdminOrders,
  Login,
  Register,
  AdminDashboard,
  AdminProducts,
  ShoppingAccount,
  ShoppingCheckout,
  Shoppinglisting,
  ShoppingHome,
  UnAuth,
  NotFound,
} from "./pages";
import { useSelector } from "react-redux";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/auth"
          element={
            <CheckAuth props={{ isAuthenticated, user }}>
              <UserAuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth props={{ isAuthenticated, user }}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth props={{ isAuthenticated, user }}>
              <UserShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<Shoppinglisting />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/unauth" element={<UnAuth />} />
      </>
    )
  );
  return (
    <>
      <div className="flex flex-col overflow-hidden bg-white">
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
