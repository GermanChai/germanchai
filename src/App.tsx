import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import ItemDetail from "./pages/ItemDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./components/AdminOrders";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const queryClient = new QueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <>
                <Toaster />
                <SonnerToaster />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/" element={<Navigate to="/menu" replace />} />
                  <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
                  <Route path="/item/:id" element={<ProtectedRoute><ItemDetail /></ProtectedRoute>} />
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin-orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;