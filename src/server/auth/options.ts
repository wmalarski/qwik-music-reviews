import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth/core/types";
import Auth0Provider from "next-auth/providers/auth0";
import { prisma } from "../db/client";
import { env } from "../env";

const Auth0 =
  typeof Auth0Provider === "function"
    ? Auth0Provider
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((Auth0Provider as any).default as typeof Auth0Provider);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: ({ session, user }) => {
      if (session.user) {
        session.user.id = user?.id;
      }
      return session;
    },
  },
  providers: [
    Auth0({
      clientId: env.VITE_AUTH0_CLIENT_ID,
      clientSecret: env.VITE_AUTH0_CLIENT_SECRET,
      issuer: env.VITE_AUTH0_ISSUER,
    }),
  ],
  secret: env.VITE_NEXTAUTH_SECRET,
};
