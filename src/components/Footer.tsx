import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/use-locale";
import { Facebook, Twitter, Youtube, Heart, Mail, Phone, MapPin, Home, Calendar, BookOpen, FileText } from "lucide-react";

export const Footer = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();

  const quickLinks = [
    { label: t("nav.home"), path: `/${locale}`, icon: Home },
    { label: t("nav.programs"), path: `/${locale}/programs`, icon: BookOpen },
    { label: t("nav.events"), path: `/${locale}/events`, icon: Calendar },
    { label: t("nav.resources"), path: `/${locale}/resources`, icon: FileText },
  ];

  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/30">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary fill-primary" />
              </div>
              <h3 className="font-bold text-lg">
                {locale === "ar" ? "جمعية السكري اليمنية" : "Yemen Diabetes Association"}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {locale === "ar"
                ? "نعمل معاً من أجل مستقبل خالٍ من مضاعفات السكري"
                : "Working together for a diabetes-free future"}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              {locale === "ar" ? "روابط سريعة" : "Quick Links"}
            </h3>
            <nav className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("contact.title")}</h3>
            <div className="text-sm text-muted-foreground space-y-3">
              <a
                href="mailto:info@yda-yemen.org"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span>info@yda-yemen.org</span>
              </a>
              <a
                href="tel:+9671234567"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span>+967 1 234567</span>
              </a>
              <div className="flex items-start gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span>{locale === "ar" ? "صنعاء، اليمن" : "Sana'a, Yemen"}</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              {locale === "ar" ? "تابعنا" : "Follow Us"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {locale === "ar"
                ? "تواصل معنا على وسائل التواصل الاجتماعي"
                : "Stay connected with us on social media"}
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/yda"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/yda"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@yda"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {locale === "ar" ? "جمعية السكري اليمنية" : "Yemen Diabetes Association"}.{" "}
              {locale === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}.
            </p>
            <div className="flex gap-6">
              <Link to={`/${locale}/contact`} className="hover:text-primary transition-colors">
                {locale === "ar" ? "اتصل بنا" : "Contact"}
              </Link>
              <Link to={`/${locale}/get-involved`} className="hover:text-primary transition-colors">
                {locale === "ar" ? "انضم إلينا" : "Get Involved"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
