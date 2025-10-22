import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  useEffect(() => {
    loadSubmissions();
  }, [filter]);

  const loadSubmissions = async () => {
    try {
      let query = supabase.from("submission").select("*").order("created_at", { ascending: false });

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Form Submissions</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="contact">Contact</SelectItem>
            <SelectItem value="volunteer">Volunteer</SelectItem>
            <SelectItem value="event-register">Event Registration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : submissions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No submissions found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <Card key={submission.id}>
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
