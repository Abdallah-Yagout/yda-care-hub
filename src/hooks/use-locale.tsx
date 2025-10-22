import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export const useLocale = () => {
  const { locale } = useParams<{ locale: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const validLocales = ["ar", "en"];
    const currentLocale = locale || "ar";

    if (!validLocales.includes(currentLocale)) {
      navigate("/ar", { replace: true });
      return;
    }

    if (i18n.language !== currentLocale) {
      i18n.changeLanguage(currentLocale);
    }
  }, [locale, i18n, navigate]);

  const switchLocale = (newLocale: "ar" | "en") => {
    const path = window.location.pathname;
    const newPath = path.replace(`/${locale}`, `/${newLocale}`);
    navigate(newPath);
  };

  return {
    locale: (locale as "ar" | "en") || "ar",
    switchLocale,
    isRTL: (locale || "ar") === "ar",
  };
};
