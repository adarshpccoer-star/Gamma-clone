// "use client" // Required for hooks (useState, useMemo, etc.)

// import { useState, useCallback, use } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import Image from 'next/image'

// // Assume these imports remain the same or are mapped to your UI library
// import { 
//   ArrowLeft, Play, Download, RefreshCw, Maximize, 
//   ChevronLeft, ChevronRight, Trash2, Save 
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { Slider } from '@/components/ui/slider'
// import { 
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
// } from '@/components/ui/select'
// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
//   AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog'
// import { toast } from 'sonner'
// import { GenerationStatus } from '@/components/PresentationComponent/generation-status'

// /**
//  * In Next.js, "params" is usually a Promise in the Page props.
//  * We use React.use() to unwrap it if using the App Router.
//  */
// export default function PresentationDetailPage({ params }: { params: Promise<{ presentationId: string }> }) {
//   const { presentationId } = use(params)
//   const router = useRouter()
  
//   const [activeSlideIndex, setActiveSlideIndex] = useState(0)
//   const [showSettings, setShowSettings] = useState(false)
//   const [showSlideshow, setShowSlideshow] = useState(false)
//   const [isExporting, setIsExporting] = useState(false)

//   // Custom hook logic remains similar, but ensure it's compatible with your data fetching strategy
//   // const {
//   //   query,
//   //   slides,
//   //   isGenerating,
//   //   updatedLabel,
//   //   form,
//   //   setForm,
//   //   updateMut,
//   //   regenerateMut,
//   //   deleteMut,
//   // } = usePresentationDetail(presentationId, {
//   //   onDeleted: () => router.push('/'),
//   // })

//   const { isFullscreen, toggleFullscreen } = useFullscreen('slide-preview-container')

//   const handleExportPptx = useCallback(async () => {
//     const data = query.data
//     if (!data) return
//     const slidesToExport = slides
//     if (slidesToExport.length === 0) return

//     setIsExporting(true)
//     try {
//       const filename = await exportToPptx({
//         title: data.title,
//         slides: slidesToExport,
//       })
//       toast.success(`Exported as ${filename}`)
//     } catch (e) {
//       toast.error(e instanceof Error ? e.message : 'Export failed')
//     } finally {
//       setIsExporting(false)
//     }
//   }, [query.data, slides])

//   if (query.isPending) {
//     return (
//       <main className="min-h-screen pt-24 pb-12 px-4">
//         <div className="max-w-6xl mx-auto text-muted-foreground">
//           Loading presentation…
//         </div>
//       </main>
//     )
//   }

//   if (query.isError) {
//     const error = query.error
//     return (
//       <main className="min-h-screen pt-24 pb-12 px-4">
//         <div className="max-w-6xl mx-auto space-y-4">
//           <p className="text-destructive">
//             {error instanceof Error ? error.message : 'Something went wrong'}
//           </p>
//           <Button asChild variant="outline" className="rounded-xl">
//             <Link href="/">Back home</Link>
//           </Button>
//         </div>
//       </main>
//     )
//   }

//   const data = query.data
//   const thumb = presentationThumbnailUrl(data.id)
//   const activeSlide = slides.at(activeSlideIndex)

//   return (
//     <main className="min-h-screen pt-24 pb-12 px-4">
//       <div className="max-w-6xl mx-auto space-y-6">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div className="flex items-center gap-3">
//             <Button
//               asChild
//               variant="ghost"
//               size="sm"
//               className="rounded-xl gap-1"
//             >
//               {/* Changed 'to' to 'href' */}
//               <Link href="/">
//                 <ArrowLeft className="size-4" />
//                 Home
//               </Link>
//             </Button>
//             <GenerationStatus status={data.status} />
//           </div>
//           <span className="text-sm text-muted-foreground">
//             Updated {updatedLabel}
//           </span>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-6">
//           <div className="flex-1 space-y-4">
//             <div className="glass rounded-2xl p-4 flex items-center gap-4">
//               {/* Next.js Image Component */}
//               <Image
//                 src={thumb}
//                 alt={data.title || "Thumbnail"}
//                 width={56}
//                 height={56}
//                 className="rounded-xl border border-border/50 bg-background/30 object-cover"
//               />
//               <div className="flex-1 min-w-0">
//                 <h1 className="font-semibold truncate">{data.title}</h1>
//                 <p className="text-sm text-muted-foreground">
//                   {slides.length} slides
//                 </p>
//               </div>
//               {/* Rest of the UI remains mostly the same... */}
//               <div className="flex flex-wrap gap-2">
//                 {slides.length > 0 && (
//                   <>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="rounded-xl gap-1"
//                       onClick={() => setShowSlideshow(true)}
//                     >
//                       <Play className="size-4" />
//                       <span className="hidden sm:inline">Slideshow</span>
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="rounded-xl gap-1"
//                       onClick={handleExportPptx}
//                       disabled={isExporting}
//                     >
//                       <Download className="size-4" />
//                       <span className="hidden sm:inline">
//                         {isExporting ? 'Exporting…' : 'Export'}
//                       </span>
//                     </Button>
//                   </>
//                 )}
//                 {/* ... other buttons ... */}
//               </div>
//             </div>

//             {/* Settings, Slide Preview, and Aside logic continues below... */}
//             {/* Note: In the preview and aside sections, ensure SlidePreview, 
//                 SlideCard, and SlideshowModal are also converted to use 
//                 Next/Image if they contain images. */}
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }