
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChartPie,
  User,
  LogIn,
  Target,
  BarChart2,
  LogOut,
  Calculator,
  Newspaper,
  Moon,
  Sun, 
  Home, 
  Wallet,
  TrendingUp,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
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

  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/") return "Home";
    if (currentPath.startsWith("/budget")) return "Budget Management";
    if (currentPath.startsWith("/portfolio")) return "Portfolio Overview";
    if (currentPath.startsWith("/goals")) return "Financial Goals";
    if (currentPath.startsWith("/analytics")) return "Analytics Dashboard";
    if (currentPath.startsWith("/tools")) return "Financial Tools";
    if (currentPath.startsWith("/blogs")) return "Financial Blogs";
    if (currentPath.startsWith("/login")) return "Login";
    if (currentPath.startsWith("/register")) return "Register";
    return "WealthWise";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <ChartPie className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline-block">WealthWise</span>
          </Link>
          
          {/* Desktop Navigation - Grouped Menubar */}
          <div className="hidden md:flex items-center">
            <Menubar className="border-none bg-transparent">
              {/* Home - Always visible */}
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Link
                    to="/"
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                      isActive("/")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>

              {isAuthenticated ? (
                <>
                  {/* Financial Management */}
                  <MenubarMenu>
                    <MenubarTrigger className="flex items-center gap-1 px-3 py-2 text-sm font-medium">
                      <Wallet className="h-4 w-4" />
                      Finance
                      <ChevronDown className="h-3 w-3" />
                    </MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem asChild>
                        <Link to="/budget" className="flex items-center gap-2 w-full">
                          <Wallet className="h-4 w-4" />
                          Budget
                        </Link>
                      </MenubarItem>
                      <MenubarItem asChild>
                        <Link to="/portfolio" className="flex items-center gap-2 w-full">
                          <TrendingUp className="h-4 w-4" />
                          Portfolio
                        </Link>
                      </MenubarItem>
                      <MenubarItem asChild>
                        <Link to="/goals" className="flex items-center gap-2 w-full">
                          <Target className="h-4 w-4" />
                          Goals
                        </Link>
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>

                  {/* Analytics & Tools */}
                  <MenubarMenu>
                    <MenubarTrigger className="flex items-center gap-1 px-3 py-2 text-sm font-medium">
                      <BarChart2 className="h-4 w-4" />
                      Analytics
                      <ChevronDown className="h-3 w-3" />
                    </MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem asChild>
                        <Link to="/analytics" className="flex items-center gap-2 w-full">
                          <BarChart2 className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem asChild>
                        <Link to="/tools" className="flex items-center gap-2 w-full">
                          <Calculator className="h-4 w-4" />
                          Calculators
                        </Link>
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </>
              ) : (
                <>
                  {/* Public Resources */}
                  <MenubarMenu>
                    <MenubarTrigger className="flex items-center gap-1 px-3 py-2 text-sm font-medium">
                      <Calculator className="h-4 w-4" />
                      Resources
                      <ChevronDown className="h-3 w-3" />
                    </MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem asChild>
                        <Link to="/blogs" className="flex items-center gap-2 w-full">
                          <Newspaper className="h-4 w-4" />
                          Financial Blogs
                        </Link>
                      </MenubarItem>
                      <MenubarItem asChild>
                        <Link to="/tools" className="flex items-center gap-2 w-full">
                          <Calculator className="h-4 w-4" />
                          Calculators
                        </Link>
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </>
              )}
            </Menubar>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Toggle 
              pressed={theme === 'dark'}
              onPressedChange={toggleTheme}
              aria-label="Toggle theme"
              size="sm"
              className="hidden sm:flex"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Toggle>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Welcome back,</span>
                  <span className="font-medium ml-1">{displayName}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
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
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <nav className="container py-4 space-y-2">
              {/* Home */}
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive("/")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>

              {isAuthenticated ? (
                <>
                  {/* Financial Management Section */}
                  <div className="pt-2">
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Financial Management
                    </div>
                    <Link
                      to="/budget"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive("/budget")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <Wallet className="h-4 w-4" />
                      Budget
                    </Link>
                    <Link
                      to="/portfolio"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive("/portfolio")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <TrendingUp className="h-4 w-4" />
                      Portfolio
                    </Link>
                    <Link
                      to="/goals"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive("/goals")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <Target className="h-4 w-4" />
                      Goals
                    </Link>
                  </div>

                  {/* Analytics & Tools Section */}
                  <div className="pt-2">
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Analytics & Tools
                    </div>
                    <Link
                      to="/analytics"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive("/analytics")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <BarChart2 className="h-4 w-4" />
                      Analytics
                    </Link>
                    <Link
                      to="/tools"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive("/tools")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <Calculator className="h-4 w-4" />
                      Tools
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {/* Public Resources Section */}
                  <div className="pt-2">
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Resources
                    </div>
                    <Link
                      to="/blogs"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive("/blogs")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <Newspaper className="h-4 w-4" />
                      Financial Blogs
                    </Link>
                    <Link
                      to="/tools"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive("/tools")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <Calculator className="h-4 w-4" />
                      Calculators
                    </Link>
                  </div>
                </>
              )}
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <Toggle 
                    pressed={theme === 'dark'}
                    onPressedChange={toggleTheme}
                    aria-label="Toggle theme"
                    size="sm"
                  >
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Toggle>
                </div>
                
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm">
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
          </div>
        )}
      </header>

      {/* Page Title Breadcrumb */}
      {isAuthenticated && (
        <div className="border-b bg-muted/30">
          <div className="container py-3">
            <h1 className="text-lg font-semibold text-foreground">{getCurrentPageTitle()}</h1>
            <p className="text-sm text-muted-foreground">
              {location.pathname === "/" && "Welcome to your financial dashboard"}
              {location.pathname.startsWith("/budget") && "Track and manage your monthly expenses"}
              {location.pathname.startsWith("/portfolio") && "Monitor your investment portfolio"}
              {location.pathname.startsWith("/goals") && "Set and achieve your financial goals"}
              {location.pathname.startsWith("/analytics") && "Analyze your financial performance"}
              {location.pathname.startsWith("/tools") && "Calculate and plan your finances"}
              {location.pathname.startsWith("/blogs") && "Stay informed with financial insights"}
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Enhanced Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <ChartPie className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">WealthWise</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Your complete wealth management solution for a secure financial future.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/blogs" className="text-muted-foreground hover:text-primary transition-colors">
                    Financial Blogs
                  </Link>
                </li>
                <li>
                  <Link to="/tools" className="text-muted-foreground hover:text-primary transition-colors">
                    Financial Tools
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Investment Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Stay updated with the latest financial tips and features.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} WealthWise. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
