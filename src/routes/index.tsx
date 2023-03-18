import { component$, useSignal } from "@builder.io/qwik";
import {
  routeLoader$,
  server$,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { AlbumGrid } from "~/modules/AlbumGrid/AlbumGrid";
import type { AlbumGridItem } from "~/modules/AlbumGrid/AlbumGridCard/AlbumGridCard";
import {
  getNullableProtectedRequestContext,
  getProtectedRequestContext,
} from "~/server/auth/context";
import { findRandom } from "~/server/data/album";

export const useRandomAlbumsLoader = routeLoader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);

  return findRandom({ ctx, take: 20 });
});

export const fetchMoreRandomAlbums = server$(async function () {
  const ctx = await getNullableProtectedRequestContext(this);

  if (!ctx) {
    return null;
  }

  return findRandom({ ctx, take: 20 });
});

export default component$(() => {
  const randomAlbums = useRandomAlbumsLoader();

  const containerRef = useSignal<Element | null>(null);

  const collection = useSignal<AlbumGridItem[]>(randomAlbums.value.albums);

  return (
    <div
      ref={(e) => (containerRef.value = e)}
      class="max-h-screen overflow-y-scroll"
    >
      <h1 class="px-8 pt-8 text-2xl">Random Albums</h1>
      <AlbumGrid
        collection={collection.value}
        currentPage={0}
        pageCount={1}
        parentContainer={containerRef.value}
        onMore$={async () => {
          const json = await fetchMoreRandomAlbums();
          const newAlbums = json?.albums || [];
          collection.value = [...collection.value, ...newAlbums];
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
