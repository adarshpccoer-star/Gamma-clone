"use client"

import { useState } from 'react'

type SlidePreviewProps = {
  slide: {
    id: string
    order: number
    title: string
    content: string
    notes?: string | null
    imageURL?: string | null
  }
  isFullscreen?: boolean
}

export function SlidePreview({ slide, isFullscreen }: SlidePreviewProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div
      className={`overflow-hidden ${
        isFullscreen
          ? 'w-full h-full bg-black'
          : 'rounded-2xl border border-border/30 shadow-sm bg-background'
      }`}
    >
      <div
        className={`relative bg-gradient-to-br from-background to-muted/40 ${
          isFullscreen ? 'w-full h-full' : 'aspect-video'
        }`}
      >
        {/* Background image */}
        {slide.imageURL && (
          <img
            src={slide.imageURL}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isFullscreen
                ? (imageLoaded ? 'opacity-50' : 'opacity-0')
                : (imageLoaded ? 'opacity-25' : 'opacity-0')
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
          />
        )}

        {/* Gradient overlay — non-fullscreen gets a subtle vignette for readability */}
        {!isFullscreen && (
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
        )}
        {isFullscreen && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 pointer-events-none" />
        )}

        {/* Slide number pill */}
        {!isFullscreen && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground tabular-nums">
              {slide.order + 1}
            </span>
          </div>
        )}

        {/* Content */}
        <div
          className={`relative z-10 h-full flex flex-col justify-center ${
            isFullscreen
              ? 'p-12 md:p-20 lg:p-28 items-center text-center'
              : 'p-8 md:p-10'
          }`}
        >
          <h2
            className={`font-bold leading-tight mb-3 ${
              isFullscreen
                ? 'text-4xl md:text-6xl lg:text-7xl text-white'
                : 'text-xl md:text-3xl'
            }`}
          >
            {slide.title}
          </h2>
          <div
            className={`whitespace-pre-line leading-relaxed ${
              isFullscreen
                ? 'text-xl md:text-2xl lg:text-3xl text-white/80 max-w-4xl'
                : 'text-sm md:text-base text-muted-foreground max-w-2xl'
            }`}
          >
            {slide.content}
          </div>
        </div>
      </div>

      {/* Speaker notes — only in normal mode */}
      {slide.notes && !isFullscreen && (
        <div className="px-5 py-3 border-t border-border/40 bg-muted/20 flex items-start gap-2">
          <span className="shrink-0 mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70 pt-px">
            Notes
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed flex-1 min-w-0">
            {slide.notes}
          </p>
        </div>
      )}
    </div>
  )
}