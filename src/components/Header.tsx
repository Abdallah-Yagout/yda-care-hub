import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Globe, Home, Calendar, BookOpen, FileText, Users, Mail, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

export const Header = () => {
  const { locale, switchLocale } = useLocale();
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t("nav.home"), path: `/${locale}`, icon: Home },
    { label: t("nav.programs"), path: `/${locale}/programs`, icon: BookOpen },
    { label: t("nav.events"), path: `/${locale}/events`, icon: Calendar },
    { label: t("nav.resources"), path: `/${locale}/resources`, icon: FileText },
    { label: t("nav.getInvolved"), path: `/${locale}/get-involved`, icon: Users },
    { label: t("nav.contact"), path: `/${locale}/contact`, icon: Mail },
  ];

  const isActiveRoute = (path: string) => {
    if (path === `/${locale}`) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link 
          to={`/${locale}`} 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
        >
          <img src={logo} alt="Yemen Diabetes Association" className="h-10 w-auto md:h-12" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 relative",
                isActiveRoute(item.path)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Language Switcher */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => switchLocale(locale === "ar" ? "en" : "ar")}
          className="gap-2 hidden lg:flex"
        >
          <Globe className="h-4 w-4" />
          {locale === "ar" ? "EN" : "ع"}
        </Button>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Language Switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => switchLocale(locale === "ar" ? "en" : "ar")}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            {locale === "ar" ? "EN" : "ع"}
          </Button>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={locale === "ar" ? "left" : "right"} className="w-72">
              <div className="flex flex-col gap-6 mt-8">
                <div className="flex items-center gap-2 pb-4 border-b">
                  <img src={logo} alt="Yemen Diabetes Association" className="h-10 w-auto" />
                </div>
                
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                          isActiveRoute(item.path)
                            ? "text-primary bg-primary/10"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
