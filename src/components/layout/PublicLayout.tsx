import { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  const { locale } = useParams<{ locale: string }>();
  const { t, i18n } = useTranslation();

  const toggleLocale = () => {
    const newLocale = i18n.language === "ar" ? "en" : "ar";
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPath;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to={`/${locale}`} className="font-bold text-xl">
            YDA
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to={`/${locale}`} className="text-sm font-medium hover:text-primary">
              {t('nav.home')}
            </Link>
            <Link to={`/${locale}/programs`} className="text-sm font-medium hover:text-primary">
              {t('nav.programs')}
            </Link>
            <Link to={`/${locale}/events`} className="text-sm font-medium hover:text-primary">
              {t('nav.events')}
            </Link>
            <Link to={`/${locale}/resources`} className="text-sm font-medium hover:text-primary">
              {t('nav.resources')}
            </Link>
            <Link to={`/${locale}/get-involved`} className="text-sm font-medium hover:text-primary">
              {t('nav.getInvolved')}
            </Link>
            <Link to={`/${locale}/contact`} className="text-sm font-medium hover:text-primary">
              {t('nav.contact')}
            </Link>
          </nav>

          <Button variant="ghost" size="icon" onClick={toggleLocale}>
            <Globe className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-auto">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">
                {i18n.language === "ar" ? "جمعية السكري اليمنية" : "Yemen Diabetes Association"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {i18n.language === "ar" 
                  ? "نعمل معاً من أجل مستقبل خالٍ من مضاعفات السكري في اليمن"
                  : "Working together for a future free from diabetes complications in Yemen"}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('nav.contact')}</h4>
              <p className="text-sm text-muted-foreground">
                {i18n.language === "ar" ? "البريد الإلكتروني" : "Email"}: info@yda-yemen.org
              </p>
              <p className="text-sm text-muted-foreground">
                {i18n.language === "ar" ? "الهاتف" : "Phone"}: +967 1 234567
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">
                {i18n.language === "ar" ? "روابط سريعة" : "Quick Links"}
              </h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link to={`/${locale}/programs`} className="text-muted-foreground hover:text-primary">
                  {t('nav.programs')}
                </Link>
                <Link to={`/${locale}/events`} className="text-muted-foreground hover:text-primary">
                  {t('nav.events')}
                </Link>
                <Link to={`/${locale}/resources`} className="text-muted-foreground hover:text-primary">
                  {t('nav.resources')}
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
            © 2024 Yemen Diabetes Association. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
