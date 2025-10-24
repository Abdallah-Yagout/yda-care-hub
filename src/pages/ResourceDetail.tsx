import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

interface Post {
  id: string;
  slug: string;
  title: any;
  excerpt: any;
  body: any;
  type: string;
  cover_url?: string;
  published_at?: string;
}

const ResourceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      const { data, error } = await supabase
        .from("post")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="container py-12 text-center">
          <p>{t("common:loading")}</p>
        </div>
      </PublicLayout>
    );
  }

  if (!post) {
    return (
      <PublicLayout>
        <div className="container py-12 text-center">
          <p className="mb-4">
            {locale === "ar" ? "المقال غير موجود" : "Article not found"}
          </p>
          <Button asChild>
            <Link to={`/${locale}/resources`}>
              {locale === "ar" ? "العودة للموارد" : "Back to Resources"}
            </Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const dateLocale = locale === "ar" ? ar : enUS;

  return (
    <PublicLayout>
      <Helmet>
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} />
        <title>{post.title?.[locale] || "Article"} | YDA</title>
        <meta name="description" content={post.excerpt?.[locale] || "Resource details"} />
        <link rel="canonical" href={`${window.location.origin}/${locale}/resources/${slug}`} />
        <link rel="alternate" hrefLang="ar" href={`${window.location.origin}/ar/resources/${slug}`} />
        <link rel="alternate" hrefLang="en" href={`${window.location.origin}/en/resources/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${post.title?.[locale]} | YDA`} />
        <meta property="og:description" content={post.excerpt?.[locale] || ""} />
        {post.cover_url && <meta property="og:image" content={post.cover_url} />}
        {post.published_at && <meta property="article:published_time" content={post.published_at} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4">
              {post.type === "guide"
                ? locale === "ar"
                  ? "دليل"
                  : "Guide"
                : locale === "ar"
                ? "مقال"
                : "Article"}
            </Badge>
            {post.published_at && (
              <p className="text-sm text-muted-foreground">
                {format(new Date(post.published_at), "PPP", {
                  locale: dateLocale,
                })}
              </p>
            )}
          </div>

          {post.cover_url && (
            <img
              src={post.cover_url}
              alt={post.title[locale]}
              className="w-full aspect-video object-cover rounded-lg mb-8"
            />
          )}

          <h1 className="text-4xl font-bold mb-4">{post.title[locale]}</h1>

          {post.excerpt?.[locale] && (
            <p className="text-xl text-muted-foreground mb-8">
              {post.excerpt[locale]}
            </p>
          )}

          {post.body?.[locale] && (
            <Card>
              <CardContent className="pt-6">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{post.body[locale]}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8">
            <Button asChild variant="outline">
              <Link to={`/${locale}/resources`}>
                {locale === "ar" ? "العودة للموارد" : "Back to Resources"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ResourceDetail;
