import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { AlbumGrid } from "~/modules/AlbumGrid/AlbumGrid";
import { protectedSessionLoader } from "~/routes/layout";
import { ArtistReviews } from "./ArtistReviews/ArtistReviews";
import { albumLoader } from "./layout";

export default component$(() => {
  const album = albumLoader.use();
  const session = protectedSessionLoader.use();

  const artist = album.value.album?.artist;

  return (
    <div>
      <h2 class="py-4 px-8 text-2xl">Other albums</h2>
      {album.value && artist ? (
        <AlbumGrid
          collection={album.value.albums.map((entry) => ({ ...entry, artist }))}
          currentPage={0}
          pageCount={1}
        />
      ) : null}
      <ArtistReviews data={album.value} session={session.value} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Album - Qwik Album Review",
};
