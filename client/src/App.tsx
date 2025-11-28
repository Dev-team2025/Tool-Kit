import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import SalesMarketing from "./pages/SalesMarketing";
import HumanResources from "./pages/HumanResources";
import LearningDevelopment from "./pages/LearningDevelopment";
import Technical from "./pages/Technical";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

// NEW Auth Pages
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* ---------- PUBLIC ROUTES ----------- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-code" element={<VerifyCodePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ---------- PROTECTED TOOLKIT ROUTES ----------- */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="sales-marketing" element={<SalesMarketing />} />
            <Route path="hr" element={<HumanResources />} />
            <Route path="learning" element={<LearningDevelopment />} />
            <Route path="technical" element={<Technical />} />
          </Route>

          {/* ---------- 404 PAGE ----------- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
