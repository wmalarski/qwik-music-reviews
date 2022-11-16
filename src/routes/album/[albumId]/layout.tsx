import { component$, Resource, Slot } from "@builder.io/qwik";
import { DocumentHead, useEndpoint } from "@builder.io/qwik-city";
import { z } from "zod";
import { useSessionContext } from "~/routes/context";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { withTypedParams } from "~/utils/withTypes";
import { AlbumHero } from "./AlbumHero/AlbumHero";
import { useAlbumContextProvider } from "./context";

export const onGet = endpointBuilder()
  .use(withTypedParams(z.object({ albumId: z.string().min(1) })))
  .use(withProtectedSession())
  .use(withTrpc())
  .resolver(({ trpc, params }) => {
    return trpc.album.findAlbum({ id: params.albumId });
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();
  useAlbumContextProvider(resource);
  const sessionResource = useSessionContext();

  return (
    <div class="flex flex-col">
      <Resource
        value={resource}
        onResolved={(data) => (
          <Resource
            value={sessionResource}
            onResolved={(session) => (
              <>
                {data.album ? (
                  <AlbumHero album={data.album} session={session} />
                ) : null}
              </>
            )}
          />
        )}
      />
      <Slot />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Album - Qwik Album Review",
};
