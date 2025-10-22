import { useEffect, useState } from "react";
import { useNavigate, Routes, Route, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  LayoutGrid,
  TrendingUp,
  Calendar,
  BookOpen,
  FileEdit,
  Users,
  Menu as MenuIcon,
  Settings,
  Layers,
  LogOut,
  BarChart,
} from "lucide-react";

// Admin pages
import AdminOverview from "./Overview";
import AdminPages from "./Pages";
import AdminEvents from "./Events";
import AdminPrograms from "./Programs";
import AdminPosts from "./Posts";
import AdminKPIs from "./KPIs";
import AdminSettings from "./Settings";
import AdminSubmissions from "./Submissions";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/admin/login");
      return;
    }

    setUser(session.user);

    // Get user role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    setRole(roleData?.role || null);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
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
