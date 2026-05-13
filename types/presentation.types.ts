import { Presentation } from "@/db/schema"
import { InferSelectModel } from "drizzle-orm"


export type presentationType = InferSelectModel<typeof Presentation>