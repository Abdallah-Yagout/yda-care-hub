import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

interface Video {
  id: string;
  youtube_id: string;
  title: { ar: string; en: string };
  description?: { ar: string; en: string };
  thumbnail_url?: string;
  tags?: string[];
  sort: number;
  status: string;
  created_at: string;
}

export default function Videos() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("video")
        .select("*")
        .order("sort", { ascending: true });

      if (error) throw error;
      setVideos((data || []) as unknown as Video[]);
    } catch (error) {
      console.error("Error loading videos:", error);
      toast({
        title: "Error",
        description: "Failed to load videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const { error } = await supabase.from("video").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video deleted successfully",
      });

      await loadVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive",
      });
    }
  };

  const filteredVideos = videos.filter((video) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      video.title?.ar?.toLowerCase().includes(query) ||
      video.title?.en?.toLowerCase().includes(query) ||
      video.youtube_id.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Videos</h1>
          <p className="text-muted-foreground mt-2">
            Manage YouTube video gallery with bilingual metadata
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/videos/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Video
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Videos</CardTitle>
          <CardDescription>
            Filter by title or YouTube ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card key={video.id}>
            <CardContent className="p-4 space-y-3">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title.en}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Youtube className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">
                    {video.youtube_id}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    video.status === 'published' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {video.status}
                  </span>
                </div>

                <div>
                  <p className="font-medium line-clamp-2">{video.title.en}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {video.title.ar}
                  </p>
                </div>

                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {video.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-muted rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="flex-1"
                  >
                    <Link to={`/admin/videos/${video.id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteVideo(video.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No videos found</p>
        </div>
      )}
    </div>
  );
}
