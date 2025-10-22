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
import { Target, Eye, Heart, Users, Activity, TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-diabetes-care.jpg";

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

interface Program {
  id: string;
  slug: string;
  title: any;
  summary?: any;
  icon?: string;
}

interface Event {
  id: string;
  slug: string;
  title: any;
  city?: any;
  start_at: string;
}

interface Post {
  id: string;
  slug: string;
  title: any;
  excerpt?: any;
  type: string;
}

const Index = () => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [kpis, setKPIs] = useState<KPI[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
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

      // Fetch featured programs (limit 3)
      const { data: programsData } = await supabase
        .from("program")
        .select("id, slug, title, summary, icon")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(3);

      if (programsData) setPrograms(programsData);

      // Fetch upcoming events (limit 3)
      const { data: eventsData } = await supabase
        .from("event")
        .select("id, slug, title, city, start_at")
        .eq("status", "published")
        .gte("start_at", new Date().toISOString())
        .order("start_at", { ascending: true })
        .limit(3);

      if (eventsData) setEvents(eventsData);

      // Fetch recent resources (limit 3)
      const { data: postsData } = await supabase
        .from("post")
        .select("id, slug, title, excerpt, type")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(3);

      if (postsData) setPosts(postsData);
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
        className="relative overflow-hidden h-[600px] md:h-[700px]"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Diabetes care in Yemen"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>

        {/* Content */}
        <div className="container relative h-full flex items-center">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              {hero?.title?.[locale] || t("hero.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8"
            >
              {hero?.content?.[locale] || t("hero.subtitle")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" asChild className="shadow-lg">
                <Link to={`/${locale}/events`}>
                  <Calendar className="mr-2 h-5 w-5" />
                  {t("hero.cta1")}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to={`/${locale}/get-involved`}>
                  <Users className="mr-2 h-5 w-5" />
                  {t("hero.cta2")}
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to={`/${locale}/contact`}>
                  <Heart className="mr-2 h-5 w-5" />
                  {t("hero.cta3")}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mission && (
              <AnimatedCard delay={0}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{mission.title[locale]}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{mission.content[locale]}</p>
                </CardContent>
              </AnimatedCard>
            )}
            {vision && (
              <AnimatedCard delay={0.1}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Eye className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{vision.title[locale]}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{vision.content[locale]}</p>
                </CardContent>
              </AnimatedCard>
            )}
            {values && (
              <AnimatedCard delay={0.2}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{values.title[locale]}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{values.content[locale]}</p>
                </CardContent>
              </AnimatedCard>
            )}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {locale === "ar" ? "شاهد قصتنا" : "Watch Our Story"}
              </h2>
              <p className="text-lg text-muted-foreground">
                {locale === "ar" 
                  ? "تعرف على رؤيتنا ورسالتنا في مكافحة السكري في اليمن"
                  : "Learn about our vision and mission in fighting diabetes in Yemen"}
              </p>
            </div>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/F_GZYEtKaa0"
                title="Yemen Diabetes Association Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
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
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
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
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                </div>
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
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </div>
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
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </div>
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

      {/* Programs Preview */}
      {programs.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {locale === "ar" ? "برامجنا" : "Our Programs"}
              </h2>
              <Button variant="outline" asChild>
                <Link to={`/${locale}/programs`}>
                  {locale === "ar" ? "عرض الكل" : "View All"}
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {programs.map((program, index) => (
                <AnimatedCard key={program.id} delay={index * 0.1}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {program.icon && <span className="text-3xl">{program.icon}</span>}
                      <CardTitle className="text-xl">
                        {program.title[locale]}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {program.summary?.[locale]}
                    </p>
                    <Button variant="link" asChild className="p-0">
                      <Link to={`/${locale}/programs/${program.slug}`}>
                        {locale === "ar" ? "اقرأ المزيد" : "Learn More"} →
                      </Link>
                    </Button>
                  </CardContent>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events Preview */}
      {events.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {locale === "ar" ? "الفعاليات القادمة" : "Upcoming Events"}
              </h2>
              <Button variant="outline" asChild>
                <Link to={`/${locale}/events`}>
                  {locale === "ar" ? "عرض الكل" : "View All"}
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <AnimatedCard key={event.id} delay={index * 0.1}>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {event.title[locale]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.start_at).toLocaleDateString(locale === "ar" ? "ar-YE" : "en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </div>
                      {event.city && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {event.city[locale]}
                        </div>
                      )}
                    </div>
                    <Button variant="link" asChild className="p-0">
                      <Link to={`/${locale}/events/${event.slug}`}>
                        {locale === "ar" ? "التفاصيل" : "Details"} →
                      </Link>
                    </Button>
                  </CardContent>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Resources Preview */}
      {posts.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {locale === "ar" ? "أحدث الموارد" : "Latest Resources"}
              </h2>
              <Button variant="outline" asChild>
                <Link to={`/${locale}/resources`}>
                  {locale === "ar" ? "عرض الكل" : "View All"}
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <AnimatedCard key={post.id} delay={index * 0.1}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.type === "article" && (locale === "ar" ? "مقال" : "Article")}
                        {post.type === "guide" && (locale === "ar" ? "دليل" : "Guide")}
                        {post.type === "news" && (locale === "ar" ? "أخبار" : "News")}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">
                      {post.title[locale]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {post.excerpt?.[locale]}
                    </p>
                    <Button variant="link" asChild className="p-0">
                      <Link to={`/${locale}/resources/${post.slug}`}>
                        {locale === "ar" ? "اقرأ المزيد" : "Read More"} →
                      </Link>
                    </Button>
                  </CardContent>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      )}

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
