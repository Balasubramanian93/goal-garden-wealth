
import { Link, useLocation } from "react-router-dom";
import { 
  ChartPie,
  Wallet,
  Target,
  BarChart3,
  Calculator,
  BookOpen,
  Receipt,
  User,
  LogOut,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
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
  ];

  const toolsItems = [
    { href: "/tools", label: "Financial Tools", icon: Calculator, requiresAuth: false },
    { href: "/blogs", label: "Financial Blogs", icon: BookOpen, requiresAuth: false },
  ];

  const filteredNavItems = navigationItems.filter(item => 
    !item.requiresAuth || isAuthenticated
  );

  const isActivePath = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link to="/" className="flex items-center gap-3 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <ChartPie className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>FinanceBloom</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {isAuthenticated && (
          <SidebarGroup>
            <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActivePath(item.href)}>
                        <Link to={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Tools & Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActivePath(item.href)}>
                      <Link to={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={displayName} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
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
          <div className="space-y-2">
            <SidebarMenuButton asChild>
              <Link to="/login">
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton asChild>
              <Link to="/register">
                <User className="h-4 w-4" />
                <span>Register</span>
              </Link>
            </SidebarMenuButton>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
