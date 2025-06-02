
import React from "react"
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
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ChartPie,
  Home,
  Calculator,
  Target,
  Wallet,
  TrendingUp,
  BookOpen,
  Settings,
  FileText,
  User,
  Briefcase,
  ChevronDown,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "../ModeToggle"

export function AppSidebar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      // Handle logout - you may need to implement this in your AuthContext
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const items = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Budget",
      url: "/budget",
      icon: Wallet,
    },
    {
      title: "Investments",
      url: "/investments",
      icon: Briefcase,
    },
    {
      title: "Portfolio",
      url: "/portfolio",
      icon: ChartPie,
    },
    {
      title: "Goals",
      url: "/goals",
      icon: Target,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: TrendingUp,
    },
    {
      title: "Tools",
      url: "/tools",
      icon: Calculator,
    },
    {
      title: "Tax",
      url: "/tax",
      icon: FileText,
    },
    {
      title: "Blogs",
      url: "/blogs",
      icon: BookOpen,
    },
  ]

  const settingsItems = [
    {
      title: "Profile",
      url: "/profile",
      icon: User,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-2">
          <Link to={"/profile"} className="gap-2 flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">{user?.email}</span>
              <span className="text-sm text-muted-foreground">
                User Profile
              </span>
            </div>
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url || (item.url !== '/' && location.pathname.startsWith(item.url))}>
                    <Link to={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-2 flex items-center justify-between">
                Settings
                <ChevronDown className="h-4 w-4" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {settingsItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                        <Link to={item.url}>
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <div className="p-4">
          <div className="flex items-center justify-between rounded-md border p-4">
            <Label htmlFor="theme">Theme</Label>
            <ModeToggle />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
