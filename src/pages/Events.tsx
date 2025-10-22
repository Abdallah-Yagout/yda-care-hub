import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
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

const Events = () => {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [cities, setCities] = useState<string[]>([]);

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

    return matchesSearch && matchesCity;
  });

  const dateLocale = locale === "ar" ? ar : enUS;

  return (
    <PublicLayout>
      <Helmet>
        <title>{t("events.title")} | YDA</title>
        <meta
          name="description"
          content={
            locale === "ar"
              ? "تصفح فعاليات جمعية السكري اليمنية القادمة"
              : "Browse upcoming Yemen Diabetes Association events"
          }
        />
      </Helmet>

      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">{t("events.title")}</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Input
            placeholder={t("common.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger>
              <SelectValue placeholder={t("events.filterByCity")} />
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
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p>{t("common.loading")}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {locale === "ar" ? "لا توجد فعاليات" : "No events found"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="flex flex-col">
                {event.cover_url && (
                  <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                    <img
                      src={event.cover_url}
                      alt={event.title?.[locale]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    {event.title?.[locale]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  {event.summary?.[locale] && (
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {event.summary[locale]}
                    </p>
                  )}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(event.start_at), "PPP", {
                          locale: dateLocale,
                        })}
                      </span>
                    </div>
                    {event.city?.[locale] && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.city[locale]}</span>
                      </div>
                    )}
                    {event.capacity && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {locale === "ar" ? "السعة:" : "Capacity:"}{" "}
                          {event.capacity}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/${locale}/events/${event.slug}`}>
                      {t("common.readMore")}
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

export default Events;
