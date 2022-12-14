import {
  createContext,
  ResourceReturn,
  useContext,
  useContextProvider,
} from "@builder.io/qwik";
import type { Session } from "next-auth";
import type { RouterOutput } from "~/utils/trpc";

type AlbumContextState = ResourceReturn<
  RouterOutput["album"]["findAlbum"] & {
    session: Session;
  }
>;

const AlbumContext = createContext<AlbumContextState>("album-context");

export const useAlbumContextProvider = (state: AlbumContextState) => {
  useContextProvider(AlbumContext, state);
};

export const useAlbumContext = () => {
  return useContext(AlbumContext);
};
