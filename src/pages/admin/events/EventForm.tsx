import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { BilingualRichTextEditor } from "@/components/admin/BilingualRichTextEditor";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { z } from "zod";

// Validation schema
const eventSchema = z.object({
  title: z.object({
    ar: z.string().min(1, "Arabic title is required"),
    en: z.string().min(1, "English title is required"),
  }),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  start_at: z.string().min(1, "Start date is required"),
  end_at: z.string().min(1, "End date is required"),
});

interface EventFormProps {
  eventId?: string;
}

export const EventForm = ({ eventId }: EventFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!eventId);
  
  // Form state
  const [title, setTitle] = useState({ ar: "", en: "" });
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState({ ar: "", en: "" });
  const [body, setBody] = useState({ ar: "", en: "" });
  const [venue, setVenue] = useState({ ar: "", en: "" });
  const [city, setCity] = useState({ ar: "", en: "" });
  const [coverUrl, setCoverUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [capacity, setCapacity] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [status, setStatus] = useState("draft");
  const [errors, setErrors] = useState<any>({});

  // Load event data if editing
  useState(() => {
    if (eventId) {
      loadEventData();
    }
  });

  const loadEventData = async () => {
    try {
      const { data, error } = await supabase
        .from("event")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) throw error;

      if (data) {
        setTitle((data.title as any) || { ar: "", en: "" });
        setSlug(data.slug || "");
        setSummary((data.summary as any) || { ar: "", en: "" });
        setBody((data.body as any) || { ar: "", en: "" });
        setVenue((data.venue as any) || { ar: "", en: "" });
        setCity((data.city as any) || { ar: "", en: "" });
        setCoverUrl(data.cover_url || "");
        setExternalUrl(data.external_url || "");
        setCapacity(data.capacity?.toString() || "");
        setStartAt(data.start_at ? new Date(data.start_at).toISOString().slice(0, 16) : "");
        setEndAt(data.end_at ? new Date(data.end_at).toISOString().slice(0, 16) : "");
        setStatus(data.status || "draft");
      }
    } catch (error) {
      console.error("Error loading event:", error);
      toast.error("Failed to load event data");
    } finally {
      setLoadingData(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: { ar: string; en: string }) => {
    setTitle(value);
    if (!eventId && value.en) {
      setSlug(generateSlug(value.en));
    }
  };

  const validateForm = () => {
    try {
      eventSchema.parse({
        title,
        slug,
        start_at: startAt,
        end_at: endAt,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: any = {};
        error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          formattedErrors[path] = issue.message;
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);

    try {
      const eventData = {
        title,
        slug,
        summary,
        body,
        venue,
        city,
        cover_url: coverUrl,
        external_url: externalUrl,
        capacity: capacity ? parseInt(capacity) : null,
        start_at: new Date(startAt).toISOString(),
        end_at: new Date(endAt).toISOString(),
        status,
      };

      if (eventId) {
        // Update existing event
        const { error } = await supabase
          .from("event")
          .update(eventData)
          .eq("id", eventId);

        if (error) throw error;
        toast.success("Event updated successfully");
      } else {
        // Create new event
        const { error } = await supabase
          .from("event")
          .insert(eventData);

        if (error) throw error;
        toast.success("Event created successfully");
      }

      navigate("/admin/events");
    } catch (error: any) {
      console.error("Error saving event:", error);
      toast.error(error.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/events")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {eventId ? "Edit Event" : "Create New Event"}
          </h1>
          <p className="text-muted-foreground">
            Fill in the details below to {eventId ? "update" : "create"} an event
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <BilingualInput
              label="Event Title"
              value={title}
              onChange={handleTitleChange}
              placeholder={{ ar: "عنوان الفعالية", en: "Event Title" }}
              required
              error={errors["title.ar"] || errors["title.en"]}
            />

            <div className="space-y-2">
              <Label htmlFor="slug">
                URL Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="event-name"
                className={errors.slug ? "border-destructive" : ""}
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Used in the URL: /events/{slug}
              </p>
            </div>

            <BilingualInput
              label="Summary"
              value={summary}
              onChange={setSummary}
              type="textarea"
              placeholder={{ ar: "ملخص الفعالية", en: "Event Summary" }}
            />
          </CardContent>
        </Card>

        {/* Date & Location */}
        <Card>
          <CardHeader>
            <CardTitle>Date & Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_at">
                  Start Date & Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="start_at"
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  className={errors.start_at ? "border-destructive" : ""}
                />
                {errors.start_at && (
                  <p className="text-sm text-destructive">{errors.start_at}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_at">
                  End Date & Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="end_at"
                  type="datetime-local"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  className={errors.end_at ? "border-destructive" : ""}
                />
                {errors.end_at && (
                  <p className="text-sm text-destructive">{errors.end_at}</p>
                )}
              </div>
            </div>

            <BilingualInput
              label="Venue"
              value={venue}
              onChange={setVenue}
              placeholder={{ ar: "مكان الفعالية", en: "Event Venue" }}
            />

            <BilingualInput
              label="City"
              value={city}
              onChange={setCity}
              placeholder={{ ar: "المدينة", en: "City" }}
            />

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (Optional)</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <BilingualRichTextEditor
              label="Event Description"
              value={body}
              onChange={setBody}
            />
          </CardContent>
        </Card>

        {/* Media & Links */}
        <Card>
          <CardHeader>
            <CardTitle>Media & Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MediaUploader
              label="Cover Image"
              bucket="events"
              value={coverUrl}
              onChange={(value) => setCoverUrl(Array.isArray(value) ? value[0] || "" : value)}
              accept="image/*"
            />

            <div className="space-y-2">
              <Label htmlFor="external_url">External Registration URL (Optional)</Label>
              <Input
                id="external_url"
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Publishing */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/events")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {eventId ? "Update Event" : "Create Event"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
