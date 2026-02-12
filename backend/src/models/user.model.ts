import { InferModel } from "drizzle-orm"
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core"

export const userTable = pgTable('users', {

    id: uuid().primaryKey().defaultRandom().notNull(),

    clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),

    firstName: varchar('first_name', { length: 235 }).notNull(),

    lastName: varchar('last_name', { length: 235 }),

    email: varchar('email', { length: 255 }).unique().notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),

    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),

})

export type User = InferModel<typeof userTable>;
export type NewUser = InferModel<typeof userTable, "insert">;
