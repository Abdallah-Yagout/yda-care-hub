import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { BilingualRichTextEditor } from "@/components/admin/BilingualRichTextEditor";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { z } from "zod";

const postSchema = z.object({
  title: z.object({
    ar: z.string().min(1, "Arabic title required"),
    en: z.string().min(1, "English title required"),
  }),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
});

const PostForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!isNew);
  const [errors, setErrors] = useState<any>({});

  // Form state
  const [title, setTitle] = useState({ ar: "", en: "" });
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState({ ar: "", en: "" });
  const [body, setBody] = useState({ ar: "", en: "" });
  const [coverUrl, setCoverUrl] = useState("");
  const [type, setType] = useState("article");
  const [status, setStatus] = useState("draft");
  const [publishedAt, setPublishedAt] = useState("");

  useEffect(() => {
    if (!isNew && id) {
      loadPostData();
    }
  }, [id, isNew]);

  const loadPostData = async () => {
    try {
      const { data, error } = await supabase
        .from("post")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setTitle((data.title as any) || { ar: "", en: "" });
        setSlug(data.slug || "");
        setExcerpt((data.excerpt as any) || { ar: "", en: "" });
        setBody((data.body as any) || { ar: "", en: "" });
        setCoverUrl(data.cover_url || "");
        setType(data.type || "article");
        setStatus(data.status || "draft");
        setPublishedAt(data.published_at ? data.published_at.split("T")[0] : "");
      }
    } catch (error) {
      console.error("Error loading post:", error);
      toast.error("Failed to load post");
    } finally {
      setLoadingData(false);
    }
  };

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (newTitle: { ar: string; en: string }) => {
    setTitle(newTitle);
    if (isNew && newTitle.en && !slug) {
      setSlug(generateSlug(newTitle.en));
    }
  };

  const validateForm = () => {
    try {
      postSchema.parse({ title, slug });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: any = {};
        error.issues.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }

    setLoading(true);

    try {
      const postData = {
        title,
        slug,
        excerpt,
        body,
        cover_url: coverUrl || null,
        type,
        status,
        published_at: publishedAt || null,
      };

      if (isNew) {
        const { error } = await supabase.from("post").insert(postData);
        if (error) throw error;
        toast.success("Post created successfully");
      } else {
        const { error } = await supabase.from("post").update(postData).eq("id", id);
        if (error) throw error;
        toast.success("Post updated successfully");
      }

      navigate("/admin/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error(isNew ? "Failed to create post" : "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/posts")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isNew ? "Create New Post" : "Edit Post"}</h1>
          <p className="text-muted-foreground mt-1">
            {isNew ? "Add a new blog post or resource" : "Update post details"}
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
              label="Title"
              value={title}
              onChange={handleTitleChange}
              error={errors["title.ar"] || errors["title.en"]}
              required
            />

            <div>
              <Label>Slug (URL)</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="post-slug"
                className="font-mono text-sm"
              />
              {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug}</p>}
            </div>

            <div>
              <Label>Excerpt</Label>
              <Tabs defaultValue="ar" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ar">العربية</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>
                <TabsContent value="ar" className="mt-2">
                  <textarea
                    value={excerpt.ar}
                    onChange={(e) => setExcerpt({ ...excerpt, ar: e.target.value })}
                    rows={3}
                    dir="rtl"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  />
                </TabsContent>
                <TabsContent value="en" className="mt-2">
                  <textarea
                    value={excerpt.en}
                    onChange={(e) => setExcerpt({ ...excerpt, en: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Post Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">📄 Article</SelectItem>
                    <SelectItem value="guide">📚 Guide</SelectItem>
                    <SelectItem value="video">🎥 Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cover Image */}
        <Card>
          <CardHeader>
            <CardTitle>Cover Image</CardTitle>
          </CardHeader>
          <CardContent>
            <MediaUploader
              bucket="posts"
              value={coverUrl}
              onChange={(value) => setCoverUrl(Array.isArray(value) ? value[0] || "" : value)}
              accept="image/*"
              label="Upload cover image"
            />
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <BilingualRichTextEditor label="Body" value={body} onChange={setBody} />
          </CardContent>
        </Card>

        {/* Publishing */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Publish Date (optional)
              </Label>
              <Input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to publish immediately, or set a future date for scheduled publishing
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/posts")}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isNew ? "Create Post" : "Update Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
