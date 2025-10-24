import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";

interface CtaBandProps {
  title?: { ar: string; en: string };
  subtitle?: { ar: string; en: string };
  primaryCta?: {
    label: { ar: string; en: string };
    href: string;
  };
  secondaryCta?: {
    label: { ar: string; en: string };
    href: string;
  };
  variant?: "default" | "gradient" | "minimal";
  className?: string;
}

export const CtaBand = ({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  variant = "default",
  className,
}: CtaBandProps) => {
  const { locale } = useLocale();

  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    gradient: "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer text-white",
    minimal: "bg-muted/50 backdrop-blur-sm border border-border",
  };

  const defaultTitle = {
    ar: "انضم إلينا اليوم",
    en: "Join Us Today",
  };

  const defaultSubtitle = {
    ar: "كن جزءاً من مجتمعنا واصنع الفرق",
    en: "Be part of our community and make a difference",
  };

  const defaultPrimaryCta = {
    label: { ar: "تطوّع معنا", en: "Volunteer" },
    href: `/${locale}/get-involved`,
  };

  const defaultSecondaryCta = {
    label: { ar: "اتصل بنا", en: "Contact Us" },
    href: `/${locale}/contact`,
  };

  return (
    <section className={cn("relative py-16 md:py-24 overflow-hidden", variantClasses[variant], className)}>
      {/* Background decoration */}
      {variant === "gradient" && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
      )}

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-6"
          >
            <Heart className="h-8 w-8 text-white fill-white" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            {(title || defaultTitle)[locale]}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={cn(
              "text-lg md:text-xl mb-8 max-w-2xl mx-auto",
              variant === "minimal" ? "text-muted-foreground" : "text-white/90"
            )}
          >
            {(subtitle || defaultSubtitle)[locale]}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              variant={variant === "minimal" ? "default" : "secondary"}
              className={cn(
                "shadow-lg hover:shadow-xl transition-all duration-300",
                "hover:-translate-y-1"
              )}
            >
              <Link to={(primaryCta || defaultPrimaryCta).href}>
                {(primaryCta || defaultPrimaryCta).label[locale]}
                <ArrowRight className={cn("h-5 w-5", locale === "ar" ? "mr-2" : "ml-2")} />
              </Link>
            </Button>

            {secondaryCta && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className={cn(
                  "transition-all duration-300",
                  variant === "minimal" 
                    ? "border-border hover:bg-muted" 
                    : "border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                )}
              >
                <Link to={secondaryCta.href}>
                  {secondaryCta.label[locale]}
                </Link>
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
