import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { BilingualInput } from "@/components/admin/BilingualInput";

export default function VideoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    youtube_id: "",
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    channel_ar: "",
    channel_en: "",
    tags: "",
    sort: 0,
    status: "published",
  });

  useEffect(() => {
    if (id) loadVideo();
  }, [id]);

  const loadVideo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("video")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          youtube_id: data.youtube_id || "",
          title_ar: (data.title as any)?.ar || "",
          title_en: (data.title as any)?.en || "",
          description_ar: (data.description as any)?.ar || "",
          description_en: (data.description as any)?.en || "",
          channel_ar: (data.channel as any)?.ar || "",
          channel_en: (data.channel as any)?.en || "",
          tags: Array.isArray(data.tags) ? (data.tags as string[]).join(", ") : "",
          sort: data.sort || 0,
          status: data.status || "published",
        });
      }
    } catch (error) {
      console.error("Error loading video:", error);
      toast({
        title: "Error",
        description: "Failed to load video",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const videoData = {
        youtube_id: formData.youtube_id,
        title: {
          ar: formData.title_ar,
          en: formData.title_en,
        },
        description: {
          ar: formData.description_ar,
          en: formData.description_en,
        },
        channel: {
          ar: formData.channel_ar,
          en: formData.channel_en,
        },
        tags: tagsArray,
        sort: formData.sort,
        status: formData.status,
        thumbnail_url: `https://img.youtube.com/vi/${formData.youtube_id}/maxresdefault.jpg`,
      };

      if (id) {
        const { error } = await supabase
          .from("video")
          .update(videoData)
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Video updated successfully",
        });
      } else {
        const { error } = await supabase.from("video").insert(videoData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Video created successfully",
        });
      }

      navigate("/admin/videos");
    } catch (error: any) {
      console.error("Error saving video:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save video",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/videos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {id ? "Edit Video" : "Add New Video"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage YouTube video with bilingual metadata
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Video Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="youtube_id">YouTube ID *</Label>
              <Input
                id="youtube_id"
                value={formData.youtube_id}
                onChange={(e) =>
                  setFormData({ ...formData, youtube_id: e.target.value })
                }
                placeholder="e.g., I_lgpEYc7bc"
                required
              />
              <p className="text-sm text-muted-foreground">
                Extract from YouTube URL: youtube.com/watch?v=<strong>I_lgpEYc7bc</strong>
              </p>
            </div>

            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
              </TabsList>

              <TabsContent value="en" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_en">Title (English) *</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) =>
                      setFormData({ ...formData, title_en: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_en">Description (English)</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) =>
                      setFormData({ ...formData, description_en: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channel_en">Channel (English)</Label>
                  <Input
                    id="channel_en"
                    value={formData.channel_en}
                    onChange={(e) =>
                      setFormData({ ...formData, channel_en: e.target.value })
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent value="ar" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title_ar">العنوان (عربي) *</Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) =>
                      setFormData({ ...formData, title_ar: e.target.value })
                    }
                    dir="rtl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_ar">الوصف (عربي)</Label>
                  <Textarea
                    id="description_ar"
                    value={formData.description_ar}
                    onChange={(e) =>
                      setFormData({ ...formData, description_ar: e.target.value })
                    }
                    dir="rtl"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channel_ar">القناة (عربي)</Label>
                  <Input
                    id="channel_ar"
                    value={formData.channel_ar}
                    onChange={(e) =>
                      setFormData({ ...formData, channel_ar: e.target.value })
                    }
                    dir="rtl"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="الصيام, سكري, تثقيف"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sort">Sort Order</Label>
                <Input
                  id="sort"
                  type="number"
                  value={formData.sort}
                  onChange={(e) =>
                    setFormData({ ...formData, sort: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Video"
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/videos">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
