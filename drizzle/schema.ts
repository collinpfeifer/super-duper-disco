import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const Users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }).unique().notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const Denials = sqliteTable("denials", {
  id: integer("id").primaryKey({ autoIncrement: true }).unique().notNull()
})
