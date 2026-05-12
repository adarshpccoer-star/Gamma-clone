import { auth } from "@/lib/auth";
import { presentationType } from "@/types/presentation.types";
import { Presentation, PresentationStatus } from "@/db/schema/schema";
import { createPresentationInputSchema, updatePresentationInputSchema } from "@/types/schemaVaildator";
import { headers } from "next/headers";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
export const checkauthorize = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return null;

  return session;
};

export const createPresentation = async (data: unknown) => {
  try {
    const session = await checkauthorize();
    if (!session) throw new Error("Unauthorized");

    const presentationData = await createPresentationInputSchema.parse(data);
    const [newPresentation] = await db
      .insert(Presentation)
      .values([
        {
          ...presentationData,
          userId: session.user.id,
          title: `Untitled...`,
          status: "COMPLETED",
        },
      ])
      .returning();
    return newPresentation;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
      console.log(error);
    } else {
      throw new Error("unable to save presentation");
    }
  }
};
export const regeneratePresentation = async (data: any) => {
  try {
    const session = await checkauthorize();
    if (!session) throw new Error("Unauthorized");
    const existingPresentation = await db.select()
      .from(Presentation)
      .where(eq(Presentation.id, data?.id))
      .limit(1);
    await db.update(Presentation).set({
      status: "GENERATING",
      slideCount: 0
    }).where(eq(Presentation.id, data?.id));
   
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
      console.log(error);
    } else {
      throw new Error("unable to save presentation");
    }
  }
};


export const updatePresentation = async (id: string, data: unknown) => {
  try {
    const session = await checkauthorize();
    if (!session) throw new Error("Unauthorized");
    const presentationData = await updatePresentationInputSchema.parse(data);

    const existingPresentation = await db
      .select()
      .from(Presentation)
      .where(eq(Presentation.id, id))
      .limit(1);
    if (!existingPresentation) throw new Error("Presentation not found");


    const [updatedPresentation] = await db
      .update(Presentation)
      .set(presentationData)
      .where(eq(Presentation.id, id))
      .returning();
    return updatedPresentation;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
      console.log(error);
    } else {
      throw new Error("unable to save presentation");
    }
  }
};



export const deletePresentation = async (id: string) => {
    try {
        const session = await checkauthorize();
        if (!session) throw new Error("Unauthorized");
        const existingPresentation = await db.select().from(Presentation).where(eq(Presentation.id, id) && eq(Presentation.userId,session.user.id)).limit(1);
        if (!existingPresentation) throw new Error("Presentation not found");
        const deleted=await db.delete(Presentation).where(eq(Presentation.id, id));
return deleted
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
            console.log(error);
        } else {
            throw new Error("unable to save presentation");
        }
    }
}