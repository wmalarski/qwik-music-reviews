import { component$, useSignal, useStore } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { AlbumGrid } from "~/modules/AlbumGrid/AlbumGrid";
import { AlbumGridItem } from "~/modules/AlbumGrid/AlbumGridCard/AlbumGridCard";
import { getProtectedRequestContext } from "~/server/auth/context";
import { findRandom } from "~/server/data/album";

export const randomAlbumsLoader = loader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);
  return findRandom({ ctx, take: 20 });
});

export default component$(() => {
  const randomAlbum = randomAlbumsLoader.use();

  const containerRef = useSignal<Element | null>(null);

  const store = useStore({
    results: [] as AlbumGridItem[],
  });

  return (
    <div
      ref={(e) => (containerRef.value = e)}
      class="max-h-screen overflow-y-scroll"
    >
      <h1 class="px-8 pt-8 text-2xl">Random Albums</h1>
      <AlbumGrid
        collection={[...randomAlbum.value.albums, ...store.results]}
        currentPage={0}
        pageCount={1}
        parentContainer={containerRef.value}
        onMore$={async () => {
          const url = `${location.href}api`;
          const json = await (await fetch(url)).json();
          const newAlbums = json?.albums || [];
          store.results = [...store.results, ...newAlbums];
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
