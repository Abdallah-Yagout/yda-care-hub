import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

interface Post {
  id: string;
  slug: string;
  title: any;
  excerpt: any;
  type: string;
  cover_url?: string;
  published_at?: string;
}

const Resources = () => {
  const { locale } = useLocale();
  const { t } = useTranslation(["common", "resources"]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("post")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      if (data) setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (searchQuery === "") return true;
    return (
      post.title?.[locale]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.[locale]?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const dateLocale = locale === "ar" ? ar : enUS;

  const seoTitle = locale === "ar" ? "المصادر" : "Resources";
  const seoDescription = locale === "ar"
    ? "مقالات وأدلة ومصادر عن السكري. معلومات موثوقة لإدارة السكري بشكل أفضل"
    : "Articles, guides, and resources about diabetes. Trusted information for better diabetes management";

  return (
    <PublicLayout>
      <Helmet>
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} />
        <title>{seoTitle} | YDA</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={`${window.location.origin}/${locale}/resources`} />
        <link rel="alternate" hrefLang="ar" href={`${window.location.origin}/ar/resources`} />
        <link rel="alternate" hrefLang="en" href={`${window.location.origin}/en/resources`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${seoTitle} | YDA`} />
        <meta property="og:description" content={seoDescription} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-4">{t("resources:title")}</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
          {locale === "ar"
            ? "مقالات وأدلة ومعلومات مفيدة حول مرض السكري"
            : "Articles, guides, and useful information about diabetes"}
        </p>

        <div className="mb-8">
          <Input
            placeholder={t("common:search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p>{t("common:loading")}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {locale === "ar" ? "لا توجد مقالات" : "No articles found"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="flex flex-col">
                {post.cover_url && (
                  <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                    <img
                      src={post.cover_url}
                      alt={post.title?.[locale]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">
                      {post.type === "guide"
                        ? locale === "ar"
                          ? "دليل"
                          : "Guide"
                        : locale === "ar"
                        ? "مقال"
                        : "Article"}
                    </Badge>
                    {post.published_at && (
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(post.published_at), "PP", {
                          locale: dateLocale,
                        })}
                      </span>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">
                    {post.title?.[locale]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  {post.excerpt?.[locale] && (
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt[locale]}
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/${locale}/resources/${post.slug}`}>
                      {t("common:readMore")}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Resources;
