import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, MapPin, Clock, Users, ExternalLink, Download } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Event {
  id: string;
  slug: string;
  title: any;
  summary: any;
  body: any;
  city: any;
  venue: any;
  start_at: string;
  end_at: string;
  capacity?: number;
  cover_url?: string;
  gallery?: any;
  external_url?: string;
}

const registrationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Phone number is required"),
  notes: z.string().optional(),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

const EventDetail = () => {
  const { locale, slug } = useParams<{ locale: string; slug: string }>();
  const { locale: currentLocale } = useLocale();
  const { t } = useTranslation();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
  });

  useEffect(() => {
    if (slug) loadEvent();
  }, [slug]);

  const loadEvent = async () => {
    try {
      const { data, error } = await supabase
        .from("event")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error("Error loading event:", error);
      toast.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: RegistrationForm) => {
    if (!event) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("submission").insert({
        form_type: "event-register",
        data: {
          event_id: event.id,
          event_slug: event.slug,
          event_title: event.title[currentLocale],
          ...data,
        },
      });

      if (error) throw error;

      toast.success(t("events.registered"));
      reset();
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast.error(t("common.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const generateICS = () => {
    if (!event) return;

    const startDate = new Date(event.start_at);
    const endDate = new Date(event.end_at);

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YDA//Event//EN
BEGIN:VEVENT
UID:${event.id}@yda-yemen.org
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${event.title[currentLocale]}
DESCRIPTION:${event.summary?.[currentLocale] || ""}
LOCATION:${event.venue?.[currentLocale] || ""}, ${event.city?.[currentLocale] || ""}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.slug}.ics`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getGoogleCalendarUrl = () => {
    if (!event) return "#";

    const startDate = new Date(event.start_at);
    const endDate = new Date(event.end_at);

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title[currentLocale],
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: event.summary?.[currentLocale] || "",
      location: `${event.venue?.[currentLocale] || ""}, ${event.city?.[currentLocale] || ""}`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
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

  if (!event) {
    return (
      <PublicLayout>
        <div className="container py-12 text-center">
          <p className="mb-4">
            {currentLocale === "ar" ? "الفعالية غير موجودة" : "Event not found"}
          </p>
          <Button asChild>
            <Link to={`/${currentLocale}/events`}>
              {currentLocale === "ar" ? "العودة للفعاليات" : "Back to Events"}
            </Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const dateLocale = currentLocale === "ar" ? ar : enUS;

  return (
    <PublicLayout>
      <Helmet>
        <title>{event.title[currentLocale]} | YDA</title>
        <meta name="description" content={event.summary?.[currentLocale]} />
      </Helmet>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {event.cover_url && (
              <img
                src={event.cover_url}
                alt={event.title[currentLocale]}
                className="w-full aspect-video object-cover rounded-lg"
              />
            )}

            <div>
              <h1 className="text-4xl font-bold mb-4">
                {event.title[currentLocale]}
              </h1>
              {event.summary?.[currentLocale] && (
                <p className="text-xl text-muted-foreground mb-6">
                  {event.summary[currentLocale]}
                </p>
              )}
            </div>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentLocale === "ar" ? "تفاصيل الفعالية" : "Event Details"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {format(new Date(event.start_at), "PPP", {
                        locale: dateLocale,
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.start_at), "p", {
                        locale: dateLocale,
                      })}{" "}
                      -{" "}
                      {format(new Date(event.end_at), "p", {
                        locale: dateLocale,
                      })}
                    </p>
                  </div>
                </div>

                {event.venue?.[currentLocale] && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{event.venue[currentLocale]}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.city?.[currentLocale]}
                      </p>
                    </div>
                  </div>
                )}

                {event.capacity && (
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <p>
                      {currentLocale === "ar" ? "السعة:" : "Capacity:"}{" "}
                      {event.capacity}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add to Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>{t("events.addToCalendar")}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button onClick={generateICS} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  {currentLocale === "ar" ? "تنزيل ICS" : "Download ICS"}
                </Button>
                <Button asChild variant="outline">
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Google Calendar
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Event Body */}
            {event.body?.[currentLocale] && (
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <p>{event.body[currentLocale]}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* External Link */}
            {event.external_url && (
              <Button asChild variant="outline" className="w-full">
                <a
                  href={event.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {currentLocale === "ar" ? "رابط خارجي" : "External Link"}
                </a>
              </Button>
            )}
          </div>

          {/* Registration Form */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>{t("events.register")}</CardTitle>
                <CardDescription>
                  {currentLocale === "ar"
                    ? "سجل للمشاركة في هذه الفعالية"
                    : "Register to participate in this event"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">
                      {currentLocale === "ar" ? "الاسم" : "Name"}
                    </Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">
                      {currentLocale === "ar"
                        ? "البريد الإلكتروني"
                        : "Email"}
                    </Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">
                      {currentLocale === "ar" ? "رقم الهاتف" : "Phone"}
                    </Label>
                    <Input id="phone" type="tel" {...register("phone")} />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="notes">
                      {currentLocale === "ar" ? "ملاحظات (اختياري)" : "Notes (optional)"}
                    </Label>
                    <Textarea id="notes" {...register("notes")} rows={3} />
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting
                      ? t("common.loading")
                      : t("events.register")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default EventDetail;
