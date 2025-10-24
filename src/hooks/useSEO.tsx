import { Helmet } from "react-helmet-async";
import { useLocale } from "./use-locale";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  type?: "website" | "article";
}

export const useSEO = ({
  title,
  description,
  image = "/logo.png",
  article = false,
  publishedTime,
  modifiedTime,
  author,
  type = "website",
}: SEOProps) => {
  const { locale } = useLocale();
  const baseUrl = window.location.origin;
  const currentPath = window.location.pathname;
  const canonicalUrl = `${baseUrl}${currentPath}`;
  
  // Build alternate URL for other locale
  const alternateLocale = locale === "ar" ? "en" : "ar";
  const alternatePath = currentPath.replace(`/${locale}`, `/${alternateLocale}`);
  const alternateUrl = `${baseUrl}${alternatePath}`;

  const fullTitle = `${title} | Yemen Diabetes Association`;
  const imageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Canonical & Hreflang */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="ar" href={`${baseUrl}${currentPath.replace(`/${locale}`, "/ar")}`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}${currentPath.replace(`/${locale}`, "/en")}`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${currentPath.replace(`/${locale}`, "/ar")}`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? "article" : type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={locale === "ar" ? "ar_YE" : "en_US"} />
      <meta property="og:locale:alternate" content={alternateLocale === "ar" ? "ar_YE" : "en_US"} />
      <meta property="og:site_name" content="Yemen Diabetes Association" />

      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {article && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {article && author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Additional Meta */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    </Helmet>
  );
};
