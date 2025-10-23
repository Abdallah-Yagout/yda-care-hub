import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { BilingualRichTextEditor } from "@/components/admin/BilingualRichTextEditor";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { z } from "zod";

// Validation schema
const pageSchema = z.object({
  title: z.object({
    ar: z.string().min(1, "Arabic title is required"),
    en: z.string().min(1, "English title is required"),
  }),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
});

const PageForm = () => {
  const navigate = useNavigate();
  const { id: pageId } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!pageId);
  
  // Form state
  const [title, setTitle] = useState({ ar: "", en: "" });
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState({ ar: "", en: "" });
  const [body, setBody] = useState({ ar: "", en: "" });
  const [seoTitle, setSeoTitle] = useState({ ar: "", en: "" });
  const [seoDesc, setSeoDesc] = useState({ ar: "", en: "" });
  const [status, setStatus] = useState("draft");
  const [errors, setErrors] = useState<any>({});

  // Load page data if editing
  useEffect(() => {
    if (pageId) {
      loadPageData();
    }
  }, [pageId]);

  const loadPageData = async () => {
    try {
      const { data, error } = await supabase
        .from("page")
        .select("*")
        .eq("id", pageId)
        .single();

      if (error) throw error;

      if (data) {
        setTitle((data.title as any) || { ar: "", en: "" });
        setSlug(data.slug || "");
        setExcerpt((data.excerpt as any) || { ar: "", en: "" });
        setBody((data.body as any) || { ar: "", en: "" });
        setSeoTitle((data.seo_title as any) || { ar: "", en: "" });
        setSeoDesc((data.seo_desc as any) || { ar: "", en: "" });
        setStatus(data.status || "draft");
      }
    } catch (error) {
      console.error("Error loading page:", error);
      toast.error("Failed to load page data");
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
    if (!pageId && value.en) {
      setSlug(generateSlug(value.en));
    }
  };

  const validateForm = () => {
    try {
      pageSchema.parse({ title, slug });
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
      const pageData = {
        title,
        slug,
        excerpt,
        body,
        seo_title: seoTitle,
        seo_desc: seoDesc,
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
      };

      if (pageId) {
        // Update existing page
        const { error } = await supabase
          .from("page")
          .update(pageData)
          .eq("id", pageId);

        if (error) throw error;
        toast.success("Page updated successfully");
      } else {
        // Create new page
        const { error } = await supabase
          .from("page")
          .insert(pageData);

        if (error) throw error;
        toast.success("Page created successfully");
      }

      navigate("/admin/pages");
    } catch (error: any) {
      console.error("Error saving page:", error);
      toast.error(error.message || "Failed to save page");
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/pages")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {pageId ? "Edit Page" : "Create New Page"}
          </h1>
          <p className="text-muted-foreground">
            Fill in the details below to {pageId ? "update" : "create"} a page
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
              label="Page Title"
              value={title}
              onChange={handleTitleChange}
              placeholder={{ ar: "عنوان الصفحة", en: "Page Title" }}
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
                placeholder="page-name"
                className={errors.slug ? "border-destructive" : ""}
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Used in the URL: /page/{slug}
              </p>
            </div>

            <BilingualInput
              label="Excerpt"
              value={excerpt}
              onChange={setExcerpt}
              type="textarea"
              placeholder={{ ar: "مقتطف الصفحة", en: "Page Excerpt" }}
            />
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <BilingualRichTextEditor
              label="Page Body"
              value={body}
              onChange={setBody}
            />
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <BilingualInput
              label="SEO Title"
              value={seoTitle}
              onChange={setSeoTitle}
              placeholder={{ ar: "عنوان SEO", en: "SEO Title" }}
            />
            <p className="text-xs text-muted-foreground -mt-2">
              Recommended: 50-60 characters
            </p>

            <BilingualInput
              label="SEO Description"
              value={seoDesc}
              onChange={setSeoDesc}
              type="textarea"
              placeholder={{ ar: "وصف SEO", en: "SEO Description" }}
            />
            <p className="text-xs text-muted-foreground -mt-2">
              Recommended: 150-160 characters
            </p>
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
            onClick={() => navigate("/admin/pages")}
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
                {pageId ? "Update Page" : "Create Page"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PageForm;
