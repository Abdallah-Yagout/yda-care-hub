import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { locale } = useLocale();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PublicLayout>
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <div className="container max-w-2xl">
          <Card className="border-2">
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-6">
                {/* 404 Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="text-9xl font-bold text-primary/10">404</div>
                    <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-muted-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {locale === "ar" ? "الصفحة غير موجودة" : "Page Not Found"}
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    {locale === "ar"
                      ? "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها"
                      : "Sorry, the page you're looking for doesn't exist or has been moved"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Button asChild size="lg">
                    <Link to={`/${locale}`}>
                      <Home className="h-4 w-4 mr-2" />
                      {locale === "ar" ? "العودة للرئيسية" : "Back to Home"}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" onClick={() => window.history.back()}>
                    <button>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {locale === "ar" ? "رجوع" : "Go Back"}
                    </button>
                  </Button>
                </div>

                {/* Helpful Links */}
                <div className="pt-8 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    {locale === "ar" ? "قد يهمك أيضاً:" : "You might be interested in:"}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button asChild variant="link" size="sm">
                      <Link to={`/${locale}/programs`}>
                        {locale === "ar" ? "البرامج" : "Programs"}
                      </Link>
                    </Button>
                    <Button asChild variant="link" size="sm">
                      <Link to={`/${locale}/events`}>
                        {locale === "ar" ? "الفعاليات" : "Events"}
                      </Link>
                    </Button>
                    <Button asChild variant="link" size="sm">
                      <Link to={`/${locale}/resources`}>
                        {locale === "ar" ? "الموارد" : "Resources"}
                      </Link>
                    </Button>
                    <Button asChild variant="link" size="sm">
                      <Link to={`/${locale}/contact`}>
                        {locale === "ar" ? "اتصل بنا" : "Contact Us"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};

export default NotFound;
