import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const GetInvolved = () => {
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
        <title>{t('nav.getInvolved')} | YDA</title>
      </Helmet>
      
      <div className="min-h-screen p-8">
        <h1 className="text-4xl font-bold">{t('nav.getInvolved')}</h1>
      </div>
    </>
  );
};

export default GetInvolved;
