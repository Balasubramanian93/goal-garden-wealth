import { useLocation } from "react-router-dom";
import { 
  ChartPie
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthenticated = !!user;

  const shouldShowBreadcrumb = () => {
    const currentPath = location.pathname;
    // Hide breadcrumb for dashboard, budget, and portfolio pages
    return !['/', '/budget', '/portfolio'].includes(currentPath) && isAuthenticated;
  };

  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/") return "Dashboard";
    if (currentPath.startsWith("/budget")) return "Budget Management";
    if (currentPath.startsWith("/portfolio")) return "Portfolio Overview";
    if (currentPath.startsWith("/goals")) return "Financial Goals";
    if (currentPath.startsWith("/analytics")) return "Analytics Dashboard";
    if (currentPath.startsWith("/tools")) return "Financial Tools";
    if (currentPath.startsWith("/blogs")) return "Financial Blogs";
    if (currentPath.startsWith("/login")) return "Login";
    if (currentPath.startsWith("/register")) return "Register";
    if (currentPath.startsWith("/profile")) return "Profile Settings";
    if (currentPath.startsWith("/tax")) return "Tax Planning";
    return "FinanceBloom";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-poppins">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            {/* Top Header with Trigger */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center gap-4 px-4">
                <SidebarTrigger />
                <div className="flex-1">
                  <h1 className="text-lg font-semibold">{getCurrentPageTitle()}</h1>
                </div>
              </div>
            </header>

            {/* Page Title Breadcrumb */}
            {shouldShowBreadcrumb() && (
              <div className="border-b bg-muted/30">
                <div className="px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    {location.pathname.startsWith("/goals") && "Set and achieve your financial goals"}
                    {location.pathname.startsWith("/analytics") && "Analyze your financial performance"}
                    {location.pathname.startsWith("/tools") && "Calculate and plan your finances"}
                    {location.pathname.startsWith("/blogs") && "Stay informed with financial insights"}
                    {location.pathname.startsWith("/profile") && "Manage your account settings"}
                    {location.pathname.startsWith("/tax") && "Plan and optimize your tax strategy"}
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
              <div className="px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <ChartPie className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">FinanceBloom</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your complete wealth management solution for a secure financial future.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Resources</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                          Financial Blogs
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                          Financial Tools
                        </a>
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
                          Privacy Policy
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
                  
                  <div className="border-t mt-8 pt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      &copy; {new Date().getFullYear()} FinanceBloom. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </footer>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
