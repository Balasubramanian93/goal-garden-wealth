import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChartPie,
  User,
  LogIn,
  LogOut,
  Moon,
  Sun,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Toggle } from "@/components/ui/toggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ResponsiveNavigation from "./ResponsiveNavigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isAuthenticated = !!user;
  
  // Get display name from user metadata if available
  const displayName = user?.user_metadata?.first_name 
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
    : user?.email?.split('@')[0];

  // Get user initials for avatar fallback
  const userInitials = user?.user_metadata?.first_name && user?.user_metadata?.last_name
    ? `${user.user_metadata.first_name.charAt(0)}${user.user_metadata.last_name.charAt(0)}`
    : user?.email?.charAt(0).toUpperCase() || 'U';

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
    if (currentPath.startsWith("/profile")) return "Profile Settings";
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
          
          {/* Navigation */}
          <ResponsiveNavigation />

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

            {/* Auth Section - Desktop only */}
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={displayName} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>View Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
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
          </div>
        </div>
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
              {location.pathname.startsWith("/tools")) return "Financial Tools";
    if (currentPath.startsWith("/blogs")) return "Financial Blogs";
    if (currentPath.startsWith("/login")) return "Login";
    if (currentPath.startsWith("/register")) return "Register";
    if (currentPath.startsWith("/profile")) return "Profile Settings";
    return "WealthWise";
  };

  return (
    
      
        
          
            
              
            
            WealthWise
          
          
          
          
            
              
                
                  
                    
                      
                        
                          
                        
                        
                          {displayName}
                          {user?.email}
                        
                      
                    
                    
                      
                        
                        View Profile
                      
                    
                    
                      
                        
                        Log out
                      
                    
                  
                
              
                
                  
                    
                      
                        
                        Login
                      
                    
                    
                      
                        
                        Register
                      
                    
                  
                
              
            
          
        
      

      
        
          
            {getCurrentPageTitle()}
            
              {location.pathname === "/" && "Welcome to your financial dashboard"}
              {location.pathname.startsWith("/budget") && "Track and manage your monthly expenses"}
              {location.pathname.startsWith("/portfolio") && "Monitor your investment portfolio"}
              {location.pathname.startsWith("/goals") && "Set and achieve your financial goals"}
              {location.pathname.startsWith("/analytics") && "Analyze your financial performance"}
              {location.pathname.startsWith("/tools") && "Calculate and plan your finances"}
              {location.pathname.startsWith("/blogs") && "Stay informed with financial insights"}
              {location.pathname.startsWith("/profile") && "Manage your account settings"}
            
          
        
      

      
        {children}
      

      
        
          
            
              
                
                  
                
                WealthWise
              
              Your complete wealth management solution for a secure financial future.
            
            
              
                Resources
                
                  
                    Financial Blogs
                  
                
                
                  
                    Financial Tools
                  
                
                
                  
                    Investment Guides
                  
                
                
                  
                    Newsletter
                  
                
              
            
            
              
                Company
                
                  
                    About Us
                  
                
                
                  
                    Contact
                  
                
                
                  
                    Support
                  
                
                
                  
                    Privacy
                  
                
              
            
            
              
                Connect
                Stay updated with the latest financial tips and features.
                
                  
                  
                
              
            
          
          
            &copy; {new Date().getFullYear()} WealthWise. All rights reserved.
          
        
      
    
  );
};

export default MainLayout;
