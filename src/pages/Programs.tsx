import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Program {
  id: string;
  slug: string;
  title: any;
  summary: any;
  icon?: string;
  cover_url?: string;
}

const Programs = () => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from("program")
        .select("*")
        .eq("status", "published")
        .order("created_at");

      if (error) throw error;
      if (data) setPrograms(data);
    } catch (error) {
      console.error("Error loading programs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <Helmet>
        <title>{t("programs.title")} | YDA</title>
        <meta
          name="description"
          content={
            locale === "ar"
              ? "برامج جمعية السكري اليمنية"
              : "Yemen Diabetes Association programs"
          }
        />
      </Helmet>

      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-4">{t("programs.title")}</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl">
          {locale === "ar"
            ? "نقدم مجموعة متنوعة من البرامج لدعم مرضى السكري وعائلاتهم في اليمن"
            : "We offer a variety of programs to support diabetes patients and their families in Yemen"}
        </p>

        {loading ? (
          <div className="text-center py-12">
            <p>{t("common.loading")}</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {locale === "ar" ? "لا توجد برامج" : "No programs found"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <Card key={program.id} className="flex flex-col">
                {program.cover_url && (
                  <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                    <img
                      src={program.cover_url}
                      alt={program.title?.[locale]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    {program.title?.[locale]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  {program.summary?.[locale] && (
                    <p className="text-muted-foreground line-clamp-4">
                      {program.summary[locale]}
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/${locale}/programs/${program.slug}`}>
                      {t("common.learnMore")}
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

export default Programs;
