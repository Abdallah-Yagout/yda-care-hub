import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SmartImage } from "@/components/SmartImage";
import { Section } from "@/components/Section";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

interface Event {
  id: string;
  slug: string;
  title: any;
  summary: any;
  city: any;
  venue: any;
  start_at: string;
  end_at: string;
  capacity?: number;
  cover_url?: string;
}

const EventSkeleton = () => (
  <Card className="flex flex-col overflow-hidden">
    <Skeleton className="aspect-video w-full" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

const Events = () => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [cities, setCities] = useState<string[]>([]);
  const [months, setMonths] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("event")
        .select("*")
        .eq("status", "published")
        .gte("end_at", new Date().toISOString())
        .order("start_at");

      if (error) throw error;

      if (data) {
        setEvents(data);

        // Extract unique cities
        const uniqueCities = Array.from(
          new Set(data.map((e) => e.city?.[locale]).filter(Boolean))
        ) as string[];
        setCities(uniqueCities);

        // Extract unique months
        const uniqueMonths = Array.from(
          new Set(data.map((e) => format(new Date(e.start_at), "yyyy-MM")))
        ).map((month) => ({
          value: month,
          label: format(new Date(month + "-01"), "MMMM yyyy", {
            locale: locale === "ar" ? ar : enUS,
          }),
        }));
        setMonths(uniqueMonths);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title?.[locale]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.summary?.[locale]?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity =
      selectedCity === "all" || event.city?.[locale] === selectedCity;

    const matchesMonth =
      selectedMonth === "all" ||
      format(new Date(event.start_at), "yyyy-MM") === selectedMonth;

    return matchesSearch && matchesCity && matchesMonth;
  });

  const dateLocale = locale === "ar" ? ar : enUS;

  return (
    <PublicLayout>
      <Helmet>
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} />
        <title>{t("events:title")} | YDA</title>
        <meta name="description" content={
          locale === "ar"
            ? "تصفح فعاليات جمعية السكري اليمنية القادمة والسابقة. ورش عمل، ندوات، وحملات توعوية"
            : "Browse upcoming and past events from Yemen Diabetes Association. Workshops, seminars, and awareness campaigns"
        } />
        <link rel="canonical" href={`${window.location.origin}/${locale}/events`} />
        <link rel="alternate" hrefLang="ar" href={`${window.location.origin}/ar/events`} />
        <link rel="alternate" hrefLang="en" href={`${window.location.origin}/en/events`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${t("events:title")} | YDA`} />
        <meta property="og:description" content={
          locale === "ar"
            ? "تصفح فعاليات جمعية السكري اليمنية القادمة والسابقة"
            : "Browse upcoming and past events from Yemen Diabetes Association"
        } />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero Section */}
      <Section variant="gradient" className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("events:title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === "ar"
              ? "شارك في فعالياتنا وكن جزءاً من مجتمعنا"
              : "Join our events and be part of our community"}
          </p>
        </motion.div>
      </Section>

      {/* Filters Section */}
      <Section className="py-8 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                locale === "ar" ? "ابحث عن فعالية..." : "Search events..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <SelectValue placeholder={t("events:filterByCity")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {locale === "ar" ? "جميع المدن" : "All Cities"}
              </SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <SelectValue placeholder={t("events:filterByMonth")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {locale === "ar" ? "جميع الشهور" : "All Months"}
              </SelectItem>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      </Section>

      {/* Events Grid */}
      <Section className="pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
              <Calendar className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {locale === "ar" ? "لا توجد فعاليات" : "No events found"}
            </h3>
            <p className="text-muted-foreground">
              {locale === "ar"
                ? "جرب تغيير معايير البحث"
                : "Try adjusting your search criteria"}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="flex flex-col overflow-hidden hover-lift h-full group">
                  {event.cover_url && (
                    <div className="aspect-video overflow-hidden">
                      <SmartImage
                        src={event.cover_url}
                        alt={event.title?.[locale]}
                        aspectRatio="video"
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {event.title?.[locale]}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1">
                    {event.summary?.[locale] && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {event.summary[locale]}
                      </p>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>{format(new Date(event.start_at), "PPP", { locale: dateLocale })}</span>
                      </div>

                      {event.city?.[locale] && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span>{event.city[locale]}</span>
                        </div>
                      )}

                      {event.capacity && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4 shrink-0" />
                          <span>
                            {event.capacity}{" "}
                            {locale === "ar" ? "مقعد" : "seats"}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button asChild className="w-full btn-scale">
                      <Link to={`/${locale}/events/${event.slug}`}>
                        {locale === "ar" ? "التفاصيل" : "View Details"}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </Section>
    </PublicLayout>
  );
};

export default Events;
