
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Portfolio from "./pages/Portfolio";
import Goals from "./pages/Goals";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Demo from "./pages/Demo";
import Tools from "./pages/Tools";
import EditGoalPage from "./pages/EditGoalPage";
import FDCalculatorPage from "./pages/calculators/FDCalculatorPage";
import CAGRCalculatorPage from "./pages/calculators/CAGRCalculatorPage";
import RDCalculatorPage from "./pages/calculators/RDCalculatorPage";
import SIPCalculatorPage from "./pages/calculators/SIPCalculatorPage";
import GoalSIPCalculatorPage from "./pages/calculators/GoalSIPCalculatorPage";
import FIRECalculatorPage from "./pages/calculators/FIRECalculatorPage";
import NSCCalculatorPage from "./pages/calculators/NSCCalculatorPage";
import HRACalculatorPage from "./pages/calculators/HRACalculatorPage";
import SSYCalculatorPage from "./pages/calculators/SSYCalculatorPage";
import MFCalculatorPage from "./pages/calculators/MFCalculatorPage";
import IRRCalculatorPage from "./pages/calculators/IRRCalculatorPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tools" element={<Tools />} />
            
            {/* Calculator Routes - All accessible without login */}
            <Route path="/calculators/fd" element={<FDCalculatorPage />} />
            <Route path="/calculators/cagr" element={<CAGRCalculatorPage />} />
            <Route path="/calculators/rd" element={<RDCalculatorPage />} />
            <Route path="/calculators/sip" element={<SIPCalculatorPage />} />
            <Route path="/calculators/goal-sip" element={<GoalSIPCalculatorPage />} />
            <Route path="/calculators/fire" element={<FIRECalculatorPage />} />
            <Route path="/calculators/nsc" element={<NSCCalculatorPage />} />
            <Route path="/calculators/hra" element={<HRACalculatorPage />} />
            <Route path="/calculators/ssy" element={<SSYCalculatorPage />} />
            <Route path="/calculators/mf" element={<MFCalculatorPage />} />
            <Route path="/calculators/irr" element={<IRRCalculatorPage />} />
            
            {/* Protected Routes - require authentication */}
            <Route 
              path="/portfolio" 
              element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/goals" 
              element={
                <ProtectedRoute>
                  <Goals />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/goals/edit/:goalId" 
              element={
                <ProtectedRoute>
                  <EditGoalPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/demo" 
              element={
                <ProtectedRoute>
                  <Demo />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
