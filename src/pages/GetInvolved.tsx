import { Helmet } from "react-helmet-async";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, Users, Handshake } from "lucide-react";

const volunteerSchema = z.object({
  name: z.string().min(2, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email").max(255, "Email too long"),
  phone: z.string().min(6, "Phone number is required").max(20, "Phone too long").regex(/^\+?[0-9\s-]+$/, "Invalid phone format"),
  skills: z.string().min(10, "Please describe your skills").max(1000, "Skills description too long"),
  availability: z.string().max(500, "Availability description too long").optional(),
});

type VolunteerForm = z.infer<typeof volunteerSchema>;

const GetInvolved = () => {
  const { locale } = useLocale();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerForm>({
    resolver: zodResolver(volunteerSchema),
  });

  const onSubmit = async (data: VolunteerForm) => {
    try {
      const { error } = await supabase.from("submission").insert({
        form_type: "volunteer",
        data,
      });

      if (error) throw error;

      toast.success(
        locale === "ar"
          ? "شكراً لك! سنتواصل معك قريباً"
          : "Thank you! We'll be in touch soon"
      );
      reset();
    } catch (error) {
      console.error("Error submitting volunteer form:", error);
      toast.error(t("common.error"));
    }
  };

  const seoTitle = locale === "ar" ? "شارك معنا" : "Get Involved";
  const seoDescription = locale === "ar"
    ? "انضم إلينا في مكافحة مرض السكري في اليمن. تطوع، تبرع، أو كن شريكاً استراتيجياً"
    : "Join us in the fight against diabetes in Yemen. Volunteer, donate, or become a strategic partner";

  return (
    <PublicLayout>
      <Helmet>
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} />
        <title>{seoTitle} | YDA</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={`${window.location.origin}/${locale}/get-involved`} />
        <link rel="alternate" hrefLang="ar" href={`${window.location.origin}/ar/get-involved`} />
        <link rel="alternate" hrefLang="en" href={`${window.location.origin}/en/get-involved`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${seoTitle} | YDA`} />
        <meta property="og:description" content={seoDescription} />
        <meta name="twitter:card" content="summary" />
      </Helmet>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">
            {t("nav.getInvolved")}
          </h1>
          <p className="text-xl text-muted-foreground mb-12 text-center">
            {locale === "ar"
              ? "انضم إلينا في مكافحة مرض السكري في اليمن"
              : "Join us in the fight against diabetes in Yemen"}
          </p>

          <Tabs defaultValue="volunteer" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="volunteer">
                <Users className="h-4 w-4 mr-2" />
                {locale === "ar" ? "التطوع" : "Volunteer"}
              </TabsTrigger>
              <TabsTrigger value="donate">
                <Heart className="h-4 w-4 mr-2" />
                {locale === "ar" ? "التبرع" : "Donate"}
              </TabsTrigger>
              <TabsTrigger value="partner">
                <Handshake className="h-4 w-4 mr-2" />
                {locale === "ar" ? "الشراكة" : "Partner"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="volunteer">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {locale === "ar" ? "كن متطوعاً" : "Become a Volunteer"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "ar"
                      ? "شارك بوقتك ومهاراتك لدعم مرضى السكري"
                      : "Share your time and skills to support diabetes patients"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="name">
                        {locale === "ar" ? "الاسم الكامل" : "Full Name"}
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
                        {locale === "ar" ? "البريد الإلكتروني" : "Email"}
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
                        {locale === "ar" ? "رقم الهاتف" : "Phone"}
                      </Label>
                      <Input id="phone" type="tel" {...register("phone")} />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="skills">
                        {locale === "ar"
                          ? "المهارات والخبرات"
                          : "Skills & Experience"}
                      </Label>
                      <Textarea id="skills" {...register("skills")} rows={4} />
                      {errors.skills && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.skills.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="availability">
                        {locale === "ar" ? "الوقت المتاح" : "Availability"}
                      </Label>
                      <Textarea
                        id="availability"
                        {...register("availability")}
                        rows={3}
                        placeholder={
                          locale === "ar"
                            ? "مثال: أيام السبت والثلاثاء مساءً"
                            : "e.g., Saturdays and Tuesday evenings"
                        }
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? t("common.loading") : locale === "ar" ? "إرسال الطلب" : "Submit Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="donate">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {locale === "ar" ? "تبرع الآن" : "Donate Now"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "ar"
                      ? "دعمكم المالي يساعدنا على تقديم خدمات أفضل"
                      : "Your financial support helps us provide better services"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose max-w-none">
                    <p>
                      {locale === "ar"
                        ? "تبرعاتكم تساعدنا في توفير الفحوصات المجانية، البرامج التثقيفية، والدعم للمرضى. كل مساهمة تحدث فرقاً."
                        : "Your donations help us provide free screenings, educational programs, and patient support. Every contribution makes a difference."}
                    </p>
                    <h3>
                      {locale === "ar" ? "طرق التبرع:" : "Ways to Donate:"}
                    </h3>
                    <ul>
                      <li>
                        {locale === "ar"
                          ? "تحويل بنكي: [معلومات الحساب البنكي]"
                          : "Bank Transfer: [Bank account details]"}
                      </li>
                      <li>
                        {locale === "ar"
                          ? "زيارة مقرنا الرئيسي في صنعاء"
                          : "Visit our main office in Sana'a"}
                      </li>
                      <li>
                        {locale === "ar"
                          ? "اتصل بنا: +967 1 234567"
                          : "Call us: +967 1 234567"}
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="partner">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {locale === "ar" ? "كن شريكاً" : "Become a Partner"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "ar"
                      ? "نبحث عن شراكات استراتيجية لتوسيع تأثيرنا"
                      : "We're looking for strategic partnerships to expand our impact"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose max-w-none">
                    <p>
                      {locale === "ar"
                        ? "نرحب بالشراكات مع المنظمات، الشركات، والمؤسسات الصحية لتوسيع نطاق خدماتنا وتحسين جودة الرعاية لمرضى السكري في اليمن."
                        : "We welcome partnerships with organizations, companies, and healthcare institutions to expand our services and improve care quality for diabetes patients in Yemen."}
                    </p>
                    <h3>
                      {locale === "ar" ? "فرص الشراكة:" : "Partnership Opportunities:"}
                    </h3>
                    <ul>
                      <li>
                        {locale === "ar"
                          ? "برامج الفحص المبكر المشتركة"
                          : "Joint early screening programs"}
                      </li>
                      <li>
                        {locale === "ar"
                          ? "حملات التوعية والتثقيف"
                          : "Awareness and education campaigns"}
                      </li>
                      <li>
                        {locale === "ar"
                          ? "البحث والتطوير"
                          : "Research and development"}
                      </li>
                      <li>
                        {locale === "ar"
                          ? "التدريب وبناء القدرات"
                          : "Training and capacity building"}
                      </li>
                    </ul>
                    <p>
                      {locale === "ar"
                        ? "للاستفسار عن فرص الشراكة، يرجى التواصل معنا عبر:"
                        : "To inquire about partnership opportunities, please contact us at:"}
                    </p>
                    <p>
                      <strong>Email:</strong> partnerships@yda-yemen.org<br />
                      <strong>{locale === "ar" ? "هاتف:" : "Phone"}:</strong> +967 1 234567
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PublicLayout>
  );
};

export default GetInvolved;
