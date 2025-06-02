
import React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "../ModeToggle"
import { ScrollArea } from "@/components/ui/scroll-area"

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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-64 border-r">
        <SheetHeader className="space-y-2.5">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navigate through the app.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
          <div className="py-4">
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
            <div className="space-y-1">
              {items.map((item) => (
                <Button
                  key={item.title}
                  variant="ghost"
                  className={`w-full justify-start ${location.pathname === item.url ? "bg-secondary" : ""
                    }`}
                  asChild
                >
                  <Link to={item.url} className="w-full">
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
            <Accordion type="single" collapsible className="w-full border-none">
              <AccordionItem value="settings">
                <AccordionTrigger>Settings</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1">
                    {settingsItems.map((item) => (
                      <Button
                        key={item.title}
                        variant="ghost"
                        className={`w-full justify-start ${location.pathname === item.url ? "bg-secondary" : ""
                          }`}
                        asChild
                      >
                        <Link to={item.url} className="w-full">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="border-t py-4">
              <div className="space-y-2 px-4">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <Label htmlFor="theme">Theme</Label>
                  <ModeToggle />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
