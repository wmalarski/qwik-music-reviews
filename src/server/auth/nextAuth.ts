import type { RequestEvent, RequestEventCommon } from "@builder.io/qwik-city";
import { AuthHandler } from "next-auth/core";
import type { Cookie } from "next-auth/core/lib/cookie";
import type { AuthAction, AuthOptions, Session } from "next-auth/core/types";
import { env } from "../env";

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

const setCookies = (event: RequestEventCommon, cookies?: Cookie[]) => {
  cookies?.forEach((cookie) => {
    const sameSite = cookie.options.sameSite;
    event.cookie.set(cookie.name, cookie.value, {
      ...cookie.options,
      sameSite:
        sameSite === true ? "lax" : sameSite === false ? "none" : sameSite,
    });
  });
};

const getCookie = (event: RequestEventCommon) => {
  return Object.entries(event.cookie.getAll()).reduce<Record<string, string>>(
    (prev, [key, cookie]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prev[key] = (cookie as any).value;
      return prev;
    },
    {}
  );
};

export const QWikNextAuthHandler = async (
  event: RequestEvent,
  options: AuthOptions
) => {
  const [action, providerId] = event.params.nextauth.split("/");
  const body = await getBody(event);
  const query = Object.fromEntries(event.url.searchParams);
  const cookies = getCookie(event);

  const res = await AuthHandler({
    options,
    req: {
      action: action as AuthAction,
      body,
      cookies,
      error: query.error,
      headers: event.request.headers,
      host: env.NEXTAUTH_URL,
      method: event.request.method,
      providerId,
      query,
    },
  });

  for (const header of res.headers || []) {
    event.headers.append(header.key, header.value);
  }

  setCookies(event, res.cookies);

  if (res.redirect) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event.redirect((res.status || 302) as any, res.redirect);
    event.send(res.status || 302, res.body || "");
    return;
  }

  event.send(res.status || 200, res.body);
};

export const getServerSession = async (
  event: RequestEventCommon,
  options: AuthOptions
): Promise<Session | null> => {
  const cookies = getCookie(event);

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

  setCookies(event, res.cookies);

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
  event: RequestEventCommon,
  options: AuthOptions
) => {
  const cookies = getCookie(event);

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
