import { component$, Resource, Slot } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { z } from "zod";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { withTypedParams } from "~/utils/withTypes";
import { AlbumHero } from "./AlbumHero/AlbumHero";
import { useAlbumContextProvider } from "./context";

export const albumLoader = loader$(
  endpointBuilder()
    .use(withTypedParams(z.object({ albumId: z.string().min(1) })))
    .use(withProtectedSession())
    .use(withTrpc())
    .loader(async ({ trpc, params, session }) => {
      const result = await trpc.album.findAlbum({ id: params.albumId });
      return { ...result, session };
    })
);

export default component$(() => {
  const resource = albumLoader.use();

  useAlbumContextProvider(resource);

  return (
    <div class="flex flex-col max-h-screen overflow-y-scroll">
      <Resource
        value={resource}
        onResolved={(data) => (
          <>
            {data.album ? (
              <AlbumHero album={data.album} session={data.session} />
            ) : null}
          </>
        )}
      />
      <Slot />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Album - Qwik Album Review",
};
