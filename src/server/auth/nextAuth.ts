// Code copied from
// https://gist.github.com/langbamit/a09161e844ad9b4a3cb756bacde67796
import type { RequestEvent, RequestHandler } from "@builder.io/qwik-city";
import * as cookie from "cookie";
import { AuthHandler } from "next-auth/core";
import type { AuthAction, AuthOptions, Session } from "next-auth/core/types";
import { env } from "../env";
import type { RequestEventLoader } from "../types";

const getBody = async (
  event: RequestEvent
): Promise<Record<string, unknown> | undefined> => {
  try {
    const formData = await event.request.formData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = {};
    (formData || []).forEach((value, key) => {
      if (key in data) {
        data[key] = Array.isArray(data[key])
          ? [...data[key], value]
          : [data[key], value];
      } else {
        data[key] = value;
      }
    }, {});
    return data;
  } catch {
    return;
  }
};

const tempCookieName = "next-auth.temp";

// const setCookies = (event: RequestEventLoader, cookies?: Cookie[]) => {
//   if (!cookies || cookies.length < 1) {
//     return;
//   }

//   // TODO: change to new api when available
//   // this is temporary fix for not able to save multiple cookies
//   // using 'set-cookie' header
//   const value = JSON.stringify(cookies.map((c) => [c.name, c.value]));
//   const options = cookies[0].options;

//   event.headers.set(
//     "set-cookie",
//     cookie.serialize(tempCookieName, value, options)
//   );
// };

const getCookie = (headers: Headers) => {
  const result = cookie.parse(headers.get("cookie") || "");

  // TODO: change to new api when available
  const parsed = JSON.parse(result[tempCookieName] || "[]");
  const restoredCookies = Object.fromEntries(parsed);

  return { ...result, ...restoredCookies };
};

const QWikNextAuthHandler = async (
  event: RequestEvent,
  options: AuthOptions
) => {
  const [action, providerId] = event.params.nextauth.split("/");
  const body = await getBody(event);
  const query = Object.fromEntries(event.url.searchParams);
  const cookies = getCookie(event.request.headers);
  const error = (query.error as string | undefined) ?? providerId;

  const res = await AuthHandler({
    options,
    req: {
      action: action as AuthAction,
      body,
      cookies,
      error,
      headers: event.request.headers,
      host: env.NEXTAUTH_URL,
      method: event.request.method,
      providerId,
      query,
    },
  });

  console.log({
    action,
    body,
    cookies,
    error,
    providerId,
    query,
    res,
  });

  for (const header of res.headers || []) {
    event.headers.append(header.key, header.value);
  }

  // setCookies(response, cookies);

  if (res.redirect) {
    // if (body?.json !== "true") {
    //   throw event.redirect(302, res.redirect);
    // }
    event.redirect(res.status || 302, res.redirect);
    return;
    // event.headers.set("Content-Type", "application/json");
    // return { url: res.redirect };
  }

  event.send(res.status || 200, res.body);
};

export const getServerSession = async (
  event: RequestEventLoader,
  options: AuthOptions
): Promise<Session | null> => {
  const cookies = getCookie(event.request.headers);

  console.log({ cookies });

  const res = await AuthHandler({
    options,
    req: {
      action: "session",
      cookies,
      headers: event.request.headers,
      host: env.NEXTAUTH_URL,
      method: "GET",
    },
  });

  console.log({ res });

  // setCookies(event, cookies);

  if (
    res.body &&
    typeof res.body !== "string" &&
    Object.keys(res.body).length
  ) {
    return res.body as Session;
  }
  return null;
};

export const getServerCsrfToken = async (
  event: RequestEventLoader,
  options: AuthOptions
) => {
  const cookies = getCookie(event.request.headers);

  const { body } = await AuthHandler({
    options,
    req: {
      action: "csrf",
      cookies,
      headers: event.request.headers,
      host: env.NEXTAUTH_URL,
      method: "GET",
    },
  });

  return (body as { csrfToken: string }).csrfToken;
};

export const NextAuth = (
  options: AuthOptions
): { onGet: RequestHandler; onPost: RequestHandler } => ({
  onGet: (event) => QWikNextAuthHandler(event, options),
  onPost: (event) => QWikNextAuthHandler(event, options),
});
