import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  BookOpen,
  FileEdit,
  Menu as MenuIcon,
  Settings,
  LogOut,
  BarChart,
  TrendingUp,
} from "lucide-react";

// Admin pages
import AdminOverview from "./Overview";
import AdminPages from "./Pages";
import AdminEvents from "./Events";
import AdminPrograms from "./Programs";
import AdminProgramDetail from "./programs/[id]";
import AdminPosts from "./Posts";
import AdminKPIs from "./KPIs";
import AdminSettings from "./Settings";
import AdminSubmissions from "./Submissions";

const AdminDashboard = () => {
  const { user, role, loading, isAuthenticated } = useAuthGuard(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // User is authenticated but has no role assigned
  if (isAuthenticated && !role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Role Assigned</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your account doesn't have an assigned role yet. Please contact a
              SuperAdmin to assign you a role.
            </p>
            <p className="text-sm">
              <strong>Your email:</strong> {user?.email}
            </p>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not authenticated, the useAuthGuard hook will redirect
  // This is just a safety check
  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin", roles: ["SUPERADMIN", "EDITOR", "VIEWER"] },
    { icon: FileText, label: "Pages", path: "/admin/pages", roles: ["SUPERADMIN", "EDITOR"] },
    { icon: Calendar, label: "Events", path: "/admin/events", roles: ["SUPERADMIN", "EDITOR"] },
    { icon: BookOpen, label: "Programs", path: "/admin/programs", roles: ["SUPERADMIN", "EDITOR"] },
    { icon: FileEdit, label: "Blog Posts", path: "/admin/posts", roles: ["SUPERADMIN", "EDITOR"] },
    { icon: TrendingUp, label: "KPIs", path: "/admin/kpis", roles: ["SUPERADMIN", "EDITOR"] },
    { icon: BarChart, label: "Submissions", path: "/admin/submissions", roles: ["SUPERADMIN", "EDITOR"] },
    { icon: Settings, label: "Settings", path: "/admin/settings", roles: ["SUPERADMIN"] },
  ];

  const accessibleItems = menuItems.filter((item) =>
    role ? item.roles.includes(role) : false
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } border-r bg-muted/50 transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && <h2 className="font-bold text-lg">YDA Admin</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-2">
          {accessibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start mb-1 ${
                    !sidebarOpen && "justify-center"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${sidebarOpen && "mr-2"}`} />
                  {sidebarOpen && item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full justify-start ${!sidebarOpen && "justify-center"}`}
          >
            <LogOut className={`h-5 w-5 ${sidebarOpen && "mr-2"}`} />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Logged in as: <span className="font-medium">{user?.email}</span>
                {role && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {role}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="container py-6">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="pages" element={<AdminPages />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="programs" element={<AdminPrograms />} />
            <Route path="programs/:id" element={<AdminProgramDetail />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="kpis" element={<AdminKPIs />} />
            <Route path="submissions" element={<AdminSubmissions />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
