import { RequestEvent } from "@builder.io/qwik-city";

export const onGet = async (event: RequestEvent) => {
  const { QWikNextAuthHandler } = await import("~/server/auth/nextAuth");
  const { authOptions } = await import("~/server/auth/options");
  return QWikNextAuthHandler(event, authOptions);
};

export const onPost = async (event: RequestEvent) => {
  const { QWikNextAuthHandler } = await import("~/server/auth/nextAuth");
  const { authOptions } = await import("~/server/auth/options");
  return QWikNextAuthHandler(event, authOptions);
};
