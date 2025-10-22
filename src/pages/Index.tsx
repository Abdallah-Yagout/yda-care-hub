import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/AnimatedCard";
import { CountUpNumber } from "@/components/CountUpNumber";

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
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 md:py-32"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container relative text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
          >
            {hero?.title?.[locale] || t("hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
          >
            {hero?.content?.[locale] || t("hero.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Button size="lg" asChild className="shadow-lg">
              <Link to={`/${locale}/events`}>{t("hero.cta1")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to={`/${locale}/get-involved`}>{t("hero.cta2")}</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to={`/${locale}/contact`}>{t("hero.cta3")}</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mission && (
              <AnimatedCard delay={0}>
                <CardHeader>
                  <CardTitle>{mission.title[locale]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{mission.content[locale]}</p>
                </CardContent>
              </AnimatedCard>
            )}
            {vision && (
              <AnimatedCard delay={0.1}>
                <CardHeader>
                  <CardTitle>{vision.title[locale]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{vision.content[locale]}</p>
                </CardContent>
              </AnimatedCard>
            )}
            {values && (
              <AnimatedCard delay={0.2}>
                <CardHeader>
                  <CardTitle>{values.title[locale]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{values.content[locale]}</p>
                </CardContent>
              </AnimatedCard>
            )}
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="py-16">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            {t("home.kpis")}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <AnimatedCard delay={0} className="text-center">
              <CardContent className="pt-6">
                <p className="text-5xl font-bold text-primary mb-2">
                  <CountUpNumber end={getKPIValue("adults_with_diabetes")} />
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
            </AnimatedCard>

            <AnimatedCard delay={0.1} className="text-center">
              <CardContent className="pt-6">
                <p className="text-5xl font-bold text-primary mb-2">
                  <CountUpNumber end={getKPIValue("adult_prevalence")} decimals={1} suffix="%" />
                </p>
                <p className="text-muted-foreground">
                  {locale === "ar"
                    ? "معدل انتشار السكري"
                    : "Adult Prevalence"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">2024</p>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={0.2} className="text-center">
              <CardContent className="pt-6">
                <p className="text-5xl font-bold text-primary mb-2">
                  <CountUpNumber end={getKPIValue("beneficiaries") || 0} />
                </p>
                <p className="text-muted-foreground">
                  {locale === "ar" ? "المستفيدون / السنة" : "Beneficiaries / Year"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {locale === "ar" ? "سيتم التحديد" : "To be filled"}
                </p>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={0.3} className="text-center">
              <CardContent className="pt-6">
                <p className="text-5xl font-bold text-primary mb-2">
                  <CountUpNumber end={kpis.length > 0 ? 3 : 0} />
                </p>
                <p className="text-muted-foreground">
                  {locale === "ar" ? "البرامج النشطة" : "Active Programs"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">2025</p>
              </CardContent>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden py-16 bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-4"
          >
            {t("home.cta")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg mb-8 opacity-90"
          >
            {locale === "ar"
              ? "كن جزءاً من حركة مكافحة السكري في اليمن"
              : "Be part of the movement to combat diabetes in Yemen"}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button size="lg" variant="secondary" asChild className="shadow-xl">
              <Link to={`/${locale}/get-involved`}>{t("common.learnMore")}</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </PublicLayout>
  );
};

export default Index;
