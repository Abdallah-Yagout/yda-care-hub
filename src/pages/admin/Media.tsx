import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Image as ImageIcon, Download, Trash2 } from "lucide-react";
import { BilingualInput } from "@/components/admin/BilingualInput";

interface MediaItem {
  id: string;
  filename: string;
  public_url: string;
  category: string;
  alt_text: { ar: string; en: string };
  caption?: { ar: string; en: string };
  prompt?: string;
  source: string;
  created_at: string;
}

const CATEGORIES = [
  { value: "hero", label: "Hero (Clinic, Yemen context)" },
  { value: "community", label: "Community Screening" },
  { value: "training", label: "Health-worker Training" },
  { value: "nutrition", label: "Family Nutrition" },
  { value: "youth", label: "Youth & Schools" },
  { value: "conference", label: "Conference 2025" },
  { value: "general", label: "General" },
];

export default function Media() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("hero");
  const [customPrompt, setCustomPrompt] = useState("");
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const { data, error } = await supabase
        .from("media_library")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMedia((data || []) as unknown as MediaItem[]);
    } catch (error) {
      console.error("Error loading media:", error);
      toast({
        title: "Error",
        description: "Failed to load media library",
        variant: "destructive",
      });
    }
  };

  const generateImage = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: {
          category: selectedCategory,
          customPrompt: customPrompt || undefined,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image generated successfully!",
      });

      setCustomPrompt("");
      await loadMedia();
    } catch (error: any) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAltText = async (id: string, altText: { ar: string; en: string }) => {
    try {
      const { error } = await supabase
        .from("media_library")
        .update({ alt_text: altText })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Alt text updated successfully",
      });

      await loadMedia();
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating alt text:", error);
      toast({
        title: "Error",
        description: "Failed to update alt text",
        variant: "destructive",
      });
    }
  };

  const deleteImage = async (id: string, storagePath: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("shared")
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("media_library")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });

      await loadMedia();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Media Library</h1>
        <p className="text-muted-foreground mt-2">
          Generate brand-safe images with AI or manage your media assets
        </p>
      </div>

      {/* Image Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Image</CardTitle>
          <CardDescription>
            Use AI to generate brand-safe images based on predefined prompts or custom descriptions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Custom Prompt (Optional)</Label>
            <Textarea
              placeholder="Leave empty to use the default prompt for this category"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={generateImage} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Library ({media.length} images)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 space-y-3">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={item.public_url}
                    alt={item.alt_text.en || item.filename}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase text-muted-foreground">
                      {item.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.source}
                    </span>
                  </div>

                  {editingItem?.id === item.id ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Alt Text (English)</Label>
                        <Input
                          value={String(editingItem.alt_text.en)}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              alt_text: { ...editingItem.alt_text, en: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Alt Text (Arabic)</Label>
                        <Input
                          value={String(editingItem.alt_text.ar)}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              alt_text: { ...editingItem.alt_text, ar: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateAltText(item.id, editingItem.alt_text)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingItem(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">
                        <strong>EN:</strong> {item.alt_text.en || "No alt text"}
                      </p>
                      <p className="text-sm">
                        <strong>AR:</strong> {item.alt_text.ar || "لا يوجد نص بديل"}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingItem(item)}
                        >
                          Edit Alt Text
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(item.public_url, "_blank")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteImage(item.id, item.filename)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
