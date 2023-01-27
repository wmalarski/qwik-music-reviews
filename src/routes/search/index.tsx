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
import { findAlbums } from "~/server/data/album";
import { protectedProcedure, withTypedQuery } from "~/server/procedures";

export const albumsLoader = loader$(
  protectedProcedure
    .use(withTypedQuery(z.object({ query: z.string().default("") })))
    .loader((event) => {
      return findAlbums({
        ctx: event.ctx,
        query: event.query.query,
        skip: 0,
        take: 20,
      });
    })
);

export const findAlbumsAction = action$(
  protectedProcedure.typedAction(
    z.object({
      page: z.coerce.number().min(0).int().default(0),
      query: z.string().default(""),
    }),
    (form, event) => {
      return findAlbums({
        ctx: event.ctx,
        query: form.query,
        skip: form.page * 20,
        take: 20,
      });
    }
  )
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
