import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/use-locale";
import { Facebook, Twitter, Youtube, Heart, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <h3 className="font-bold text-lg">{t("nav.home")}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {locale === "ar"
                ? "جمعية السكري اليمنية - نعمل معاً من أجل مستقبل خالٍ من مضاعفات السكري"
                : "Yemen Diabetes Association - Working together for a diabetes-free future"}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t("contact.title")}</h3>
            <div className="text-sm text-muted-foreground space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <p>info@yda-yemen.org</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <p>+967 1 234567</p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <p>{locale === "ar" ? "صنعاء، اليمن" : "Sana'a, Yemen"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">
              {locale === "ar" ? "تابعنا" : "Follow Us"}
            </h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/yda"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/yda"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@yda"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Yemen Diabetes Association. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
