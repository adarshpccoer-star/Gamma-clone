"use client"
import { useState } from 'react'
import { ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

type SlideCardProps = {
  slide: {
    id: string
    order: number
    title: string
    content: string
    notes?: string | null
    imageURL?: string | null
  }
  isActive?: boolean
  onClick?: () => void
}

export function SlideCard({ slide, isActive, onClick }: SlideCardProps) {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full text-left rounded-xl p-2.5 transition-all duration-150 ${
        isActive
          ? 'bg-primary/8 ring-2 ring-primary/40 shadow-sm'
          : 'bg-background/40 hover:bg-background/70 border border-border/30 hover:border-border/50 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {/* Slide number badge */}
        <span
          className={`shrink-0 flex items-center justify-center size-5 rounded-md text-[10px] font-bold mt-0.5 ${
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground group-hover:bg-muted/80'
          }`}
        >
          {slide.order + 1}
        </span>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className={`text-xs font-semibold line-clamp-1 mb-1.5 leading-tight ${
            isActive ? 'text-foreground' : 'text-foreground/80'
          }`}>
            {slide.title}
          </h3>

          {/* Thumbnail */}
          <div className="aspect-video rounded-lg overflow-hidden bg-muted/60 relative">
            {slide.imageURL ? (
              <>
                {imageStatus === 'loading' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
                    <Loader2 className="size-4 text-muted-foreground/60 animate-spin" />
                  </div>
                )}
                {imageStatus === 'error' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 gap-1">
                    <ImageIcon className="size-4 text-muted-foreground/50" />
                    <span className="text-[10px] text-muted-foreground/60">No image</span>
                  </div>
                )}
                <Image
                  src={slide.imageURL}
                  alt={slide.title}
                  fill
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  onLoad={() => setImageStatus('loaded')}
                  onError={() => setImageStatus('error')}
                />
              </>
            ) : (
              /* No-image placeholder with subtle slide content preview */
              <div className="absolute inset-0 flex flex-col justify-center px-3 py-2 bg-gradient-to-br from-muted/30 to-muted/60">
                <div className="w-2/3 h-1.5 rounded-full bg-foreground/10 mb-1.5" />
                <div className="w-full h-1 rounded-full bg-foreground/7 mb-1" />
                <div className="w-4/5 h-1 rounded-full bg-foreground/7" />
              </div>
            )}
          </div>

          {/* Content snippet */}
          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
            {slide.content}
          </p>
        </div>
      </div>
    </button>
  )
}