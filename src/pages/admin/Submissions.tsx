import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { format } from "date-fns";

interface Submission {
  id: string;
  form_type: string;
  data: any;
  created_at: string;
}

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");

  useEffect(() => {
    loadSubmissions();
  }, [filter, sortBy]);

  // Real-time subscription for new submissions
  useRealtimeSubscription({
    table: 'submission',
    onInsert: () => {
      loadSubmissions();
    },
    showNotifications: true,
  });

  const loadSubmissions = async () => {
    try {
      const orderColumn = sortBy === "created_at" ? "created_at" : "form_type";
      let query = supabase.from("submission").select("*").order(orderColumn, { ascending: sortBy === "form_type" });

      if (filter !== "all") {
        query = query.eq("form_type", filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (data) setSubmissions(data);
    } catch (error) {
      console.error("Error loading submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = submission.data.name?.toLowerCase() || "";
    const email = submission.data.email?.toLowerCase() || "";
    const message = submission.data.message?.toLowerCase() || "";
    return name.includes(query) || email.includes(query) || message.includes(query);
  });

  const getFormTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      contact: "Contact",
      volunteer: "Volunteer",
      "event-register": "Event Registration",
      donation: "Donation",
    };
    return labels[type] || type;
  };

  const getFormTypeBadgeVariant = (type: string): "default" | "secondary" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      contact: "default",
      volunteer: "secondary",
      "event-register": "outline",
    };
    return variants[type] || "default";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Form Submissions</h1>
        <p className="text-muted-foreground mt-1">View and manage form submissions</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="contact">Contact</SelectItem>
            <SelectItem value="volunteer">Volunteer</SelectItem>
            <SelectItem value="event-register">Event Registration</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Most Recent</SelectItem>
            <SelectItem value="form_type">Form Type</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredSubmissions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No submissions found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSubmissions.map((submission, index) => (
            <Card key={submission.id} className="hover-lift animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={getFormTypeBadgeVariant(submission.form_type)}>
                        {getFormTypeLabel(submission.form_type)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(submission.created_at), "PPP p")}
                      </span>
                    </div>
                    <CardTitle className="text-lg">
                      {submission.data.name || submission.data.email}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {Object.entries(submission.data).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-4">
                      <span className="font-medium capitalize">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span className="col-span-2 text-muted-foreground">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;
