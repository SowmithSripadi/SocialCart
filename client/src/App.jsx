import { Route, Routes, Navigate } from "react-router-dom";
import { AdminLayout, UserAuthLayout, CheckAuth, CollaborativeCartProvider, ShoppingLayout } from "./components";
import { AdminOrders, Login, Register, AdminDashboard, AdminProducts, ShoppingAccount, ShoppingCheckout, Shoppinglisting, ShoppingHome, UnAuth, NotFound, JoinSession, AdminFeatures } from "./pages";
import SearchProducts from "./pages/shopping-view/search";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  if (isLoading) return <div>Loading...</div>;

  return (
    <CollaborativeCartProvider>
      <div className="flex flex-col overflow-hidden bg-white">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/shop/home" replace /> : <Navigate to="/auth/login" replace />} />

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
            <Route path="features" element={<AdminFeatures />} />   
          </Route>

          <Route
            path="/shop"
            element={
              <CheckAuth props={{ isAuthenticated, user }}>
                <ShoppingLayout />
              </CheckAuth>
            }
          >
            <Route path="home" element={<ShoppingHome />} />
            <Route path="listing" element={<Shoppinglisting />} />
            <Route path="checkout" element={<ShoppingCheckout />} />
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="paypal-return" element={<PaypalReturnPage />} />
            <Route path="payment-success" element={<PaymentSuccessPage />} />
            <Route path="search" element={<SearchProducts />} />
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
