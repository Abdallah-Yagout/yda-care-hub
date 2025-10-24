import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Calendar, MapPin, Users, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";

interface EventMetaProps {
  startAt: string;
  endAt: string;
  venue?: { ar?: string; en?: string };
  city?: { ar?: string; en?: string };
  capacity?: number;
  eventId: string;
  eventTitle: { ar: string; en: string };
  eventSlug: string;
  className?: string;
}

export const EventMeta = ({
  startAt,
  endAt,
  venue,
  city,
  capacity,
  eventId,
  eventTitle,
  eventSlug,
  className,
}: EventMetaProps) => {
  const { locale } = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;

  const generateICS = () => {
    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YDA//Event//EN
BEGIN:VEVENT
UID:${eventId}@yda-yemen.org
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${eventTitle[locale]}
LOCATION:${venue?.[locale] || ""}, ${city?.[locale] || ""}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${eventSlug}.ics`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getGoogleCalendarUrl = () => {
    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: eventTitle[locale],
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: eventTitle[locale],
      location: `${venue?.[locale] || ""}, ${city?.[locale] || ""}`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <Card className={cn("sticky top-20", className)}>
      <CardContent className="pt-6 space-y-4">
        {/* Date & Time */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-muted-foreground mb-1">
              {locale === "ar" ? "التاريخ والوقت" : "Date & Time"}
            </p>
            <p className="font-medium">
              {format(new Date(startAt), "PPP", { locale: dateLocale })}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(startAt), "p", { locale: dateLocale })} -{" "}
              {format(new Date(endAt), "p", { locale: dateLocale })}
            </p>
          </div>
        </div>

        {/* Location */}
        {venue?.[locale] && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent/10 shrink-0">
              <MapPin className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-muted-foreground mb-1">
                {locale === "ar" ? "المكان" : "Venue"}
              </p>
              <p className="font-medium">{venue[locale]}</p>
              {city?.[locale] && (
                <p className="text-sm text-muted-foreground">{city[locale]}</p>
              )}
            </div>
          </div>
        )}

        {/* Capacity */}
        {capacity && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-secondary/10 shrink-0">
              <Users className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-muted-foreground mb-1">
                {locale === "ar" ? "السعة" : "Capacity"}
              </p>
              <p className="font-medium">
                {capacity} {locale === "ar" ? "شخص" : "attendees"}
              </p>
            </div>
          </div>
        )}

        {/* Calendar Actions */}
        <div className="pt-4 border-t space-y-2">
          <p className="font-semibold text-sm text-muted-foreground mb-3">
            {locale === "ar" ? "إضافة للتقويم" : "Add to Calendar"}
          </p>
          
          <Button
            variant="outline"
            className="w-full justify-start hover-lift"
            onClick={generateICS}
          >
            <Download className={cn("h-4 w-4", locale === "ar" ? "ml-2" : "mr-2")} />
            {locale === "ar" ? "تنزيل ICS" : "Download ICS"}
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start hover-lift"
            asChild
          >
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className={cn("h-4 w-4", locale === "ar" ? "ml-2" : "mr-2")} />
              Google Calendar
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
