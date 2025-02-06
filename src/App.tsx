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

function App() {
  // Check if this is a fresh app load
  const isFirstLoad = !sessionStorage.getItem("hasLoadedBefore");
  
  // If it's first load, set the flag in sessionStorage
  if (isFirstLoad) {
    sessionStorage.setItem("hasLoadedBefore", "true");
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <>
              <Toaster />
              <SonnerToaster />
              <Routes>
                {/* Show splash screen only on first load */}
                {isFirstLoad ? (
                  <Route path="*" element={<SplashScreen />} />
                ) : (
                  <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                    <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
                    <Route path="/item/:id" element={<ProtectedRoute><ItemDetail /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin-orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                  </>
                )}
              </Routes>
            </>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;