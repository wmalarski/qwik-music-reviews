import { component$, Resource, Slot } from "@builder.io/qwik";
import { DocumentHead, useEndpoint } from "@builder.io/qwik-city";
import { z } from "zod";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { withTypedParams } from "~/utils/withTypes";
import { useAlbumContextProvider } from "./context";

export const onGet = endpointBuilder()
  .use(withTypedParams(z.object({ albumId: z.string().min(1) })))
  .use(withProtectedSession())
  .use(withTrpc())
  .query(async ({ trpc, params }) => {
    const album = await trpc.album.findAlbum({ id: params.albumId });
    return { album };
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();
  useAlbumContextProvider(resource);

  return (
    <div>
      <Resource
        value={resource}
        onPending={() => <span>Pending</span>}
        onRejected={() => <span>Rejected</span>}
        onResolved={(data) => <pre>{JSON.stringify(data, null, 2)}</pre>}
      />
      <Slot />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Album - Qwik Album Review",
};
