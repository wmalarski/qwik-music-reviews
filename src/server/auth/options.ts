import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { AuthOptions } from "next-auth/core/types";
import Auth0Provider from "next-auth/providers/auth0";
import { prisma } from "../db/client";
import { env } from "../env";

export const authOptions: AuthOptions = {
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
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      issuer: env.AUTH0_ISSUER,
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
};
