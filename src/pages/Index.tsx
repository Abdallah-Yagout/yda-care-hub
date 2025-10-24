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
import heroImage from "@/assets/hero-yda.jpg";

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
  const { t } = useTranslation(["common", "home"]);
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
          <p>{t("common:loading")}</p>
        </div>
      </PublicLayout>
    );
  }

  const hero = getBlockByKey("hero");
  const mission = getBlockByKey("mission");
  const vision = getBlockByKey("vision");
  const values = getBlockByKey("values");

  const seoTitle = locale === "ar" ? "جمعية السكري اليمنية" : "Yemen Diabetes Association";
  const seoDescription = locale === "ar" 
    ? "نعمل معاً من أجل مستقبل خالٍ من مضاعفات السكري في اليمن. برامج توعية، فحوصات مجانية، ودعم شامل لمرضى السكري"
    : "Working together for a future free from diabetes complications in Yemen. Awareness programs, free screenings, and comprehensive support for diabetes patients";

  return (
    <PublicLayout>
      <Helmet>
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} />
        <title>{seoTitle} | YDA</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={`${window.location.origin}/${locale}`} />
        <link rel="alternate" hrefLang="ar" href={`${window.location.origin}/ar`} />
        <link rel="alternate" hrefLang="en" href={`${window.location.origin}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${window.location.origin}/ar`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${seoTitle} | YDA`} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={`${window.location.origin}/logo.png`} />
        <meta property="og:locale" content={locale === "ar" ? "ar_YE" : "en_US"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${seoTitle} | YDA`} />
        <meta name="twitter:description" content={seoDescription} />
      </Helmet>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden min-h-[90vh] flex items-center"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Diabetes care in Yemen"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30" />
        </div>

        {/* Content */}
        <div className="container relative py-24">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium border-primary/30 bg-primary/5">
                {locale === "ar" ? "معاً نحو مستقبل أفضل" : "Together for a Better Future"}
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              {hero?.title?.[locale] || t("home:hero.title")}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-2xl"
            >
              {hero?.content?.[locale] || t("home:hero.subtitle")}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-all">
                <Link to={`/${locale}/events`}>
                  <Calendar className={locale === "ar" ? "ml-2 h-5 w-5" : "mr-2 h-5 w-5"} />
                  {t("home:hero.cta1")}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-2 backdrop-blur-sm">
                <Link to={`/${locale}/get-involved`}>
                  <Users className={locale === "ar" ? "ml-2 h-5 w-5" : "mr-2 h-5 w-5"} />
                  {t("home:hero.cta2")}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Mission, Vision, Values */}
      <section className="py-24 bg-gradient-to-br from-secondary/20 via-secondary/10 to-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {locale === "ar" ? "من نحن" : "Who We Are"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {locale === "ar" 
                ? "رؤيتنا ورسالتنا وقيمنا في خدمة مجتمعنا"
                : "Our vision, mission, and values in serving our community"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mission && (
              <AnimatedCard delay={0} className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                      <Target className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{mission.title[locale]}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{mission.content[locale]}</p>
                </CardContent>
              </AnimatedCard>
            )}
            {vision && (
              <AnimatedCard delay={0.1} className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                      <Eye className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{vision.title[locale]}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{vision.content[locale]}</p>
                </CardContent>
              </AnimatedCard>
            )}
            {values && (
              <AnimatedCard delay={0.2} className="group hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                      <Heart className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{values.title[locale]}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{values.content[locale]}</p>
                </CardContent>
              </AnimatedCard>
            )}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-primary/5 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary)/0.08),transparent_70%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-block px-4 py-2 mb-4 rounded-full bg-primary/10 border border-primary/20"
              >
                <span className="text-sm font-medium text-primary">
                  {locale === "ar" ? "فيديو" : "Video"}
                </span>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {locale === "ar" ? "شاهد قصتنا" : "Watch Our Story"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {locale === "ar" 
                  ? "تعرف على رؤيتنا ورسالتنا في مكافحة السكري في اليمن"
                  : "Learn about our vision and mission in fighting diabetes in Yemen"}
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/F_GZYEtKaa0"
                  title="Yemen Diabetes Association Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* KPIs */}
      <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_hsl(var(--secondary)/0.15),transparent_50%)]" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("home:kpis")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {locale === "ar" 
                ? "إحصائيات ومؤشرات تأثيرنا في المجتمع"
                : "Statistics and indicators of our community impact"}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <AnimatedCard delay={0} className="text-center group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <p className="text-5xl font-bold text-primary mb-2">
                  <CountUpNumber end={getKPIValue("adults_with_diabetes")} />
                </p>
                <p className="text-muted-foreground font-medium">
                  {locale === "ar"
                    ? "بالغ مصاب بالسكري"
                    : "Adults with Diabetes"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {locale === "ar" ? "في اليمن (2024)" : "in Yemen (2024)"}
                </p>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={0.1} className="text-center group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <p className="text-5xl font-bold text-primary mb-2">
                  <CountUpNumber end={getKPIValue("adult_prevalence")} decimals={1} suffix="%" />
                </p>
                <p className="text-muted-foreground font-medium">
                  {locale === "ar"
                    ? "معدل انتشار السكري"
                    : "Adult Prevalence"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">2024</p>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={0.2} className="text-center group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <p className="text-5xl font-bold text-primary mb-2">
                  <CountUpNumber end={getKPIValue("beneficiaries") || 0} />
                </p>
                <p className="text-muted-foreground font-medium">
                  {locale === "ar" ? "المستفيدون / السنة" : "Beneficiaries / Year"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {locale === "ar" ? "سيتم التحديد" : "To be filled"}
                </p>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={0.3} className="text-center group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <p className="text-5xl font-bold text-primary mb-2">
                  <CountUpNumber end={kpis.length > 0 ? 3 : 0} />
                </p>
                <p className="text-muted-foreground font-medium">
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
        <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          <div className="container relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-3">
                  {locale === "ar" ? "برامجنا" : "Our Programs"}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {locale === "ar" ? "نقدم برامج شاملة لدعم مرضى السكري" : "Comprehensive programs to support diabetes patients"}
                </p>
              </div>
              <Button variant="outline" size="lg" asChild className="hidden md:flex border-2 hover:shadow-md">
                <Link to={`/${locale}/programs`}>
                  {locale === "ar" ? "عرض الكل" : "View All"} →
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              {programs.map((program, index) => (
                <AnimatedCard key={program.id} delay={index * 0.1} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-3">
                      {program.icon && (
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-4xl">
                          {program.icon}
                        </div>
                      )}
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                        {program.title[locale]}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                      {program.summary?.[locale]}
                    </p>
                    <Button variant="link" asChild className="p-0 text-primary font-semibold group-hover:translate-x-1 transition-transform">
                      <Link to={`/${locale}/programs/${program.slug}`}>
                        {locale === "ar" ? "اقرأ المزيد" : "Learn More"} →
                      </Link>
                    </Button>
                  </CardContent>
                </AnimatedCard>
              ))}
            </div>
            
            <div className="flex justify-center md:hidden">
              <Button variant="outline" size="lg" asChild className="border-2">
                <Link to={`/${locale}/programs`}>
                  {locale === "ar" ? "عرض جميع البرامج" : "View All Programs"} →
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Events Preview */}
      {events.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-background via-accent/5 to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_hsl(var(--accent)/0.12),transparent_60%)]" />
          <div className="container relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-3">
                  {locale === "ar" ? "الفعاليات القادمة" : "Upcoming Events"}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {locale === "ar" ? "انضم إلينا في فعالياتنا وورش العمل القادمة" : "Join us in our upcoming events and workshops"}
                </p>
              </div>
              <Button variant="outline" size="lg" asChild className="hidden md:flex border-2 hover:shadow-md">
                <Link to={`/${locale}/events`}>
                  {locale === "ar" ? "عرض الكل" : "View All"} →
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              {events.map((event, index) => (
                <AnimatedCard key={event.id} delay={index * 0.1} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      {event.title[locale]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        {new Date(event.start_at).toLocaleDateString(locale === "ar" ? "ar-YE" : "en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </div>
                      {event.city && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4 text-primary" />
                          {event.city[locale]}
                        </div>
                      )}
                    </div>
                    <Button variant="link" asChild className="p-0 text-primary font-semibold group-hover:translate-x-1 transition-transform">
                      <Link to={`/${locale}/events/${event.slug}`}>
                        {locale === "ar" ? "التفاصيل" : "Details"} →
                      </Link>
                    </Button>
                  </CardContent>
                </AnimatedCard>
              ))}
            </div>
            
            <div className="flex justify-center md:hidden">
              <Button variant="outline" size="lg" asChild className="border-2">
                <Link to={`/${locale}/events`}>
                  {locale === "ar" ? "عرض جميع الفعاليات" : "View All Events"} →
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Resources Preview */}
      {posts.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-secondary/15 via-primary/5 to-background relative overflow-hidden">
          <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-secondary/12 rounded-full blur-3xl" />
          <div className="container relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-3">
                  {locale === "ar" ? "أحدث الموارد" : "Latest Resources"}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {locale === "ar" ? "مقالات وأدلة وأخبار لدعمك" : "Articles, guides, and news to support you"}
                </p>
              </div>
              <Button variant="outline" size="lg" asChild className="hidden md:flex border-2 hover:shadow-md">
                <Link to={`/${locale}/resources`}>
                  {locale === "ar" ? "عرض الكل" : "View All"} →
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              {posts.map((post, index) => (
                <AnimatedCard key={post.id} delay={index * 0.1} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs px-3 py-1">
                        {post.type === "article" && (locale === "ar" ? "مقال" : "Article")}
                        {post.type === "guide" && (locale === "ar" ? "دليل" : "Guide")}
                        {post.type === "news" && (locale === "ar" ? "أخبار" : "News")}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      {post.title[locale]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                      {post.excerpt?.[locale]}
                    </p>
                    <Button variant="link" asChild className="p-0 text-primary font-semibold group-hover:translate-x-1 transition-transform">
                      <Link to={`/${locale}/resources/${post.slug}`}>
                        {locale === "ar" ? "اقرأ المزيد" : "Read More"} →
                      </Link>
                    </Button>
                  </CardContent>
                </AnimatedCard>
              ))}
            </div>
            
            <div className="flex justify-center md:hidden">
              <Button variant="outline" size="lg" asChild className="border-2">
                <Link to={`/${locale}/resources`}>
                  {locale === "ar" ? "عرض جميع الموارد" : "View All Resources"} →
                </Link>
              </Button>
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
            {t("home:cta")}
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
              <Link to={`/${locale}/get-involved`}>{t("common:learnMore")}</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </PublicLayout>
  );
};

export default Index;
