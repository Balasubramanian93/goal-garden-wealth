
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChartPie,
  User,
  LogIn,
  LogOut,
  BarChart2,
  Home, 
  Wallet,
  TrendingUp,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ResponsiveNavigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = !!user;
  
  // Get display name from user metadata if available
  const displayName = user?.user_metadata?.first_name 
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
    : user?.email?.split('@')[0];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavLink = ({ to, children, className, onClick }: {
    to: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }) => (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive(to)
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-accent",
        className
      )}
    >
      {children}
    </Link>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-1">
        <NavLink to="/">
          <Home className="h-4 w-4" />
          Dashboard
        </NavLink>

        {isAuthenticated && (
          <>
            <NavLink to="/budget">
              <Wallet className="h-4 w-4" />
              Budget
            </NavLink>
            <NavLink to="/portfolio">
              <TrendingUp className="h-4 w-4" />
              Portfolio
            </NavLink>
          </>
        )}
      </div>

      {/* Tablet Navigation */}
      <div className="hidden md:flex lg:hidden items-center space-x-1">
        <NavLink to="/">
          <Home className="h-4 w-4" />
        </NavLink>

        {isAuthenticated && (
          <>
            <NavLink to="/budget">
              <Wallet className="h-4 w-4" />
            </NavLink>
            <NavLink to="/portfolio">
              <TrendingUp className="h-4 w-4" />
            </NavLink>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <ChartPie className="h-5 w-5 text-primary-foreground" />
                </div>
                WealthWise
              </SheetTitle>
            </SheetHeader>
            
            <nav className="mt-6 space-y-2">
              <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="w-full justify-start">
                <Home className="h-4 w-4" />
                Dashboard
              </NavLink>

              {isAuthenticated && (
                <div className="pt-2">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Financial Management
                  </div>
                  <NavLink to="/budget" onClick={() => setIsMobileMenuOpen(false)} className="w-full justify-start">
                    <Wallet className="h-4 w-4" />
                    Budget
                  </NavLink>
                  <NavLink to="/portfolio" onClick={() => setIsMobileMenuOpen(false)} className="w-full justify-start">
                    <TrendingUp className="h-4 w-4" />
                    Portfolio
                  </NavLink>
                </div>
              )}
              
              <div className="pt-4 border-t space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm">
                      <span className="text-muted-foreground">Logged in as </span>
                      <span className="font-medium">{displayName}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </Link>
                    </Button>
                    <Button className="w-full justify-start" asChild>
                      <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Register
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default ResponsiveNavigation;
