import { action, cache } from "@solidjs/router";
import {
  getUser as gU,
  logout as l,
  loginOrRegister as lOR,
} from "../utils/session.server";

export const getUser = cache(gU, "user");
export const loginOrRegister = action(lOR, "loginOrRegister");
export const logout = action(l, "logout");
