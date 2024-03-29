import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { getProtectedRequestContext } from "~/server/auth/context";
import { findAlbum } from "~/server/data/album";
import { useSessionContextProvider } from "~/utils/SessionContext";
import { AlbumHero } from "./AlbumHero/AlbumHero";

export const useProtectedSessionLoader = routeLoader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);
  return ctx.session;
});

export const useAlbumLoader = routeLoader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);
  return findAlbum({ ctx, id: event.params.albumId });
});

export default component$(() => {
  const album = useAlbumLoader();

  const session = useProtectedSessionLoader();
  useSessionContextProvider(session);

  return (
    <div class="flex flex-col max-h-screen overflow-y-scroll">
      {album.value.album ? <AlbumHero album={album.value.album} /> : null}
      <Slot />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Album - Qwik Album Review",
};
