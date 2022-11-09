import {
  createContext,
  ResourceReturn,
  useContext,
  useContextProvider,
} from "@builder.io/qwik";

type AlbumContextState = ResourceReturn<{ album: string }>;

const AlbumContext = createContext<AlbumContextState>("album-context");

export const useAlbumContextProvider = (state: AlbumContextState) => {
  useContextProvider(AlbumContext, state);
};

export const useAlbumContext = () => {
  return useContext(AlbumContext);
};
