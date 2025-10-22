import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const Events = () => {
  const { locale } = useParams<{ locale: string }>();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return (
    <>
      <Helmet>
        <title>{t('events.title')} | YDA</title>
      </Helmet>
      
      <div className="min-h-screen p-8">
        <h1 className="text-4xl font-bold">{t('events.title')}</h1>
      </div>
    </>
  );
};

export default Events;
