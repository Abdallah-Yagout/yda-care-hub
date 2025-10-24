import { useState } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
  withPlaceholder?: boolean;
  sizes?: string;
  srcSet?: string;
}

export const SmartImage = ({
  src,
  alt,
  aspectRatio = "landscape",
  withPlaceholder = true,
  className,
  sizes,
  srcSet,
  ...props
}: SmartImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground rounded-lg",
          aspectClasses[aspectRatio],
          className
        )}
        role="img"
        aria-label={alt}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg", aspectClasses[aspectRatio], className)}>
      {/* Shimmer placeholder */}
      {withPlaceholder && !isLoaded && (
        <div className="absolute inset-0 shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />
      )}
      
      {/* Main image */}
      <img
        src={src}
        alt={alt}
        srcSet={srcSet}
        sizes={sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          "h-full w-full object-cover transition-all duration-500 ease-out",
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        )}
        {...props}
      />
    </div>
  );
};
