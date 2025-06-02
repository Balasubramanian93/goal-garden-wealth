import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Index from "./pages/Index";
import Budget from "./pages/Budget";
import Analytics from "./pages/Analytics";
import Goals from "./pages/Goals";
import Tools from "./pages/Tools";
import Tax from "./pages/Tax";
import Blogs from "./pages/Blogs";
import SettingsPage from "./pages/SettingsPage";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Portfolio from "./pages/Portfolio";
import BudgetDetail from "./pages/BudgetDetail";
import { QueryClient } from "@tanstack/react-query";
import Investments from "./pages/Investments";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClient>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
            <Route path="/budget/:budgetId" element={<ProtectedRoute><BudgetDetail /></ProtectedRoute>} />
            <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
            <Route path="/tax" element={<ProtectedRoute><Tax /></ProtectedRoute>} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
          </Routes>
        </QueryClient>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
