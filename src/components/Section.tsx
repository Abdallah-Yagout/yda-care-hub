import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  variant?: "default" | "muted" | "gradient" | "dark";
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}

export const Section = ({
  children,
  title,
  subtitle,
  variant = "default",
  className,
  containerClassName,
  animate = true,
}: SectionProps) => {
  const variantClasses = {
    default: "bg-background",
    muted: "bg-muted/30",
    gradient: "bg-gradient-to-br from-background via-muted/20 to-background",
    dark: "bg-gradient-to-br from-primary/5 to-accent/5",
  };

  const SectionWrapper = animate ? motion.section : "section";
  const HeaderWrapper = animate ? motion.div : "div";

  return (
    <SectionWrapper
      className={cn(
        "py-16 md:py-24 lg:py-32 relative overflow-hidden",
        variantClasses[variant],
        className
      )}
      {...(animate && {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.6 },
      })}
    >
      {/* Decorative background elements */}
      {variant === "gradient" && (
        <>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className={cn("container relative z-10", containerClassName)}>
        {/* Section header */}
        {(title || subtitle) && (
          <HeaderWrapper
            className="text-center mb-12 md:mb-16"
            {...(animate && {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.6, delay: 0.2 },
            })}
          >
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </HeaderWrapper>
        )}

        {/* Section content */}
        {children}
      </div>
    </SectionWrapper>
  );
};
