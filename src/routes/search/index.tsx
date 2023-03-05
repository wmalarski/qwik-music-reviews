import { component$, useSignal } from "@builder.io/qwik";
import {
  routeLoader$,
  server$,
  useLocation,
  z,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { AlbumGrid } from "~/modules/AlbumGrid/AlbumGrid";
import type { AlbumGridItem } from "~/modules/AlbumGrid/AlbumGridCard/AlbumGridCard";
import { getProtectedRequestContext } from "~/server/auth/context";
import { findAlbums } from "~/server/data/album";

export const useAlbumsLoader = routeLoader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);

  const query = event.query.get("query") || "";

  return findAlbums({ ctx, query, skip: 0, take: 20 });
});

// eslint-disable-next-line prefer-arrow-callback
export const fetchMoreAlbums = server$(async function (page: number) {
  const ctx = await getProtectedRequestContext(this);

  const parsedPage = z.coerce.number().min(0).int().default(0).parse(page);
  const query = this.query.get("query") || "";

  return findAlbums({ ctx, query, skip: parsedPage * 20, take: 20 });
});

export default component$(() => {
  const location = useLocation();

  const albums = useAlbumsLoader();

  const containerRef = useSignal<Element | null>(null);

  const collection = useSignal<AlbumGridItem[]>(albums.value.albums);
  const currentPage = useSignal(1);

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
            value={location.url.searchParams.get("query") as string}
            class="input input-bordered"
          />
          <button class="btn uppercase" type="submit">
            Search
          </button>
        </form>
      </div>

      <AlbumGrid
        collection={collection.value}
        currentPage={currentPage.value}
        pageCount={Math.floor(albums.value.count / 20)}
        parentContainer={containerRef.value}
        onMore$={async () => {
          const result = await fetchMoreAlbums(currentPage.value);
          const newAlbums = result.albums || [];
          currentPage.value += 1;
          collection.value = [...collection.value, ...newAlbums];
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Search - Qwik Album Review",
};
