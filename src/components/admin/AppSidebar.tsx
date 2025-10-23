import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  BookOpen,
  FileEdit,
  Settings,
  LogOut,
  BarChart,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  role?: string | null;
}

export function AppSidebar({ role }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-secondary text-secondary-foreground font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">YDA Admin</h2>
              <p className="text-xs text-muted-foreground">Content Management</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground mx-auto">
            <LayoutDashboard className="h-4 w-4" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accessibleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <NavLink to={item.path} end className={getNavClass}>
                        <Icon className="h-4 w-4" />
                        {!collapsed && <span>{item.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
