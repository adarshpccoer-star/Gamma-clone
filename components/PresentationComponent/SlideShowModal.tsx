"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

type Slide = {
  id: string;
  order: number;
  title: string;
  content: string;
  notes?: string | null;
  imageURL?: string | null;
};

type SlideshowModalProps = {
  slides: Slide[];
  initialIndex?: number;
  onClose: () => void;
};

export function SlideshowModal({
  slides,
  initialIndex = 0,
  onClose,
}: SlideshowModalProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const currentSlide = slides[currentIndex];

  const toggleAutoplay = useCallback(() => {
    if (!swiperRef.current) return;
    if (swiperRef.current.autoplay.running) {
      swiperRef.current.autoplay.stop();
    } else {
      swiperRef.current.autoplay.start();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "p" || e.key === " ") {
        e.preventDefault();
        toggleAutoplay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, toggleAutoplay]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <Swiper
        modules={[Keyboard, Autoplay, Pagination]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onAutoplayStart={() => setIsPlaying(true)}
        onAutoplayStop={() => setIsPlaying(false)}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        initialSlide={initialIndex}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Background image */}
              {slide.imageURL && (
                <img
                  src={slide.imageURL}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-35"
                />
              )}
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-center items-center px-8 pb-28 pt-16">
                <div className="max-w-5xl w-full text-center">
                  <p className="text-white/40 text-sm font-medium mb-6 tabular-nums tracking-widest uppercase">
                    {currentIndex + 1} / {slides.length}
                  </p>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <div className="text-lg md:text-xl lg:text-2xl text-white/75 whitespace-pre-line leading-relaxed max-w-3xl mx-auto">
                    {slide.content}
                  </div>
                </div>
              </div>

              {/* Speaker notes */}
              {slide.notes && showControls && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 py-3 z-20 pointer-events-none">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10">
                    <p className="text-white/65 text-xs text-center leading-relaxed">
                      <span className="font-semibold text-white/80">Speaker notes · </span>
                      {slide.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Controls bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 pb-8 pt-4 z-30 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/80 hover:text-white hover:bg-white/15 rounded-full size-11 transition-all"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="size-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/15 rounded-full size-12 border border-white/20 backdrop-blur-sm transition-all"
            onClick={toggleAutoplay}
          >
            {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 translate-x-px" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white/80 hover:text-white hover:bg-white/15 rounded-full size-11 transition-all"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={currentIndex >= slides.length - 1}
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-4 right-4 z-30 text-white/80 hover:text-white hover:bg-white/15 rounded-full size-10 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      >
        <X className="size-5" />
      </Button>

      {/* Keyboard hint */}
      {showControls && (
        <div className="absolute bottom-4 right-6 z-30 text-white/30 text-[10px] font-medium tracking-wide">
          ESC to exit · Space to play/pause
        </div>
      )}
    </div>
  );
}