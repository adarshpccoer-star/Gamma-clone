"use client"
import { GenerationStatus } from '@/components/PresentationComponent/generation-status'
import { SlideCard } from '@/components/PresentationComponent/SlideCard'
import { SlidePreview } from '@/components/PresentationComponent/SlidePreview'
import { SlideshowModal } from '@/components/PresentationComponent/SlideShowModal'
import { presentationThumbnailUrl } from '@/components/PresentationComponent/utlis/thumbnail'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useFullscreen } from '@/hooks/use-fullscreen'
import { usePresentationDetail } from '@/hooks/use-presentation-detail'
import { LAYOUT_OPTIONS, SLIDE_STYLES, TONE_OPTIONS } from '@/lib/presentationFeature/presentation-options'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize,
  Play,
  RefreshCw,
  Save,
  Settings2,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { use, useState } from 'react'

export default function PresentationDetailPage({
  params,
}: {
  params: Promise<{ PresentationId: string }>
}) {
  const resolvedParams = use(params)
  const presentationId = resolvedParams.PresentationId

  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [showSlideshow, setShowSlideshow] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { isFullscreen, toggleFullscreen } = useFullscreen('slide-preview-container')
  const router = useRouter()

  const {
    query,
    slides,
    isGenerating,
    updatedLabel,
    form,
    setForm,
    updateMut,
    regenerateMut,
    deleteMut,
  } = usePresentationDetail(presentationId, {
    onDeleted: () => router.push('/'),
  })

  /* ── Loading / error states ── */
  if (query.isPending) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="size-7 animate-spin text-primary/50" />
        <p className="text-sm text-muted-foreground">Loading presentation…</p>
      </div>
    </div>
  )

  if (query.isError || !query.data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="font-semibold">Presentation not found</p>
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )

  const data = query.data
  const thumb = presentationThumbnailUrl(data.id)
  const activeSlide = slides.at(activeSlideIndex)

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* ── Top navigation bar ── */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-xl gap-1.5 text-muted-foreground hover:text-foreground h-8"
            >
              <Link href="/">
                <ArrowLeft className="size-3.5" />
                All Presentations
              </Link>
            </Button>
            <div className="w-px h-4 bg-border/60" />
            <GenerationStatus status={data.status!} />
          </div>
          <span className="text-xs text-muted-foreground/60 font-medium tabular-nums">
            Saved {updatedLabel}
          </span>
        </div>

        {/* ── Presentation header ── */}
        <div className="glass rounded-2xl px-4 py-3 flex flex-wrap items-center gap-3 border border-border/40 shadow-sm">
          <img
            src={thumb}
            alt=""
            width={48}
            height={48}
            className="rounded-xl border border-border/40 bg-muted/30 shrink-0 object-cover"
          />
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-sm truncate">{data.title}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {slides.length} {slides.length === 1 ? 'slide' : 'slides'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center flex-wrap gap-2 ml-auto">
            {slides.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5 h-8 text-xs font-medium"
                  onClick={() => setShowSlideshow(true)}
                >
                  <Play className="size-3.5" />
                  <span className="hidden sm:inline">Slideshow</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5 h-8 text-xs font-medium"
                  disabled={isExporting}
                >
                  <Download className="size-3.5" />
                  <span className="hidden sm:inline">{isExporting ? 'Exporting…' : 'Export'}</span>
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-1.5 h-8 text-xs font-medium"
              disabled={regenerateMut.isPending || isGenerating}
              onClick={() => regenerateMut.mutate()}
            >
              <RefreshCw className={`size-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isGenerating ? 'Generating…' : 'Regenerate'}</span>
            </Button>
            <Button
              variant={showSettings ? 'default' : 'ghost'}
              size="sm"
              className="rounded-xl gap-1.5 h-8 text-xs font-medium"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings2 className="size-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>

        {/* ── Settings panel ── */}
        {showSettings && (
          <div className="glass rounded-2xl p-6 space-y-5 border border-border/40 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h2 className="text-sm font-semibold">Presentation Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="pres-title" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Title
                </Label>
                <input
                  id="pres-title"
                  value={form.title}
                  onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                  className="flex h-9 w-full rounded-xl border border-border/50 bg-background/60 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-shadow"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Prompt
                </Label>
                <Textarea
                  value={form.prompt}
                  onChange={(e) => setForm((s) => ({ ...s, prompt: e.target.value }))}
                  className="min-h-[72px] text-sm bg-background/60 border-border/50 rounded-xl resize-y"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Slides: {form.slideCount}
                </Label>
                <Slider
                  value={[form.slideCount]}
                  onValueChange={([v]) => setForm((s) => ({ ...s, slideCount: v }))}
                  min={3} max={20} step={1}
                  className="py-2"
                />
              </div>
              {[
                { label: 'Style', key: 'style', options: SLIDE_STYLES },
                { label: 'Tone', key: 'tone', options: TONE_OPTIONS },
                { label: 'Layout', key: 'layout', options: LAYOUT_OPTIONS },
              ].map(({ label, key, options }) => (
                <div key={key} className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                  </Label>
                  <Select
                    value={(form as any)[key]}
                    onValueChange={(value) => setForm((s) => ({ ...s, [key]: value }))}
                  >
                    <SelectTrigger className="bg-background/60 border-border/50 rounded-xl h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass">
                      {options.map((o: any) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-xl gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={deleteMut.isPending}
                  >
                    <Trash2 className="size-4" />
                    Delete presentation
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete presentation?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your presentation and all its slides.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => deleteMut.mutate()}
                    >
                      {deleteMut.isPending ? 'Deleting…' : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                type="button"
                size="sm"
                className="rounded-xl gap-2"
                disabled={updateMut.isPending || !form.title.trim() || !form.prompt.trim()}
                onClick={() => updateMut.mutate()}
              >
                <Save className="size-4" />
                {updateMut.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </div>
        )}

        {/* ── Slide viewer + sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Main viewer */}
          <div className="flex-1 min-w-0 space-y-3">
            {activeSlide && (
              <>
                <div id="slide-preview-container" className="relative group rounded-2xl overflow-hidden shadow-md">
                  <SlidePreview slide={activeSlide} isFullscreen={isFullscreen} />
                  <Button
                    variant="secondary"
                    size="icon"
                    className={`absolute top-3 right-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-background/70 hover:bg-background/90 ${isFullscreen ? 'opacity-100' : ''}`}
                    onClick={toggleFullscreen}
                  >
                    <Maximize className="size-4" />
                  </Button>
                </div>

                {/* Prev / Next */}
                <div className="flex items-center justify-between px-0.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1 h-8 text-xs"
                    disabled={activeSlideIndex === 0}
                    onClick={() => setActiveSlideIndex((i) => Math.max(0, i - 1))}
                  >
                    <ChevronLeft className="size-3.5" />
                    Previous
                  </Button>
                  <span className="text-xs text-muted-foreground font-medium tabular-nums">
                    {activeSlideIndex + 1} / {slides.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1 h-8 text-xs"
                    disabled={activeSlideIndex >= slides.length - 1}
                    onClick={() => setActiveSlideIndex((i) => Math.min(slides.length - 1, i + 1))}
                  >
                    Next
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </>
            )}

            {/* No slides — idle */}
            {slides.length === 0 && !isGenerating && (
              <div className="glass rounded-2xl p-14 text-center border border-dashed border-border/50 space-y-4">
                <div className="size-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto">
                  <RefreshCw className="size-5 text-muted-foreground/60" />
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">No slides yet</p>
                  <p className="text-xs text-muted-foreground">Click Regenerate to create slides from your prompt.</p>
                </div>
                <Button
                  className="rounded-xl gap-2"
                  onClick={() => regenerateMut.mutate()}
                  disabled={regenerateMut.isPending}
                >
                  <RefreshCw className="size-4" />
                  Generate slides
                </Button>
              </div>
            )}

            {/* No slides — generating */}
            {slides.length === 0 && isGenerating && (
              <div className="glass rounded-2xl p-14 text-center border border-border/40 space-y-3">
                <RefreshCw className="size-8 animate-spin mx-auto text-primary" />
                <p className="font-medium text-sm">Generating your presentation…</p>
                <p className="text-xs text-muted-foreground">This may take a minute</p>
              </div>
            )}
          </div>

          {/* Slide strip sidebar */}
          {slides.length > 0 && (
            <aside className="lg:w-64 xl:w-72 shrink-0 flex flex-col">
              <div className="flex items-center justify-between px-0.5 pb-2.5">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Slides</h2>
                <span className="text-xs text-muted-foreground/60 tabular-nums">{slides.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pr-1 space-y-2 max-h-[calc(100vh-13rem)]">
                {slides.map((slide: any, i: number) => (
                  <SlideCard
                    key={slide.id}
                    slide={slide}
                    isActive={i === activeSlideIndex}
                    onClick={() => setActiveSlideIndex(i)}
                  />
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>

      {showSlideshow && (
        <SlideshowModal
          slides={slides}
          initialIndex={activeSlideIndex}
          onClose={() => setShowSlideshow(false)}
        />
      )}
    </main>
  )
}