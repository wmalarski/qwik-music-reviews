import { component$, Resource, Slot } from "@builder.io/qwik";
import { DocumentHead, RequestEvent, useEndpoint } from "@builder.io/qwik-city";
import { useAlbumContextProvider } from "./context";

export const onGet = async (event: RequestEvent) => {
  const { trpcServerCaller } = await import("~/server/trpc/router");
  const { caller } = await trpcServerCaller(event);

  const album = await caller.album.findAlbum({ id: event.params.id });

  return { album };
};

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
