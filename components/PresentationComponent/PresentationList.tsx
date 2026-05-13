"use client"

import { PresentationCard } from "./presentationCard"
import {presentationType} from "@/types/presentation.types"


type PresentationListSectionProps = {
  presentations: ( presentationType)[] ,
  isPending: boolean
}

export function PresentationListSection({
  presentations,
  isPending,
}: any
// PresentationListSectionProps
) {
  return (
    <section className="mb-12">
      <h2 className="text-lg font-semibold mb-4">Your presentations</h2>
      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : presentations.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No presentations yet. Create one with the form below.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {presentations.map((p:any) => (
            <li key={p.id}>
              <PresentationCard presentation={p} />

            </li>
          ))}
        </ul>
      )}
    </section>
  )
}