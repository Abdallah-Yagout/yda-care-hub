import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Program {
  id: string;
  slug: string;
  title: any;
  summary: any;
  body: any;
  icon?: string;
  cover_url?: string;
}

const ProgramDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) loadProgram();
  }, [slug]);

  const loadProgram = async () => {
    try {
      const { data, error } = await supabase
        .from("program")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      setProgram(data);
    } catch (error) {
      console.error("Error loading program:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="container py-12 text-center">
          <p>{t("common.loading")}</p>
        </div>
      </PublicLayout>
    );
  }

  if (!program) {
    return (
      <PublicLayout>
        <div className="container py-12 text-center">
          <p className="mb-4">
            {locale === "ar" ? "البرنامج غير موجود" : "Program not found"}
          </p>
          <Button asChild>
            <Link to={`/${locale}/programs`}>
              {locale === "ar" ? "العودة للبرامج" : "Back to Programs"}
            </Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <Helmet>
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} />
        <title>{program.title?.[locale] || "Program"} | YDA</title>
        <meta name="description" content={program.summary?.[locale] || "Program details"} />
        <link rel="canonical" href={`${window.location.origin}/${locale}/programs/${slug}`} />
        <link rel="alternate" hrefLang="ar" href={`${window.location.origin}/ar/programs/${slug}`} />
        <link rel="alternate" hrefLang="en" href={`${window.location.origin}/en/programs/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${program.title?.[locale]} | YDA`} />
        <meta property="og:description" content={program.summary?.[locale] || ""} />
        {program.cover_url && <meta property="og:image" content={program.cover_url} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {program.cover_url && (
            <img
              src={program.cover_url}
              alt={program.title[locale]}
              className="w-full aspect-video object-cover rounded-lg mb-8"
            />
          )}

          <h1 className="text-4xl font-bold mb-4">{program.title[locale]}</h1>

          {program.summary?.[locale] && (
            <p className="text-xl text-muted-foreground mb-8">
              {program.summary[locale]}
            </p>
          )}

          {program.body?.[locale] && (
            <Card>
              <CardContent className="pt-6">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{program.body[locale]}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8">
            <Button asChild variant="outline">
              <Link to={`/${locale}/programs`}>
                {locale === "ar" ? "العودة للبرامج" : "Back to Programs"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProgramDetail;
