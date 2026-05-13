import { eq } from "drizzle-orm";
import { inngest } from "./client";
import { db } from "@/db";
import { Presentation, PresentationStatus, Slide } from "@/db/schema/schema";
import { z } from "zod";
import { Output, generateText } from "ai";
import { google } from "@ai-sdk/google";

function buildImageKitUrl(prompt: string, filename: string): string {
  const baseUrl = process.env.IMAGEKIT_BASE_URL?.replace(/\/$/, ""); // Remove trailing slash
  const sanitizedPrompt = prompt
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 150); // Increased limit; 100 might be too short for detail

  // Add the leading slash before ik-genimg
  return `${baseUrl}/ik-genimg-prompt-${encodeURIComponent(sanitizedPrompt)}/${filename}.jpg?tr=w-1280,h-720`;
}
const slideSchema = z.object({
  title: z.string().describe("Slide title"),
  content: z.string().describe("Main content / bullet points for the slide"),
  notes: z.string().optional().describe("Speaker notes"),
  imagePrompt: z
    .string()
    .describe(
      "A concise prompt to generate an illustration for this slide (professional, clean style, no text in image)",
    ),
});
const slidesResponseSchema = z.object({
  slides: z.array(slideSchema),
});

export const generatePresentation = inngest.createFunction(
  {
    id: "generate-presentation",
    retries: 2,
    triggers: { event: "presentation/generate" },
  },
  async ({ event, step }) => {
    const { presentationId } = event.data as { presentationId: string };

    const presentation = await step.run("fetch-presentation", async () => {
      const p = await db.query.Presentation.findFirst({
        where: (table, { eq }) => eq(table.id, presentationId),
        with: {
          slides: true,
        },
      });
      if (!p) throw new Error("Presentation not found");

      return p;
    });
    await step.run("update-presentation-status", async () => {
      await db
        .update(Presentation)
        .set({
          status: "GENERATING", // Or "COMPLETED" based on your logic
          updatedAt: new Date(),
        })
        .where(eq(Presentation.id, presentationId));
    });

    const { slides } = await step.run("generate-slides-content", async () => {
      const systemPrompt = `You are an expert presentation designer. Given a user's content/prompt, create a compelling presentation.

Style: ${Presentation?.style!}
Tone: ${Presentation.tone}
Layout preference: ${Presentation.layout}
Number of slides requested: ${Presentation.slideCount}

Guidelines:
- Create exactly ${Presentation.slideCount} slides
- First slide should be a title slide
- Last slide should be a summary or call-to-action
- Keep content concise and impactful
- For imagePrompt, describe a professional illustration that complements the slide (no text in images)
`;

      const result = await generateText({
        model: google("gemini-2.5-flash"),
        output: Output.object({ schema: slidesResponseSchema }),
        system: systemPrompt,
        prompt: presentation?.prompt!,
      });

      return result.output;
    });

    await step.run("delete-old-slides", async () => {
      await db.delete(Slide).where(eq(Slide.presentationId, presentationId));
    });
    await step.run("create-slides", async () => {
      const data = slides.map((s, i) => ({
        presentationId,
        order: i,
        title: s.title,
        content: s.content,
        notes: s.notes ?? null,
        imagePrompt: s.imagePrompt,
        imageUrl: buildImageKitUrl(
          s.imagePrompt,
          `slide-${presentationId}-${i}`,
        ),
      }));

      await db.insert(Slide).values(data);
    });

    await step.run("mark-completed", async () => {
      await db
        .update(Presentation)
        .set({ status: "COMPLETED" })
        .where(eq(Presentation.id, presentationId));

      return { success: true, slideCount: slides.length };
    });
  },
);
