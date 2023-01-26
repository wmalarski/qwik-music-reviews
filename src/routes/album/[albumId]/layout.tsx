import { component$, Slot } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { z } from "zod";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { withTypedParams } from "~/utils/withTypes";
import { AlbumHero } from "./AlbumHero/AlbumHero";
import { useAlbumContextProvider } from "./context";

export const sessionLoader = loader$(
  endpointBuilder()
    .use(withProtectedSession())
    .loader((event) => {
      return event.session;
    })
);

export const albumLoader = loader$(
  endpointBuilder()
    .use(withTypedParams(z.object({ albumId: z.string().min(1) })))
    .use(withProtectedSession())
    .use(withTrpc())
    .loader((event) => {
      return event.trpc.album.findAlbum({ id: event.params.albumId });
    })
);

export default component$(() => {
  const album = albumLoader.use();
  const session = sessionLoader.use();

  useAlbumContextProvider(album);

  return (
    <div class="flex flex-col max-h-screen overflow-y-scroll">
      {album.value.album ? (
        <AlbumHero album={album.value.album} session={session.value} />
      ) : null}
      <Slot />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Album - Qwik Album Review",
};
