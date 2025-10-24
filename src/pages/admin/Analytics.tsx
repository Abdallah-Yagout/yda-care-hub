import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Eye, Edit, Trash2, Plus, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface ActivityLogEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: any;
  created_at: string;
  user_id: string;
}

interface ActivitySummary {
  total_actions: number;
  creates: number;
  updates: number;
  deletes: number;
  views: number;
}

const AdminAnalytics = () => {
  const [recentActivity, setRecentActivity] = useState<ActivityLogEntry[]>([]);
  const [summary, setSummary] = useState<ActivitySummary>({
    total_actions: 0,
    creates: 0,
    updates: 0,
    deletes: 0,
    views: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Load recent activity
      const { data: activityData, error: activityError } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (activityError) throw activityError;

      setRecentActivity(activityData || []);

      // Calculate summary
      if (activityData) {
        const summary: ActivitySummary = {
          total_actions: activityData.length,
          creates: activityData.filter(a => a.action === 'create').length,
          updates: activityData.filter(a => a.action === 'update').length,
          deletes: activityData.filter(a => a.action === 'delete').length,
          views: activityData.filter(a => a.action === 'view').length,
        };
        setSummary(summary);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'update':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'view':
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'text-green-600 bg-green-50';
      case 'update':
        return 'text-blue-600 bg-blue-50';
      case 'delete':
        return 'text-red-600 bg-red-50';
      case 'view':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Analytics & Monitoring</h1>
        <p className="text-muted-foreground mt-1">Track activity and content performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total_actions}</div>
            <p className="text-xs text-muted-foreground">Last 50 activities</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Creates</CardTitle>
            <Plus className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.creates}</div>
            <p className="text-xs text-muted-foreground">New content created</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Updates</CardTitle>
            <Edit className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.updates}</div>
            <p className="text-xs text-muted-foreground">Content modified</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deletes</CardTitle>
            <Trash2 className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.deletes}</div>
            <p className="text-xs text-muted-foreground">Content removed</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="by-type">By Content Type</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No activity recorded yet</p>
              ) : (
                <div className="space-y-2">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className={`flex items-start gap-4 p-3 rounded-lg border animate-fade-in-up`}
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className={`mt-1 p-2 rounded-lg ${getActionColor(activity.action)}`}>
                        {getActionIcon(activity.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium capitalize">{activity.action}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground capitalize">
                            {activity.entity_type}
                          </span>
                        </div>
                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <p className="text-sm text-muted-foreground truncate">
                            {JSON.stringify(activity.metadata)}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(activity.created_at), "PPp")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-type" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {['program', 'event', 'page', 'post', 'submission'].map((type) => {
              const typeActivities = recentActivity.filter(a => a.entity_type === type);
              return (
                <Card key={type} className="hover-lift">
                  <CardHeader>
                    <CardTitle className="capitalize">{type}s</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Actions</span>
                        <span className="font-medium">{typeActivities.length}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Creates</span>
                        <span className="font-medium">
                          {typeActivities.filter(a => a.action === 'create').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-blue-600">
                        <span>Updates</span>
                        <span className="font-medium">
                          {typeActivities.filter(a => a.action === 'update').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Deletes</span>
                        <span className="font-medium">
                          {typeActivities.filter(a => a.action === 'delete').length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
