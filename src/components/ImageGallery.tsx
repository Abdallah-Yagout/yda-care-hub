import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartImage } from "./SmartImage";

interface ImageGalleryProps {
  images: { url: string; alt?: string }[];
  className?: string;
}

export const ImageGallery = ({ images, className }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "Escape") setIsOpen(false);
  };

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
      {images.map((image, index) => (
        <Dialog key={index} open={isOpen && selectedIndex === index} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button
              onClick={() => {
                setSelectedIndex(index);
                setIsOpen(true);
              }}
              className="relative group overflow-hidden rounded-lg focus-ring"
              aria-label={`View image ${index + 1} of ${images.length}`}
            >
              <SmartImage
                src={image.url}
                alt={image.alt || `Gallery image ${index + 1}`}
                aspectRatio="square"
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </button>
          </DialogTrigger>

          <DialogContent 
            className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-0"
            onKeyDown={handleKeyDown}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus-ring"
              aria-label="Close gallery"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-50 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium backdrop-blur-sm">
              {selectedIndex + 1} / {images.length}
            </div>

            {/* Main image */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img
                src={images[selectedIndex].url}
                alt={images[selectedIndex].alt || `Gallery image ${selectedIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm focus-ring"
                  onClick={handlePrevious}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm focus-ring"
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-full bg-white/10 backdrop-blur-sm">
                {images.slice(0, 10).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      idx === selectedIndex 
                        ? "w-8 bg-white" 
                        : "w-2 bg-white/50 hover:bg-white/75"
                    )}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
                {images.length > 10 && (
                  <span className="text-white/75 text-xs px-2">
                    +{images.length - 10}
                  </span>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};
