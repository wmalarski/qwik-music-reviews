import { component$, useSignal, useStore } from "@builder.io/qwik";
import {
  action$,
  DocumentHead,
  loader$,
  useLocation,
} from "@builder.io/qwik-city";
import { z } from "zod";
import { AlbumGrid } from "~/modules/AlbumGrid/AlbumGrid";
import { AlbumGridItem } from "~/modules/AlbumGrid/AlbumGridCard/AlbumGridCard";
import { findAlbums } from "~/server/album";
import { withProtectedSession } from "~/server/auth/withSession";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { withTypedQuery } from "~/utils/withTypes";

export const albumsLoader = loader$(
  endpointBuilder()
    .use(
      withTypedQuery(
        z.object({
          page: z.number().min(0).step(1).optional(),
          query: z.string().optional(),
        })
      )
    )
    .use(withProtectedSession())
    .loader((event) => {
      return findAlbums({
        ctx: event.ctx,
        query: event.query.query || "",
        skip: (event.query.page || 0) * 20,
        take: 20,
      });
    })
);

export const findAlbumsAction = action$(
  endpointBuilder()
    .use(withProtectedSession())
    .action((form, event) => {
      const query = (form.get("query") || "") as string;
      const page = +(form.get("page") || 0);
      return findAlbums({
        ctx: event.ctx,
        query: query,
        skip: page * 20,
        take: 20,
      });
    })
);

export default component$(() => {
  const location = useLocation();
  const resource = albumsLoader.use();
  const findAlbums = findAlbumsAction.use();

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
            value={location.query.get("query") as string}
            class="input input-bordered"
          />
          <button class="btn uppercase" type="submit">
            Search
          </button>
        </form>
      </div>

      <AlbumGrid
        collection={[...resource.value.albums, ...store.results]}
        currentPage={store.currentPage}
        pageCount={Math.floor(resource.value.count / 20)}
        parentContainer={containerRef.value}
        onMore$={async () => {
          await findAlbums.execute({
            query: location.query.get("query") || "",
            skip: `${(store.currentPage || 0) * 20}`,
          });
          const newAlbums = findAlbums.value?.albums || [];
          store.currentPage = store.currentPage + 1;
          store.results = [...store.results, ...newAlbums];
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Search - Qwik Album Review",
};
