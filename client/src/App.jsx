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
  UserShoppingHeader,
} from "./components";
import {
  AdminOrders,
  Login,
  Register,
  AdminDashboard,
  AdminProducts,
} from "./pages/index.js";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/auth" element={<UserAuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
        <Route path="/shop" element={<UserShoppingLayout />}>
          <Route path="dashboard" element={<UserShoppingHeader />} />
        </Route>
      </>
    )
  );
  return (
    <>
      <div className="flex flex-col overflow-hidden bg-white">
        <h1>Header</h1>
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
