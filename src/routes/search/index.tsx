import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, RequestEvent, useEndpoint } from "@builder.io/qwik-city";

export const onGet = async (event: RequestEvent) => {
  const { trpcServerCaller } = await import("~/server/trpc/router");
  const { caller } = await trpcServerCaller(event);

  const params = event.url.searchParams;
  const query = params.get("query") || "";
  const page = +(params.get("page") || 0);
  return caller.album.findAlbums({ query, skip: page * 10, take: 10 });
};

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();

  return (
    <div>
      <h1>
        Search <span class="bg-red-500">⚡️</span>
      </h1>
      <Resource
        value={resource}
        onPending={() => <span>Pending</span>}
        onRejected={() => <span>Rejected</span>}
        onResolved={(data) => <pre>{JSON.stringify(data, null, 2)}</pre>}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Search - Qwik Album Review",
};
