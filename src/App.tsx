
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Budget from "./pages/Budget";
import BudgetDetail from "./pages/BudgetDetail";
import Portfolio from "./pages/Portfolio";
import Goals from "./pages/Goals";
import GoalDetailsPage from "./pages/GoalDetailsPage";
import EditGoalPage from "./pages/EditGoalPage";
import Analytics from "./pages/Analytics";
import Tools from "./pages/Tools";
import Blogs from "./pages/Blogs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import Demo from "./pages/Demo";
import Tax from "./pages/Tax";

// Calculator pages
import CAGRCalculatorPage from "./pages/calculators/CAGRCalculatorPage";
import FDCalculatorPage from "./pages/calculators/FDCalculatorPage";
import FIRECalculatorPage from "./pages/calculators/FIRECalculatorPage";
import GoalSIPCalculatorPage from "./pages/calculators/GoalSIPCalculatorPage";
import HRACalculatorPage from "./pages/calculators/HRACalculatorPage";
import IRRCalculatorPage from "./pages/calculators/IRRCalculatorPage";
import MFCalculatorPage from "./pages/calculators/MFCalculatorPage";
import NSCCalculatorPage from "./pages/calculators/NSCCalculatorPage";
import RDCalculatorPage from "./pages/calculators/RDCalculatorPage";
import SIPCalculatorPage from "./pages/calculators/SIPCalculatorPage";
import SSYCalculatorPage from "./pages/calculators/SSYCalculatorPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/budget/:periodId" element={<BudgetDetail />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/goals/:goalId" element={<GoalDetailsPage />} />
              <Route path="/goals/:goalId/edit" element={<EditGoalPage />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/tax" element={<Tax />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/demo" element={<Demo />} />
              
              {/* Calculator Routes */}
              <Route path="/calculators/cagr" element={<CAGRCalculatorPage />} />
              <Route path="/calculators/fd" element={<FDCalculatorPage />} />
              <Route path="/calculators/fire" element={<FIRECalculatorPage />} />
              <Route path="/calculators/goal-sip" element={<GoalSIPCalculatorPage />} />
              <Route path="/calculators/hra" element={<HRACalculatorPage />} />
              <Route path="/calculators/irr" element={<IRRCalculatorPage />} />
              <Route path="/calculators/mf" element={<MFCalculatorPage />} />
              <Route path="/calculators/nsc" element={<NSCCalculatorPage />} />
              <Route path="/calculators/rd" element={<RDCalculatorPage />} />
              <Route path="/calculators/sip" element={<SIPCalculatorPage />} />
              <Route path="/calculators/ssy" element={<SSYCalculatorPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
