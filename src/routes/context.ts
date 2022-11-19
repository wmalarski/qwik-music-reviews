import {
  $,
  createContext,
  NoSerialize,
  noSerialize,
  QRL,
  ResourceReturn,
  useContext,
  useContextProvider,
  useSignal,
} from "@builder.io/qwik";
import type { Session } from "next-auth/core/types";
import { createTrpc } from "~/utils/trpc";

type SessionContextState = ResourceReturn<Session>;

const SessionContext = createContext<SessionContextState>("session-context");

export const useSessionContextProvider = (state: SessionContextState) => {
  useContextProvider(SessionContext, state);
};

export const useSessionContext = () => {
  return useContext(SessionContext);
};

type ClientTrpc = NoSerialize<ReturnType<typeof createTrpc>>;

export const TrpcContext = createContext<QRL<() => ClientTrpc>>("trpc-context");

export const useTrpcContextProvider = () => {
  const trpc = useSignal<ClientTrpc>();

  const getter = $(() => {
    if (trpc.value) {
      return trpc.value;
    }
    trpc.value = noSerialize(createTrpc());

    return trpc.value;
  });

  useContextProvider(TrpcContext, getter);
};

export const useTrpcContext = () => {
  return useContext(TrpcContext);
};
