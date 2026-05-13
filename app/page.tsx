"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, Wand2 } from "lucide-react"; // Added missing icons

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

import { LAYOUT_OPTIONS, SLIDE_STYLES, TONE_OPTIONS } from "@/lib/presentationFeature/presentation-options";
import { PRESENTATION_TEMPLATES } from "@/lib/presentationFeature/presentation-templates";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPresentation, listPresentations } from "@/server-actions/PresentationServerActions";
import { toast } from "sonner";
import { presentationQueryKeys } from "@/hooks/query-keys";
import { useRouter } from "next/navigation";
import { PresentationListSection } from "@/components/PresentationComponent/PresentationList";

export default function Home() {
  const queryclient = useQueryClient();
  const router = useRouter();
  const [form, setForm] = useState({
    content: '',
    slideCount: 8,
    style: 'minimal',
    tone: 'formal',
    layout: 'balanced',
  });

  const {data:presentations=[],isPending:listPending} = useQuery({
    queryKey: presentationQueryKeys.list(),
    queryFn: () =>listPresentations(),
  })
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
      toast.success('Presentation created')
      queryclient.invalidateQueries({ queryKey: presentationQueryKeys.list() })
      router.push(`/Presentations/${presentation.id}`)
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'Could not create presentation')
    },
  })

  // Mock pending state for the button UI

  const handleGenerate = () => {
  if(!form.content.trim()){
    toast.error('Please enter a topic or outline for your presentation.');
  }else{
    createMut.mutate();
  }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center py-24 px-6 md:px-16">
        
<PresentationListSection
          presentations={presentations}
          isPending={listPending}
        />


        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            What do you want to{' '}
            <span className="text-transparent bg-clip-text bg-primary ">
              create?
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enter your content and we'll generate a professional presentation in seconds.
          </p>
        </div>

        {/* Main input card */}
        <div className="w-full glass rounded-3xl p-6 md:p-8 space-y-6 border border-white/20 shadow-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
          {/* Textarea */}
          <div className="space-y-3">
            <Label htmlFor="content" className="text-sm font-semibold ml-1">Topic or Outline</Label>
            <Textarea
              id="content"
              placeholder="Describe your presentation topic, paste your notes, or outline your key points..."
              value={form.content}
              onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))}
              className="h-45 text-base bg-background/50 border-border/50 rounded-2xl resize-none focus-visible:ring-primary/30 transition-all"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>{form.content.length.toLocaleString()} characters</span>
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-green-500" /> Markdown supported
              </span>
            </div>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Slide count */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Slides: <span className="text-primary">{form.slideCount}</span></Label>
              <Slider
                value={[form.slideCount]}
                onValueChange={([v]) => setForm((s) => ({ ...s, slideCount: v }))}
                min={3}
                max={20}
                step={1}
                className="py-2"
              />
            </div>

            {/* Style */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Style</Label>
              <Select
                value={form.style}
                onValueChange={(v) => setForm((s) => ({ ...s, style: v }))}
              >
                <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {SLIDE_STYLES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tone */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Tone</Label>
              <Select
                value={form.tone}
                onValueChange={(v) => setForm((s) => ({ ...s, tone: v }))}
              >
                <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Layout */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Layout</Label>
              <Select
                value={form.layout}
                onValueChange={(v) => setForm((s) => ({ ...s, layout: v }))}
              >
                <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  {LAYOUT_OPTIONS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate button */}
          <div className="flex justify-end pt-4 border-t border-border/40">
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={createMut.isPending || !form.content.trim()}
              className="rounded-xl px-10 gap-2 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              {createMut.isPending ? (
                <>
                  <Sparkles className="size-5 animate-pulse text-orange-300" />
                  Creating...
                </>
              ) : (
                <>
                  <Wand2 className="size-5" />
                  Generate PPT
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Templates */}
        <div className="mt-12 w-full">
          <p className="text-center text-sm font-medium text-muted-foreground mb-4">
            Or start with a template
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {PRESENTATION_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setForm({
                  content: template.content,
                  slideCount: template.slides,
                  style: template.style,
                  tone: template.tone,
                  layout: template.layout,
                })}
                className="px-5 py-2.5 text-sm font-medium rounded-full border border-border/50 bg-white/50 dark:bg-zinc-900/50 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 hover:shadow-md transition-all active:scale-95"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}