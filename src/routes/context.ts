import {
  createContext,
  ResourceReturn,
  useContext,
  useContextProvider,
} from "@builder.io/qwik";
import type { Session } from "next-auth/core/types";

type SessionContextState = ResourceReturn<Session>;

const SessionContext = createContext<SessionContextState>("session-context");

export const useSessionContextProvider = (state: SessionContextState) => {
  useContextProvider(SessionContext, state);
};

export const useSessionContext = () => {
  return useContext(SessionContext);
};

export const ContainerContext = createContext<{ value: Element | null }>(
  "container-context"
);