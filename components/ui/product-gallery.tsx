"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export function ProductGallery({ images, productName, className }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomImageIndex, setZoomImageIndex] = useState(0);

  const currentImage = images[selectedImageIndex] || '/placeholder-shoe.jpg';
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openZoom = (index: number) => {
    setZoomImageIndex(index);
    setIsZoomOpen(true);
  };

  const nextZoomImage = () => {
    setZoomImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevZoomImage = () => {
    setZoomImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Main Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted group">
          <Image
            src={currentImage}
            alt={`${productName} - Image ${selectedImageIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
          
          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Zoom Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => openZoom(selectedImageIndex)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        {hasMultipleImages && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={cn(
                  "relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0 border-2 transition-all duration-200",
                  selectedImageIndex === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-muted-foreground"
                )}
              >
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* 360° View Placeholder */}
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-2">
            360° View Available
          </p>
          <Button variant="outline" size="sm" disabled>
            View 360° (Coming Soon)
          </Button>
        </div>
      </div>

      {/* Zoom Modal */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-black">
          <div className="relative w-full h-[80vh]">
            <Image
              src={images[zoomImageIndex] || '/placeholder-shoe.jpg'}
              alt={`${productName} - Zoomed Image ${zoomImageIndex + 1}`}
              fill
              className="object-contain"
            />
            
            {/* Close Button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 z-10"
              onClick={() => setIsZoomOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Navigation in Zoom */}
            {hasMultipleImages && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
                  onClick={prevZoomImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                  onClick={nextZoomImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image Counter in Zoom */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded">
                {zoomImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}