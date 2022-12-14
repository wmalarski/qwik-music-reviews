import { component$, Resource, useSignal, useStore } from "@builder.io/qwik";
import { DocumentHead, useEndpoint, useLocation } from "@builder.io/qwik-city";
import { z } from "zod";
import { AlbumGrid } from "~/modules/AlbumGrid/AlbumGrid";
import { AlbumGridItem } from "~/modules/AlbumGrid/AlbumGridCard/AlbumGridCard";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { withTypedQuery } from "~/utils/withTypes";
import { useTrpcContext } from "../context";

export const onGet = endpointBuilder()
  .use(
    withTypedQuery(
      z.object({
        page: z.number().min(0).step(1).optional(),
        query: z.string().optional(),
      })
    )
  )
  .use(withProtectedSession())
  .use(withTrpc())
  .resolver(({ query, trpc }) => {
    return trpc.album.findAlbums({
      query: query.query || "",
      skip: (query.page || 0) * 20,
      take: 20,
    });
  });

export default component$(() => {
  const location = useLocation();
  const resource = useEndpoint<typeof onGet>();

  const trpcContext = useTrpcContext();
  const containerRef = useSignal<Element | null>(null);

  const store = useStore({
    currentPage: 1,
    results: [] as AlbumGridItem[],
  });

  return (
    <div
      ref={(e) => (containerRef.value = e)}
      class="max-h-screen overflow-y-scroll"
    >
      <div class="flex flex-row bg-base-300">
        <h1 class="text-2xl hidden">Search</h1>
        <form class="flex flex-row justify-start gap-4 p-4">
          <img
            src="/images/magnifier.svg"
            width={24}
            height={24}
            alt="search"
            aria-label="Search"
          />
          <input
            name="query"
            id="query"
            aria-label="query"
            value={location.query.query}
            class="input input-bordered"
          />
          <button class="btn uppercase" type="submit">
            Search
          </button>
        </form>
      </div>
      <Resource
        value={resource}
        onPending={() => <span>Pending</span>}
        onRejected={() => <span>Rejected</span>}
        onResolved={(data) => (
          <AlbumGrid
            collection={[...data.albums, ...store.results]}
            currentPage={store.currentPage}
            pageCount={Math.floor(data.count / 20)}
            parentContainer={containerRef.value}
            onMore$={async () => {
              const trpc = await trpcContext();
              const newResult = await trpc?.album.findAlbums.query({
                query: location.query["query"] || "",
                skip: (store.currentPage || 0) * 20,
                take: 20,
              });
              const newAlbums = newResult?.albums || [];
              store.currentPage = store.currentPage + 1;
              store.results = [...store.results, ...newAlbums];
            }}
          />
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Search - Qwik Album Review",
};
