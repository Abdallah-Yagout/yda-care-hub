import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Youtube, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Video {
  id: string;
  youtube_id: string;
  title: { ar: string; en: string };
  description?: { ar: string; en: string };
  thumbnail_url?: string;
  tags?: string[];
}

const Videos = () => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("video")
        .select("*")
        .eq("status", "published")
        .order("sort", { ascending: true });

      if (error) throw error;
      setVideos((data || []) as unknown as Video[]);
    } catch (error) {
      console.error("Error loading videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter((video) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      video.title[locale]?.toLowerCase().includes(query) ||
      video.description?.[locale]?.toLowerCase().includes(query) ||
      video.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedVideo) {
        setSelectedVideo(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedVideo]);

  const seoTitle = locale === "ar" ? "مكتبة الفيديو" : "Video Library";
  const seoDescription =
    locale === "ar"
      ? "شاهد مقاطع فيديو تعليمية حول إدارة السكري والصيام والحج من خبراء يمنيين"
      : "Watch educational videos about diabetes management, fasting, and Hajj from Yemeni experts";

  return (
    <PublicLayout>
      <Helmet>
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} />
        <title>{seoTitle} | YDA</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={`${window.location.origin}/${locale}/videos`} />
        <link rel="alternate" hrefLang="ar" href={`${window.location.origin}/ar/videos`} />
        <link rel="alternate" hrefLang="en" href={`${window.location.origin}/en/videos`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${seoTitle} | YDA`} />
        <meta property="og:description" content={seoDescription} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{seoTitle}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {locale === "ar"
              ? "مجموعة من الفيديوهات التعليمية حول إدارة السكري في سياق يمني"
              : "Educational videos about diabetes management in a Yemeni context"}
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("common:search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-muted animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {locale === "ar" ? "لم يتم العثور على فيديوهات" : "No videos found"}
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="aspect-video bg-muted overflow-hidden relative">
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title[locale]}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Youtube className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 transform duration-300">
                        <Youtube className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold line-clamp-2 text-lg">
                      {video.title[locale]}
                    </h3>

                    {video.description?.[locale] && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.description[locale]}
                      </p>
                    )}

                    {video.tags && video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {video.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
            <DialogContent className="max-w-4xl p-0">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-2xl">
                  {selectedVideo.title[locale]}
                </DialogTitle>
              </DialogHeader>

              <div className="p-6 pt-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo.youtube_id}?autoplay=1`}
                    title={selectedVideo.title[locale]}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {selectedVideo.description?.[locale] && (
                  <p className="text-muted-foreground mb-4">
                    {selectedVideo.description[locale]}
                  </p>
                )}

                {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </PublicLayout>
  );
};

export default Videos;
