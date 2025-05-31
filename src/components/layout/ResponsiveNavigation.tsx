
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu,
  ChartPie,
  Wallet,
  Target,
  BarChart3,
  Calculator,
  BookOpen,
  User,
  LogIn,
  LogOut,
  Settings,
  Receipt
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ResponsiveNavigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isAuthenticated = !!user;
  
  // Get display name from user metadata if available
  const displayName = user?.user_metadata?.first_name 
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
    : user?.email?.split('@')[0];

  const userInitials = user?.user_metadata?.first_name && user?.user_metadata?.last_name
    ? `${user.user_metadata.first_name.charAt(0)}${user.user_metadata.last_name.charAt(0)}`
    : user?.email?.charAt(0).toUpperCase() || 'U';

  const navigationItems = [
    { href: "/", label: "Dashboard", icon: ChartPie, requiresAuth: true },
    { href: "/budget", label: "Budget", icon: Wallet, requiresAuth: true },
    { href: "/portfolio", label: "Portfolio", icon: BarChart3, requiresAuth: true },
    { href: "/goals", label: "Goals", icon: Target, requiresAuth: true },
    { href: "/analytics", label: "Analytics", icon: BarChart3, requiresAuth: true },
    { href: "/tax", label: "Tax Planning", icon: Receipt, requiresAuth: true },
    { href: "/tools", label: "Tools", icon: Calculator, requiresAuth: false },
    { href: "/blogs", label: "Blogs", icon: BookOpen, requiresAuth: false },
  ];

  const filteredNavItems = navigationItems.filter(item => 
    !item.requiresAuth || isAuthenticated
  );

  const isActivePath = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const NavItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      {filteredNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActivePath(item.href)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-1">
          <NavItems />
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-2">
        {/* Mobile Auth Section */}
        {isAuthenticated ? (
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
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
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

        {/* Mobile Menu */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 p-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-4">
              <NavItems onItemClick={() => setIsSheetOpen(false)} />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default ResponsiveNavigation;
