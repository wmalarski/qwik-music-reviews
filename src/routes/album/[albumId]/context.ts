import {
  createContext,
  ResourceReturn,
  useContext,
  useContextProvider,
} from "@builder.io/qwik";
import type { RouterOutput } from "~/utils/trpc";

type AlbumContextState = ResourceReturn<RouterOutput["album"]["findAlbum"]>;

const AlbumContext = createContext<AlbumContextState>("album-context");

export const useAlbumContextProvider = (state: AlbumContextState) => {
  useContextProvider(AlbumContext, state);
};

export const useAlbumContext = () => {
  return useContext(AlbumContext);
};
