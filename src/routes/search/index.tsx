import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, useEndpoint } from "@builder.io/qwik-city";
import { z } from "zod";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedQuery } from "~/utils/withTypes";

export const onGet = endpointBuilder()
  .use(
    withTypedQuery(
      z.object({ page: z.number().optional(), query: z.string().optional() })
    )
  )
  .use(withProtectedSession())
  .use(withTrpc())
  .resolver(({ query, trpc }) => {
    return trpc.album.findAlbums({
      query: query.query || "",
      skip: (query.page || 0) * 10,
      take: 10,
    });
  });

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
        onResolved={(data) => (
          <div>
            <a href={paths.search(1, "")}>Next page</a>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Search - Qwik Album Review",
};
