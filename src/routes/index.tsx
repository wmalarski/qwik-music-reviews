import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, useEndpoint } from "@builder.io/qwik-city";
import { AlbumGrid } from "~/modules/AlbumGrid/AlbumGrid";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";

export const onGet = endpointBuilder()
  .use(withProtectedSession())
  .use(withTrpc())
  .resolver(({ trpc }) => {
    return trpc.album.findRandom({ take: 10 });
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();

  return (
    <div>
      <h1 class="text-2xl">Random Albums</h1>
      <Resource
        value={resource}
        onPending={() => <span>Pending</span>}
        onRejected={() => <span>Rejected</span>}
        onResolved={(data) => (
          <AlbumGrid collection={data.albums} currentPage={0} pageCount={1} />
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
