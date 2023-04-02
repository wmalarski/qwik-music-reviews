/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Provider } from "@auth/core/providers";
import Auth0 from "@auth/core/providers/auth0";
import {
  getSessionData,
  serverAuth$,
  type QwikAuthConfig,
} from "@builder.io/qwik-auth";
import { type RequestEventCommon } from "@builder.io/qwik-city";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "~/server/db/client";

export const authOptions = (event: RequestEventCommon): QwikAuthConfig => {
  return {
    adapter: PrismaAdapter(prisma) as any,
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
        clientId: event.env.get("AUTH0_CLIENT_ID")!,
        clientSecret: event.env.get("AUTH0_CLIENT_SECRET")!,
        issuer: event.env.get("AUTH0_ISSUER"),
      }),
    ] as Provider[],
    secret: event.env.get("NEXTAUTH_SECRET"),
    trustHost: true,
  };
};

export const getServerSession = (event: RequestEventCommon) => {
  const options = authOptions(event);
  return getSessionData(event.request, options);
};

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$((event) => authOptions(event));
