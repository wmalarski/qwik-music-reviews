import { component$, Resource, useSignal, useStore } from "@builder.io/qwik";
import { DocumentHead, useEndpoint } from "@builder.io/qwik-city";
import { AlbumGrid } from "~/modules/AlbumGrid/AlbumGrid";
import { AlbumGridItem } from "~/modules/AlbumGrid/AlbumGridCard/AlbumGridCard";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { trpc } from "~/utils/trpc";

export const onGet = endpointBuilder()
  .use(withProtectedSession())
  .use(withTrpc())
  .resolver(({ trpc }) => {
    return trpc.album.findRandom({ take: 20 });
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();

  const containerRef = useSignal<Element | null>(null);

  const store = useStore({
    results: [] as AlbumGridItem[],
  });

  return (
    <div
      ref={(e) => (containerRef.value = e)}
      class="max-h-screen overflow-y-scroll"
    >
      <h1 class="text-2xl">Random Albums</h1>
      <Resource
        value={resource}
        onPending={() => <span>Pending</span>}
        onRejected={() => <span>Rejected</span>}
        onResolved={(data) => (
          <AlbumGrid
            collection={[...data.albums, ...store.results]}
            currentPage={0}
            pageCount={1}
            parentContainer={containerRef.value}
            onMore$={async () => {
              const newResult = await trpc.album.findRandom.query({ take: 20 });
              const newAlbums = newResult?.albums || [];
              store.results = [...store.results, ...newAlbums];
            }}
          />
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
