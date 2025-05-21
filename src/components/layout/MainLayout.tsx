
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChartPie,
  Calendar,
  ArrowRight,
  User,
  LogIn,
  Target,
  BarChart2,
  LogOut,
  Calculator,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth();
  const isAuthenticated = !!user;
  
  // Get display name from user metadata if available
  const displayName = user?.user_metadata?.first_name 
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
    : user?.email?.split('@')[0];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
            <ChartPie className="h-6 w-6" />
            <span>WealthWise</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <>
                <Link to="/portfolio" className="text-sm font-medium hover:text-primary transition-colors">
                  Portfolio
                </Link>
                <Link to="/goals" className="text-sm font-medium hover:text-primary transition-colors">
                  Goals
                </Link>
                <Link to="/analytics" className="text-sm font-medium hover:text-primary transition-colors">
                  Analytics
                </Link>
                <Link to="/tools" className="text-sm font-medium hover:text-primary transition-colors">
                  <div className="flex items-center gap-1">
                    <Calculator className="h-4 w-4" />
                    Tools
                  </div>
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-muted-foreground mr-2">Hello,</span>
                  <span className="font-medium">{displayName}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">
                    <User className="mr-2 h-4 w-4" />
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WealthWise. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
