import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import "./App.css";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/Auth/AuthProvider";
import LoginPage from "./pages/Login";
import EncryptApp from "./pages/haifa";
import CartPage from "./pages/CartPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/Cart/CartProvider";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import CartInfo from "./pages/CartInfoPage";
import "./index.css";
import AI from "./pages/ai";
import DashboardLayoutBasic from "./dashboard/dashboard";
import MultiMediaDashboard from "./media/dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },

      {
        path: "/product/:id",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <CartInfo />,
          },
        ],
      },
      {
        path: "/haifa",
        element: <EncryptApp />,
      },
      {
        path: "ai",
        element: <AI />,
      },
      {
        path: "/cart",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <CartPage />,
          },
          {
            path: "checkout",
            element: <CheckoutPage />,
          },
          {
            path: "order-success",
            element: <OrderSuccessPage />,
          },
        ],
      },
    ],
  },
  {
    path: "dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <DashboardLayoutBasic />,
      },
    ],
  },
  {
    path: "multimedia",
    element: <MultiMediaDashboard />,
  },
]);

function App() {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
