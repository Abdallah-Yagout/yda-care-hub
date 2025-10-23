import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Plus } from "lucide-react";

interface Event {
  id: string;
  slug: string;
  title: any;
  city: any;
  start_at: string;
  capacity?: number;
  status: string;
}

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("event")
        .select("*")
        .order("start_at", { ascending: false });

      if (error) throw error;
      if (data) setEvents(data);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Events Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage your events</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            <p className="text-sm text-muted-foreground">Loading events...</p>
          </div>
        </div>
      ) : events.length > 0 ? (
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id} className="hover-lift">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="mb-3 text-lg">
                      {event.title?.ar} / {event.title?.en}
                    </CardTitle>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <span>{format(new Date(event.start_at), "PPP")}</span>
                      </div>
                      {event.city?.ar && (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-accent" />
                          </div>
                          <span>{event.city.ar} / {event.city.en}</span>
                        </div>
                      )}
                      {event.capacity && (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-secondary-foreground" />
                          </div>
                          <span>{event.capacity} attendees</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={event.status === "published" ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="outline">Preview</Button>
                  <Button size="sm" variant="outline">Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Get started by creating your first event
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create First Event
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminEvents;
