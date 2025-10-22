import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact = () => {
  const { locale } = useLocale();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      const { error } = await supabase.from("submission").insert({
        form_type: "contact",
        data,
      });

      if (error) throw error;

      toast.success(t("contact.success"));
      reset();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error(t("common.error"));
    }
  };

  return (
    <PublicLayout>
      <Helmet>
        <title>{t("contact.title")} | YDA</title>
      </Helmet>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">{t("contact.title")}</h1>
            <p className="text-xl text-muted-foreground mb-8">
              {locale === "ar"
                ? "نحن هنا للإجابة على أسئلتكم ومساعدتكم"
                : "We're here to answer your questions and help you"}
            </p>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href="mailto:info@yda-yemen.org"
                    className="text-primary hover:underline"
                  >
                    info@yda-yemen.org
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    {locale === "ar" ? "الهاتف" : "Phone"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a href="tel:+96712345678" className="text-primary hover:underline">
                    +967 1 234567
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {locale === "ar" ? "العنوان" : "Address"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{locale === "ar" ? "صنعاء، اليمن" : "Sana'a, Yemen"}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {locale === "ar"
                      ? "السبت - الخميس: 8:00 ص - 4:00 م"
                      : "Saturday - Thursday: 8:00 AM - 4:00 PM"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{locale === "ar" ? "أرسل رسالة" : "Send a Message"}</CardTitle>
              <CardDescription>
                {locale === "ar"
                  ? "املأ النموذج وسنتواصل معك قريباً"
                  : "Fill out the form and we'll get back to you soon"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t("contact.name")}</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">{t("contact.email")}</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">
                    {locale === "ar" ? "رقم الهاتف (اختياري)" : "Phone (optional)"}
                  </Label>
                  <Input id="phone" type="tel" {...register("phone")} />
                </div>

                <div>
                  <Label htmlFor="message">{t("contact.message")}</Label>
                  <Textarea id="message" {...register("message")} rows={5} />
                  {errors.message && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("common.loading") : t("contact.send")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Contact;
