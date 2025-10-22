import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, BookOpen, Users, BarChart } from "lucide-react";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    events: 0,
    programs: 0,
    posts: 0,
    submissions: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [events, programs, posts, submissions] = await Promise.all([
      supabase.from("event").select("*", { count: "exact", head: true }),
      supabase.from("program").select("*", { count: "exact", head: true }),
      supabase.from("post").select("*", { count: "exact", head: true }),
      supabase.from("submission").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      events: events.count || 0,
      programs: programs.count || 0,
      posts: posts.count || 0,
      submissions: submissions.count || 0,
    });
  };

  const statCards = [
    { icon: Calendar, label: "Events", value: stats.events, color: "text-blue-600" },
    { icon: BookOpen, label: "Programs", value: stats.programs, color: "text-green-600" },
    { icon: FileText, label: "Blog Posts", value: stats.posts, color: "text-purple-600" },
    { icon: BarChart, label: "Submissions", value: stats.submissions, color: "text-orange-600" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to YDA CMS</CardTitle>
            <CardDescription>
              Manage your content, events, programs, and more from this dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Use the sidebar navigation to access different sections of the CMS.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
