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
  JoinSession,
} from "./pages";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkIfUserLoggedIn } from "./store/Userauth-slice/index";
import { CollaborativeCartProvider } from "./components";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkIfUserLoggedIn());
  }, [dispatch]);
  if (isLoading) return <div>Loading...</div>;

  return (
    <CollaborativeCartProvider>
      <div className="flex flex-col overflow-hidden bg-white">
        <Routes>
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
          <Route
            path="/shop/session/join/:sessionId"
            element={
              <CheckAuth props={{ isAuthenticated, user }}>
                <JoinSession />
              </CheckAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
          <Route path="/unauth" element={<UnAuth />} />
        </Routes>
      </div>
    </CollaborativeCartProvider>
  );
}

export default App;
