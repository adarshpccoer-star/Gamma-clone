"use client"
import { PresentationCard } from "./presentationCard"
import { presentationType } from "@/types/presentation.types"
import { LayoutGrid } from "lucide-react"

type PresentationListSectionProps = {
  presentations: presentationType[]
  isPending: boolean
}

export function PresentationListSection({
  presentations,
  isPending,
}: any) {
  return (
    <section className="mb-10 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex mt-12SS items-center gap-2">
          <LayoutGrid className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Your Presentations</h2>
        </div>
        {!isPending && presentations.length > 0 && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {presentations.length} {presentations.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {isPending ? (
        /* Skeleton loader */
        <ul className="grid gap-3 sm:grid-cols-2">
          {[1, 2].map((n) => (
            <li key={n}>
              <div className="rounded-xl border border-border/30 bg-muted/20 p-3.5 flex gap-3.5 animate-pulse">
                <div className="size-[60px] rounded-lg bg-muted/60 shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 rounded-full bg-muted/60 w-3/4" />
                  <div className="h-2.5 rounded-full bg-muted/40 w-1/2" />
                  <div className="h-2 rounded-full bg-muted/30 w-1/3 mt-3" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : presentations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/50 bg-muted/10 px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No presentations yet. Create one with the form below.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {presentations.map((p: any) => (
            <li key={p.id}>
              <PresentationCard presentation={p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}