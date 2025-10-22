import { Link } from "react-router-dom";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";

export const Header = () => {
  const { locale, switchLocale } = useLocale();
  const { t } = useTranslation();

  const navItems = [
    { label: t("nav.home"), path: `/${locale}` },
    { label: t("nav.programs"), path: `/${locale}/programs` },
    { label: t("nav.events"), path: `/${locale}/events` },
    { label: t("nav.resources"), path: `/${locale}/resources` },
    { label: t("nav.getInvolved"), path: `/${locale}/get-involved` },
    { label: t("nav.contact"), path: `/${locale}/contact` },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to={`/${locale}`} className="font-bold text-lg">
          {t("nav.home")}
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
