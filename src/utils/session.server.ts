import { redirect } from "@solidjs/router";
import { useSession } from "vinxi/http";
import { eq } from "drizzle-orm";
import { db } from "./db.server";
import { Users } from "../../drizzle/schema";

function validateEmail(email: unknown) {
  if (typeof email !== "string" || email.length < 3) {
    return `emails must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

async function login(email: string, password: string) {
  const user = db.select().from(Users).where(eq(Users.email, email)).get();
  if (!user || password !== user.password) throw new Error("Invalid login");
  return user;
}

async function register(email: string, password: string) {
  const existingUser = db
    .select()
    .from(Users)
    .where(eq(Users.email, email))
    .get();
  if (existingUser) throw new Error("User already exists");
  return db.insert(Users).values({ email, password }).returning().get();
}

function getSession() {
  return useSession({
    password:
      process.env.SESSION_SECRET ?? "areallylongsecretthatyoushouldreplace",
  });
}

export async function loginOrRegister(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const loginType = String(formData.get("loginType"));
  let error = validateEmail(email) || validatePassword(password);
  if (error) return new Error(error);

  try {
    const user = await (loginType !== "login"
      ? register(email, password)
      : login(email, password));
    const session = await getSession();
    await session.update((d) => {
      d.userId = user.id;
    });
  } catch (err) {
    return err as Error;
  }
  throw redirect("/");
}

export async function logout() {
  const session = await getSession();
  await session.update((d) => (d.userId = undefined));
  throw redirect("/login");
}

export async function getUser() {
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) throw redirect("/login");

  try {
    const user = db.select().from(Users).where(eq(Users.id, userId)).get();
    if (!user) throw redirect("/login");
    return { id: user.id, email: user.email };
  } catch {
    throw logout();
  }
}
