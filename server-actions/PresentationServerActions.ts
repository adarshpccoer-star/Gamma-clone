"use server";

import { auth } from "@/lib/auth";
import { presentationType } from "@/types/presentation.types";
import { Presentation, PresentationStatus } from "@/db/schema/schema";
import {
  createPresentationInputSchema,
  updatePresentationInputSchema,
} from "@/types/schemaVaildator";
import { headers } from "next/headers";
import { db } from "@/db";
import { and, asc, eq } from "drizzle-orm";
import { inngest } from "@/inngest/client";
export const checkauthorize = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return null;

  return session;
};

export const createPresentation = async (payload: { data: any }) => {
  try {
    const session = await checkauthorize();
    if (!session) throw new Error("Unauthorized");

    
    const presentationData = await createPresentationInputSchema.parse(
      payload.data,
    );

    const [newPresentation] = await db
      .insert(Presentation)
      .values([
        {
          ...presentationData, 
          userId: session.user.id,
          title: `Untitled Presentation`,
          status: "COMPLETED",
        },
      ])
      .returning();
      await inngest.send({
        name:"presentation/generate",
        data: {
          presentationId: newPresentation.id,
        },
      })
    return JSON.parse(JSON.stringify(newPresentation));
  } catch (error) {
    console.error("Action Error:", error); // Log first so you can see it in terminal
    if (error instanceof Error) {
      // If it's a Zod error, error.message will be a JSON string of all issues
      throw new Error(error.message);
    }
    throw new Error("unable to save presentation");
  }
};
export const regeneratePresentation = async (data: any) => {
  try {
    const session = await checkauthorize();
    if (!session) throw new Error("Unauthorized");
    const existingPresentation = await db
      .select()
      .from(Presentation)
      .where(eq(Presentation.id, data?.id))
      .limit(1);
    await db
      .update(Presentation)
      .set({
        status: "GENERATING",
        slideCount: 0,
      })
      .where(eq(Presentation.id, data?.id));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
      console.log(error);
    } else {
      throw new Error("unable to save presentation");
    }
  }
};

export const updatePresentation = async (data: unknown) => {
  try {
    const session = await checkauthorize();
    if (!session) throw new Error("Unauthorized");

    // 1. Validate the incoming data
    const presentationData = await updatePresentationInputSchema.parse(data);

  
    const [updated] = await db
      .update(Presentation)
      .set(presentationData)
      .where(
        and(
          eq(Presentation.id, presentationData.id),
          eq(Presentation.userId, session.user.id)
        )
      )
      .returning();

    if (!updated) throw new Error("Presentation not found or unauthorized");

    // 3. Fetch the updated presentation WITH slides included
    // Using the Relational API is the cleanest way to get the nested structure
    const fullPresentation = await db.query.Presentation.findFirst({
      where: eq(Presentation.id, updated.id),
      with: {
        slides: true,
      },
    });

    return JSON.parse(JSON.stringify(fullPresentation));
  } catch (error) {
    console.error("Update Action Error:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Unable to update presentation");
  }
};

export const deletePresentation = async (id: string) => {
  try {
    const session = await checkauthorize();
    if (!session) throw new Error("Unauthorized");
    const existingPresentation = await db
      .select()
      .from(Presentation)
      .where(
        and(eq(Presentation.id, id), eq(Presentation.userId, session.user.id)),
      );
    if (!existingPresentation) throw new Error("Presentation not found");
    const deleted = await db
      .delete(Presentation)
      .where(eq(Presentation.id, id));
    return deleted;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
      console.log(error);
    } else {
      throw new Error("unable to save presentation");
    }
  }
};

export const getPresentationWithSlides = async (data: any) => {
  try {
    const session = await checkauthorize();
    if (!session) throw new Error("Unauthorized");
    console.log(data)
    const userID = session.user.id;
    const row = await db.query.Presentation.findFirst({
      where: (presentation, { and, eq }) => 
        and(
          eq(presentation.id, data.data.id),
          eq(presentation.userId, userID)
        ),
      with: { slides: true },
    });
console.log(row);
    // Handle the case where no presentation is found
    if (!row) {
      return null; 
    }

    return JSON.parse(JSON.stringify(row));

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
      console.log(error);
    } else {
      throw new Error("unable to save presentation");
    }
  }
};


export const listPresentations = async () => {
  try {
    const session = await checkauthorize();
    if (!session) throw new Error("Unauthorized");
    const presentations = await db
      .select()
      .from(Presentation)
      .where(eq(Presentation.userId, session.user.id));
    return await db.select().from(Presentation).where(eq(Presentation.userId, session.user.id)).orderBy(asc(Presentation.updatedAt));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
      console.log(error);
    } else {
      throw new Error("unable to save presentation");
    }
  }
};