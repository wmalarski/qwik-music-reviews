import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth/core/types";
import Auth0Provider from "next-auth/providers/auth0";
import { prisma } from "../db/client";
import { env } from "../env";

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
    Auth0Provider({
      clientId: env.VITE_AUTH0_CLIENT_ID,
      clientSecret: env.VITE_AUTH0_CLIENT_SECRET,
      issuer: env.VITE_AUTH0_ISSUER,
    }),
  ],
  secret: env.VITE_NEXTAUTH_SECRET,
};
