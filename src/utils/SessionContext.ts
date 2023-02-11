import {
  createContext,
  Signal,
  useContext,
  useContextProvider,
} from "@builder.io/qwik";
import type { Session } from "next-auth";

type SessionContextState = Signal<Session>;

export const SessionContext =
  createContext<SessionContextState>("session-context");

export const useSessionContextProvider = (state: SessionContextState) => {
  useContextProvider(SessionContext, state);
};

export const useSessionContext = () => {
  return useContext(SessionContext);
};
