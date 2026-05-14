// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Sparkles, Wand2 } from "lucide-react"; // Added missing icons

// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Textarea } from "@/components/ui/textarea";

// import { LAYOUT_OPTIONS, SLIDE_STYLES, TONE_OPTIONS } from "@/lib/presentationFeature/presentation-options";
// import { PRESENTATION_TEMPLATES } from "@/lib/presentationFeature/presentation-templates";
// import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { createPresentation, listPresentations } from "@/server-actions/PresentationServerActions";
// import { toast } from "sonner";
// import { presentationQueryKeys } from "@/hooks/query-keys";
// import { useRouter } from "next/navigation";
// import { PresentationListSection } from "@/components/PresentationComponent/PresentationList";

// export default function Home() {
//   const queryclient = useQueryClient();
//   const router = useRouter();
//   const [form, setForm] = useState({
//     content: '',
//     slideCount: 8,
//     style: 'minimal',
//     tone: 'formal',
//     layout: 'balanced',
//   });

//   const {data:presentations=[],isPending:listPending} = useQuery({
//     queryKey: presentationQueryKeys.list(),
//     queryFn: () =>listPresentations(),
//   })
//    const createMut = useMutation({
//     mutationFn: () =>
//       createPresentation({
//         data: {
//           prompt: form.content.trim(),
//           slideCount: form.slideCount,
//           style: form.style,
//           tone: form.tone,
//           layout: form.layout,
//         },
//       }),
//     onSuccess: (presentation) => {
//       toast.success('Presentation created')
//       queryclient.invalidateQueries({ queryKey: presentationQueryKeys.list() })
//       router.push(`/Presentations/${presentation.id}`)
//     },
//     onError: (e) => {
//       toast.error(e instanceof Error ? e.message : 'Could not create presentation')
//     },
//   })

//   // Mock pending state for the button UI

//   const handleGenerate = () => {
//   if(!form.content.trim()){
//     toast.error('Please enter a topic or outline for your presentation.');
//   }else{
//     createMut.mutate();
//   }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-5xl flex-col items-center py-24 px-6 md:px-16">
        
// <PresentationListSection
//           presentations={presentations}
//           isPending={listPending}
//         />


//      

//         {/* Main input card */}
//         <div className="w-full glass rounded-3xl p-6 md:p-8 space-y-6 border border-white/20 shadow-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
//           {/* Textarea */}
//           <div className="space-y-3">
//             <Label htmlFor="content" className="text-sm font-semibold ml-1">Topic or Outline</Label>
//             <Textarea
//               id="content"
//               placeholder="Describe your presentation topic, paste your notes, or outline your key points..."
//               value={form.content}
//               onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))}
//               className="h-45 text-base bg-background/50 border-border/50 rounded-2xl resize-none focus-visible:ring-primary/30 transition-all"
//             />
//             <div className="flex justify-between text-xs text-muted-foreground px-1">
//               <span>{form.content.length.toLocaleString()} characters</span>
//               <span className="flex items-center gap-1">
//                 <span className="w-1 h-1 rounded-full bg-green-500" /> Markdown supported
//               </span>
//             </div>
//           </div>

//           {/* Options grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {/* Slide count */}
//             <div className="space-y-3">
//               <Label className="text-sm font-medium">Slides: <span className="text-primary">{form.slideCount}</span></Label>
//               <Slider
//                 value={[form.slideCount]}
//                 onValueChange={([v]) => setForm((s) => ({ ...s, slideCount: v }))}
//                 min={3}
//                 max={20}
//                 step={1}
//                 className="py-2"
//               />
//             </div>

