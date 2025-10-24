import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { FileText, Plus, Search, Loader2, Edit, Trash2, ExternalLink, Calendar } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Post {
  id: string;
  slug: string;
  title: any;
  excerpt?: any;
  type: string;
  status: string;
  published_at?: string;
  cover_url?: string;
  created_at: string;
}

const AdminPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("published_at");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  useRealtimeSubscription({
    table: "post",
    onInsert: () => loadPosts(),
    onUpdate: () => loadPosts(),
    onDelete: () => loadPosts(),
  });

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("post")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts
    .filter((post) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        post.title?.ar?.toLowerCase().includes(searchLower) ||
        post.title?.en?.toLowerCase().includes(searchLower) ||
        post.slug?.toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      const matchesType = typeFilter === "all" || post.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return (a.title?.en || "").localeCompare(b.title?.en || "");
      }
      if (sortBy === "published_at") {
        const dateA = new Date(a.published_at || a.created_at).getTime();
        const dateB = new Date(b.published_at || b.created_at).getTime();
        return dateB - dateA;
      }
      return 0;
    });

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase.from("post").delete().eq("id", deleteId);

      if (error) throw error;

      toast.success("Post deleted successfully");
      setDeleteId(null);
      loadPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      article: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      guide: "bg-green-500/10 text-green-700 border-green-500/20",
      video: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      article: "📄",
      guide: "📚",
      video: "🎥",
    };
    return icons[type] || "📄";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Posts Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage blog posts and resources</p>
        </div>
        <Button onClick={() => navigate("/admin/posts/new")} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Post
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="article">Article</SelectItem>
            <SelectItem value="guide">Guide</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published_at">Date</SelectItem>
            <SelectItem value="title">Title (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading posts...</p>
          </div>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid gap-4">
          {filteredPosts.map((post, index) => (
            <Card
              key={post.id}
              className="hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge className={getTypeColor(post.type)}>
                        <span className="mr-1">{getTypeIcon(post.type)}</span>
                        {post.type}
                      </Badge>
                      <Badge variant={post.status === "published" ? "default" : "secondary"}>
                        {post.status}
                      </Badge>
                      {post.published_at && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(post.published_at), "PPP")}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">
                      {post.title?.ar} / {post.title?.en}
                    </CardTitle>
                    {post.excerpt?.en && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {post.excerpt.en}
                      </p>
                    )}
                  </div>
                  {post.cover_url && (
                    <img
                      src={post.cover_url}
                      alt=""
                      className="w-20 h-20 object-cover rounded-lg shrink-0"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/admin/posts/${post.id}`)}
                    className="btn-scale"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/en/resources/${post.slug}`, "_blank")}
                    className="btn-scale"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteId(post.id)}
                    className="btn-scale"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "No posts found" : "No posts yet"}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by creating your first post"}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate("/admin/posts/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Post
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPosts;
