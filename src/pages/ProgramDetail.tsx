import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const ProgramDetail = () => {
  const { locale, slug } = useParams<{ locale: string; slug: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">Program: {slug}</h1>
    </div>
  );
};

export default ProgramDetail;