//             {/* Style */}
//             <div className="space-y-3">
//               <Label className="text-sm font-medium">Style</Label>
//               <Select
//                 value={form.style}
//                 onValueChange={(v) => setForm((s) => ({ ...s, style: v }))}
//               >
//                 <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
//                   <SelectValue placeholder="Select style" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {SLIDE_STYLES.map((s) => (
//                     <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Tone */}
//             <div className="space-y-3">
//               <Label className="text-sm font-medium">Tone</Label>
//               <Select
//                 value={form.tone}
//                 onValueChange={(v) => setForm((s) => ({ ...s, tone: v }))}
//               >
//                 <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
//                   <SelectValue placeholder="Select tone" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {TONE_OPTIONS.map((t) => (
//                     <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Layout */}
//             <div className="space-y-3">
//               <Label className="text-sm font-medium">Layout</Label>
//               <Select
//                 value={form.layout}
//                 onValueChange={(v) => setForm((s) => ({ ...s, layout: v }))}
//               >
//                 <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
//                   <SelectValue placeholder="Select layout" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {LAYOUT_OPTIONS.map((l) => (
//                     <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Generate button */}
//           <div className="flex justify-end pt-4 border-t border-border/40">
//             <Button
//               size="lg"
//               onClick={handleGenerate}
//               disabled={createMut.isPending || !form.content.trim()}
//               className="rounded-xl px-10 gap-2 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
//             >
//               {createMut.isPending ? (
//                 <>
//                   <Sparkles className="size-5 animate-pulse text-orange-300" />
//                   Creating...
//                 </>
//               ) : (
//                 <>
//                   <Wand2 className="size-5" />
//                   Generate PPT
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Templates */}
//         <div className="mt-12 w-full">
//           <p className="text-center text-sm font-medium text-muted-foreground mb-4">
//             Or start with a template
//           </p>
//           <div className="flex flex-wrap justify-center gap-3">
//             {PRESENTATION_TEMPLATES.map((template) => (
//               <button
//                 key={template.id}
//                 type="button"
//                 onClick={() => setForm({
//                   content: template.content,
//                   slideCount: template.slides,
//                   style: template.style,
//                   tone: template.tone,
//                   layout: template.layout,
//                 })}
//                 className="px-5 py-2.5 text-sm font-medium rounded-full border border-border/50 bg-white/50 dark:bg-zinc-900/50 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 hover:shadow-md transition-all active:scale-95"
//               >
//                 {template.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { Sparkles, Wand2, LayoutGrid, Plus, ChevronRight, Clock, Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

import { LAYOUT_OPTIONS, SLIDE_STYLES, TONE_OPTIONS } from "@/lib/presentationFeature/presentation-options";
import { PRESENTATION_TEMPLATES } from "@/lib/presentationFeature/presentation-templates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPresentation, listPresentations } from "@/server-actions/PresentationServerActions";
import { toast } from "sonner";
import { presentationQueryKeys } from "@/hooks/query-keys";
import { useRouter } from "next/navigation";
import { presentationThumbnailUrl } from "@/components/PresentationComponent/utlis/thumbnail";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

export default function Home() {
  const queryclient = useQueryClient();
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  
  const { data: session, isPending } = authClient.useSession();

  
  const [form, setForm] = useState({
    content: '',
    slideCount: 8,
    style: 'minimal',
    tone: 'formal',
    layout: 'balanced',
  });

  const { data: presentations = [], isPending: listPending } = useQuery({
    queryKey: presentationQueryKeys.list(),
    queryFn: () => listPresentations(),
  });

  const createMut = useMutation({
    mutationFn: () =>
      createPresentation({
        data: {
          prompt: form.content.trim(),
          slideCount: form.slideCount,
          style: form.style,
          tone: form.tone,
          layout: form.layout,
        },
      }),
    onSuccess: (presentation) => {
      toast.success('Presentation created');
      queryclient.invalidateQueries({ queryKey: presentationQueryKeys.list() });
      router.push(`/Presentations/${presentation.id}`);
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'Could not create presentation');
    },
  });

  const handleGenerate = () => {
    if (!form.content.trim()) {
      toast.error('Please enter a topic or outline for your presentation.');
    } else {
      createMut.mutate();
    }
  };
useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) return <p>Loading...</p>;
  if (!session) return null;

  return (
    <div className="min-h-screen mt-24 bg-background">
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-20 space-y-12">

        {/* ── Hero heading ── */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-white to-primary/40 bg-clip-text text-transparent tracking-tight mb-4">
  
             What do you want to{' '}
             <span className="text-transparent bg-clip-text bg-primary ">
               create?
             </span>
           </h1>
           <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
             Enter your content and we'll generate a professional presentation in seconds.
           </p>
         </div>

        {/* ── Create toggle / form ── */}
        {!showCreate ? (
          <div className="flex justify-center">
            <Button
              size="lg"
              className="rounded-2xl px-8 gap-2 font-semibold shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="size-5" />
              New Presentation
            </Button>
          </div>
        ) : (
          <div className="glass rounded-3xl p-6 md:p-8 space-y-6 border border-border/40 shadow-lg animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-base">New Presentation</h2>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
            </div>

            {/* Textarea */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Topic or Outline
              </Label>
              <Textarea
                id="content"
                placeholder="Describe your topic, paste notes, or outline key points…"
                value={form.content}
                onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))}
                className="h-32 text-sm bg-background/60 border-border/50 rounded-2xl resize-none focus-visible:ring-primary/30"
              />
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>{form.content.length.toLocaleString()} characters</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Markdown supported
                </span>
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Slides: <span className="text-primary">{form.slideCount}</span>
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
                <div key={key} className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
                  <Select
                    value={(form as any)[key]}
                    onValueChange={(v) => setForm((s) => ({ ...s, [key]: v }))}
                  >
                    <SelectTrigger className="bg-background/60 border-border/50 rounded-xl h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((o: any) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {/* Generate */}
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <div className="flex flex-wrap gap-2">
                {PRESENTATION_TEMPLATES.slice(0, 4).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setForm({ content: t.content, slideCount: t.slides, style: t.style, tone: t.tone, layout: t.layout })}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-border/50 bg-background/50 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <Button
                size="default"
                onClick={handleGenerate}
                disabled={createMut.isPending || !form.content.trim()}
                className="rounded-xl px-7 gap-2 font-semibold shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                {createMut.isPending ? (
                  <><Sparkles className="size-4 animate-pulse" />Creating…</>
                ) : (
                  <><Wand2 className="size-4" />Generate</>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ── Presentations list ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutGrid className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Your Presentations</h2>
            </div>
            {!listPending && presentations.length > 0 && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {presentations.length} {presentations.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>

          {listPending ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-2xl border border-border/30 bg-muted/10 p-4 flex gap-3.5 animate-pulse">
                  <div className="size-14 rounded-xl bg-muted/50 shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 rounded-full bg-muted/60 w-3/4" />
                    <div className="h-2.5 rounded-full bg-muted/40 w-1/2" />
                    <div className="h-2 rounded-full bg-muted/30 w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : presentations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/50 bg-muted/10 px-8 py-14 text-center space-y-3">
              <div className="size-12 rounded-2xl bg-muted/40 flex items-center justify-center mx-auto">
                <Layers className="size-5 text-muted-foreground/60" />
              </div>
              <p className="text-sm font-medium">No presentations yet</p>
              <p className="text-xs text-muted-foreground">Create your first one using the button above.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {presentations.map((p: any) => (
                <PresentationListCard key={p.id} presentation={p} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* ── Inline list card (larger, grid-friendly) ── */
function PresentationListCard({ presentation: p }: { presentation: any }) {
  const updated = new Date(p.updatedAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const thumb = presentationThumbnailUrl(p.id);

  return (
    <Link
      href={`/Presentations/${p.id}`}
      className="group block rounded-2xl border border-border/40 bg-card/60 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-150 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      {/* Thumbnail strip */}
      <div className="w-full aspect-video bg-muted/30 overflow-hidden relative">
        <img
          src={thumb}
          alt=""
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-2 left-3">
          <span className="text-[10px] font-semibold text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {p.slideCount} slides
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {p.title}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
            {p.style} · {p.tone} · {p.layout}
          </p>
          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground/60">
            <Clock className="size-3" />
            {updated}
          </div>
        </div>
        <ChevronRight className="size-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors shrink-0 mt-0.5" />
      </div>
    </Link>
  );
}