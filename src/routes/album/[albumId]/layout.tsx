import { component$, Slot } from "@builder.io/qwik";
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
  .resolver(({ trpc, params }) => {
    return trpc.album.findAlbum({ id: params.albumId });
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();
  useAlbumContextProvider(resource);

  return <Slot />;
});

export const head: DocumentHead = {
  title: "Album - Qwik Album Review",
};
