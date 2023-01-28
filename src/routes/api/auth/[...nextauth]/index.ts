import { NextAuth } from "~/server/auth/nextAuth";
import { authOptions } from "~/server/auth/options";

export const { onGet, onPost } = NextAuth(authOptions);
