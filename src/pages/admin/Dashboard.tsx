import { Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";

// Admin pages
import AdminOverview from "./Overview";
import AdminPages from "./Pages";
import PageForm from "./pages/PageForm";
import AdminEvents from "./Events";
import EventForm from "./events/EventForm";
import AdminPrograms from "./Programs";
import AdminProgramDetail from "./programs/[id]";
import AdminPosts from "./Posts";
import AdminKPIs from "./KPIs";
import AdminSettings from "./Settings";
import AdminSubmissions from "./Submissions";

const AdminDashboard = () => {
  const { user, role, loading, isAuthenticated } = useAuthGuard(true);

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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role={role} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Logged in as: <span className="font-medium text-foreground">{user?.email}</span>
                  {role && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                      {role}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6">
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="pages" element={<AdminPages />} />
              <Route path="pages/new" element={<PageForm />} />
              <Route path="pages/:id" element={<PageForm />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="events/new" element={<EventForm />} />
              <Route path="events/:id" element={<EventForm eventId="id" />} />
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
    </SidebarProvider>
  );
};

export default AdminDashboard;
