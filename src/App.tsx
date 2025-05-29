
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Portfolio from "./pages/Portfolio";
import Budget from "./pages/Budget";
import BudgetDetail from "./pages/BudgetDetail";
import Goals from "./pages/Goals";
import GoalDetailsPage from "./pages/GoalDetailsPage";
import EditGoalPage from "./pages/EditGoalPage";
import Analytics from "./pages/Analytics";
import Tools from "./pages/Tools";
import Blogs from "./pages/Blogs";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Calculator Pages
import SIPCalculatorPage from "./pages/calculators/SIPCalculatorPage";
import FDCalculatorPage from "./pages/calculators/FDCalculatorPage";
import RDCalculatorPage from "./pages/calculators/RDCalculatorPage";
import MFCalculatorPage from "./pages/calculators/MFCalculatorPage";
import NSCCalculatorPage from "./pages/calculators/NSCCalculatorPage";
import SSYCalculatorPage from "./pages/calculators/SSYCalculatorPage";
import CAGRCalculatorPage from "./pages/calculators/CAGRCalculatorPage";
import HRACalculatorPage from "./pages/calculators/HRACalculatorPage";
import FIRECalculatorPage from "./pages/calculators/FIRECalculatorPage";
import IRRCalculatorPage from "./pages/calculators/IRRCalculatorPage";
import GoalSIPCalculatorPage from "./pages/calculators/GoalSIPCalculatorPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/demo" element={<Demo />} />
              
              {/* Protected Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/portfolio" element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              } />
              <Route path="/budget" element={
                <ProtectedRoute>
                  <Budget />
                </ProtectedRoute>
              } />
              <Route path="/budget/:period" element={
                <ProtectedRoute>
                  <BudgetDetail />
                </ProtectedRoute>
              } />
              <Route path="/goals" element={
                <ProtectedRoute>
                  <Goals />
                </ProtectedRoute>
              } />
              <Route path="/goals/:id" element={
                <ProtectedRoute>
                  <GoalDetailsPage />
                </ProtectedRoute>
              } />
              <Route path="/goals/:id/edit" element={
                <ProtectedRoute>
                  <EditGoalPage />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/tools" element={
                <ProtectedRoute>
                  <Tools />
                </ProtectedRoute>
              } />
              <Route path="/blogs" element={
                <ProtectedRoute>
                  <Blogs />
                </ProtectedRoute>
              } />
              
              {/* Calculator Routes */}
              <Route path="/tools/sip-calculator" element={
                <ProtectedRoute>
                  <SIPCalculatorPage />
                </ProtectedRoute>
              } />
              <Route path="/tools/fd-calculator" element={
                <ProtectedRoute>
                  <FDCalculatorPage />
                </ProtectedRoute>
              } />
              <Route path="/tools/rd-calculator" element={
                <ProtectedRoute>
                  <RDCalculatorPage />
                </ProtectedRoute>
              } />
              <Route path="/tools/mf-calculator" element={
                <ProtectedRoute>
                  <MFCalculatorPage />
                </ProtectedRoute>
              } />
              <Route path="/tools/nsc-calculator" element={
                <ProtectedRoute>
                  <NSCCalculatorPage />
                </ProtectedRoute>
              } />
              <Route path="/tools/ssy-calculator" element={
                <ProtectedRoute>
                  <SSYCalculatorPage />
                </ProtectedRoute>
              } />
              <Route path="/tools/cagr-calculator" element={
                <ProtectedRoute>
                  <CAGRCalculatorPage />
                </ProtectedRoute>
              } />
              <Route path="/tools/hra-calculator" element={
                <ProtectedRoute>
                  <HRACalculatorPage />
                </ProtectedRoute>
              } />
              <Route path="/tools/fire-calculator" element={
                <ProtectedRoute>
                  <FIRECalculatorPage />
                </ProtectedRoute>
              } />
              <Route path="/tools/irr-calculator" element={
                <ProtectedRoute>
                  <IRRCalculatorPage />
                </ProtectedRoute>
              } />
              <Route path="/tools/goal-sip-calculator" element={
                <ProtectedRoute>
                  <GoalSIPCalculatorPage />
                </ProtectedRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
