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
    { 
      icon: Calendar, 
      label: "Events", 
      value: stats.events, 
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Total events"
    },
    { 
      icon: BookOpen, 
      label: "Programs", 
      value: stats.programs, 
      color: "text-accent",
      bgColor: "bg-accent/10",
      description: "Active programs"
    },
    { 
      icon: FileText, 
      label: "Blog Posts", 
      value: stats.posts, 
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      description: "Published posts"
    },
    { 
      icon: BarChart, 
      label: "Submissions", 
      value: stats.submissions, 
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      description: "Form submissions"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your content and track performance metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to YDA CMS</CardTitle>
          <CardDescription className="text-base">
            Manage your content, events, programs, and more from this dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Use the sidebar navigation to access different sections of the CMS. Each section provides tools to create, edit, and manage your content efficiently.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Quick Actions
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Create new content</li>
                <li>• Review submissions</li>
                <li>• Manage events</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <BarChart className="h-4 w-4 text-accent" />
                Analytics
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Track performance</li>
                <li>• Monitor engagement</li>
                <li>• View KPIs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
