import { component$, useSignal, useStore } from "@builder.io/qwik";
import { DocumentHead, loader$, useLocation } from "@builder.io/qwik-city";
import { AlbumGrid } from "~/modules/AlbumGrid/AlbumGrid";
import { AlbumGridItem } from "~/modules/AlbumGrid/AlbumGridCard/AlbumGridCard";
import { getProtectedRequestContext } from "~/server/auth/context";
import { findAlbums } from "~/server/data/album";

export const albumsLoader = loader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);

  return findAlbums({
    ctx,
    query: event.query.get("query") || "",
    skip: 0,
    take: 20,
  });
});

export default component$(() => {
  const location = useLocation();

  const resource = albumsLoader.use();

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
          const url = `${location.href}api?${new URLSearchParams({
            query: location.query.get("query") || "",
            skip: `${(store.currentPage || 0) * 20}`,
          })}`;

          const json = await (await fetch(url)).json();

          if (json?.status === "success") {
            const newAlbums = json.albums || [];
            store.currentPage = store.currentPage + 1;
            store.results = [...store.results, ...newAlbums];
          }
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Search - Qwik Album Review",
};
