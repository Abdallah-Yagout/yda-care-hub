import { Link } from "react-router-dom";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Globe, Home, Calendar, BookOpen, FileText, Users, Mail } from "lucide-react";
import logo from "@/assets/logo.png";

export const Header = () => {
  const { locale, switchLocale } = useLocale();
  const { t } = useTranslation();

  const navItems = [
    { label: t("nav.home"), path: `/${locale}`, icon: Home },
    { label: t("nav.programs"), path: `/${locale}/programs`, icon: BookOpen },
    { label: t("nav.events"), path: `/${locale}/events`, icon: Calendar },
    { label: t("nav.resources"), path: `/${locale}/resources`, icon: FileText },
    { label: t("nav.getInvolved"), path: `/${locale}/get-involved`, icon: Users },
    { label: t("nav.contact"), path: `/${locale}/contact`, icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to={`/${locale}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Yemen Diabetes Association" className="h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm font-medium transition-all duration-200 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => switchLocale(locale === "ar" ? "en" : "ar")}
          className="gap-2"
        >
          <Globe className="h-4 w-4" />
          {locale === "ar" ? "EN" : "ع"}
        </Button>
      </div>
    </header>
  );
};
