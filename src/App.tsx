
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import ClientHome from "./pages/ClientHome";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentScreen from "./pages/PaymentScreen";
import NotFound from "./pages/NotFound";
import { SpaOrderProvider } from "./contexts/SpaOrderContext";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SpaOrderProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ClientHome />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route 
                path="/admin" 
                element={
                  <AdminLogin 
                    isAuthenticated={isAuthenticated} 
                    setIsAuthenticated={setIsAuthenticated} 
                  />
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  isAuthenticated ? (
                    <AdminDashboard />
                  ) : (
                    <AdminLogin 
                      isAuthenticated={isAuthenticated} 
                      setIsAuthenticated={setIsAuthenticated}
                    />
                  )
                } 
              />
              <Route 
                path="/admin/payment/:orderId" 
                element={
                  isAuthenticated ? (
                    <PaymentScreen />
                  ) : (
                    <AdminLogin 
                      isAuthenticated={isAuthenticated} 
                      setIsAuthenticated={setIsAuthenticated}
                    />
                  )
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SpaOrderProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
