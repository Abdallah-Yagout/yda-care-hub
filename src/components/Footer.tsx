import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/use-locale";
import { Facebook, Twitter, Youtube } from "lucide-react";

export const Footer = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{t("nav.home")}</h3>
            <p className="text-sm text-muted-foreground">
              {locale === "ar"
                ? "جمعية السكري اليمنية - نعمل معاً من أجل مستقبل خالٍ من مضاعفات السكري"
                : "Yemen Diabetes Association - Working together for a diabetes-free future"}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t("contact.title")}</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>info@yda-yemen.org</p>
              <p>+967 1 234567</p>
              <p>{locale === "ar" ? "صنعاء، اليمن" : "Sana'a, Yemen"}</p>
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
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/yda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@yda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
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
