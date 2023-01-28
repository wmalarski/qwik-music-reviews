import { RequestEvent } from "@builder.io/qwik-city";
import { QWikNextAuthHandler } from "~/server/auth/nextAuth";
import { authOptions } from "~/server/auth/options";

export const onGet = (event: RequestEvent) => {
  return QWikNextAuthHandler(event, authOptions);
};

export const onPost = (event: RequestEvent) => {
  return QWikNextAuthHandler(event, authOptions);
};
