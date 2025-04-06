import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import ClientHome from "@/pages/ClientHome";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import PaymentScreen from "@/pages/PaymentScreen";
import OrderConfirmation from "@/pages/OrderConfirmation";
import CashReport from "@/pages/CashReport";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientHome />,
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/payment/:orderId",
    element: <PaymentScreen />,
  },
  {
    path: "/order-confirmation",
    element: <OrderConfirmation />,
  },
  {
    path: "/admin/cash-report",
    element: <CashReport />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
