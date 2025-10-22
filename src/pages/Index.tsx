import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Block {
  key: string;
  title: any;
  content: any;
}

interface KPI {
  key: string;
  value_int?: number;
  value_dec?: number;
  year?: number;
}

const Index = () => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [kpis, setKPIs] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      // Fetch home page blocks
      const { data: pageData } = await supabase
        .from("page")
        .select("id")
        .eq("slug", "home")
        .single();

      if (pageData) {
        const { data: blocksData } = await supabase
          .from("block")
          .select("*")
          .eq("page_id", pageData.id)
          .order("sort");

        if (blocksData) setBlocks(blocksData);
      }

      // Fetch KPIs
      const { data: kpisData } = await supabase
        .from("kpi")
        .select("*")
        .order("key");

      if (kpisData) setKPIs(kpisData);
    } catch (error) {
      console.error("Error loading home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBlockByKey = (key: string) =>
    blocks.find((b) => b.key === key);

  const getKPIValue = (key: string) => {
    const kpi = kpis.find((k) => k.key === key);
    return kpi?.value_int || kpi?.value_dec || 0;
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p>{t("common.loading")}</p>
        </div>
      </PublicLayout>
    );
  }

  const hero = getBlockByKey("hero");
  const mission = getBlockByKey("mission");
  const vision = getBlockByKey("vision");
  const values = getBlockByKey("values");

  return (
    <PublicLayout>
      <Helmet>
        <title>
          {locale === "ar"
            ? "جمعية السكري اليمنية | YDA"
            : "Yemen Diabetes Association | YDA"}
        </title>
        <meta
          name="description"
          content={
            locale === "ar"
              ? "نعمل معاً من أجل مستقبل خالٍ من مضاعفات السكري في اليمن"
              : "Working together for a future free from diabetes complications in Yemen"
          }
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {hero?.title?.[locale] || t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {hero?.content?.[locale] || t("hero.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to={`/${locale}/events`}>{t("hero.cta1")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to={`/${locale}/get-involved`}>{t("hero.cta2")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mission && (
              <Card>
                <CardHeader>
                  <CardTitle>{mission.title[locale]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{mission.content[locale]}</p>
                </CardContent>
              </Card>
            )}
            {vision && (
              <Card>
                <CardHeader>
                  <CardTitle>{vision.title[locale]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{vision.content[locale]}</p>
                </CardContent>
              </Card>
            )}
            {values && (
              <Card>
                <CardHeader>
                  <CardTitle>{values.title[locale]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{values.content[locale]}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("home.kpis")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <p className="text-5xl font-bold text-primary mb-2">
                  {getKPIValue("adults_with_diabetes").toLocaleString()}
                </p>
                <p className="text-muted-foreground">
                  {locale === "ar"
                    ? "بالغ مصاب بالسكري"
                    : "Adults with Diabetes"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {locale === "ar" ? "في اليمن (2024)" : "in Yemen (2024)"}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <p className="text-5xl font-bold text-primary mb-2">
                  {getKPIValue("adult_prevalence")}%
                </p>
                <p className="text-muted-foreground">
                  {locale === "ar"
                    ? "معدل انتشار السكري"
                    : "Adult Prevalence"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">2024</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <p className="text-5xl font-bold text-primary mb-2">
                  {getKPIValue("beneficiaries").toLocaleString() || "TBF"}
                </p>
                <p className="text-muted-foreground">
                  {locale === "ar" ? "المستفيدون / السنة" : "Beneficiaries / Year"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {locale === "ar" ? "سيتم التحديد" : "To be filled"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">{t("home.cta")}</h2>
          <p className="text-lg mb-8 opacity-90">
            {locale === "ar"
              ? "كن جزءاً من حركة مكافحة السكري في اليمن"
              : "Be part of the movement to combat diabetes in Yemen"}
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to={`/${locale}/get-involved`}>{t("common.learnMore")}</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;
