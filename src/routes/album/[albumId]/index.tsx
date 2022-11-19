import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { AlbumGrid } from "~/modules/AlbumGrid/AlbumGrid";
import { useSessionContext } from "~/routes/context";
import { ArtistReviews } from "./ArtistReviews/ArtistReviews";
import { useAlbumContext } from "./context";

export default component$(() => {
  const albumResource = useAlbumContext();
  const sessionResource = useSessionContext();

  return (
    <Resource
      value={albumResource}
      onPending={() => <span>Pending</span>}
      onRejected={() => <span>Rejected</span>}
      onResolved={(data) => (
        <div>
          <h2 class="py-4 px-8 text-2xl">Other albums</h2>
          {data.album ? (
            <AlbumGrid
              collection={data.albums.map((album) => ({
                ...album,
                artist: data.album.artist,
              }))}
              currentPage={0}
              pageCount={1}
            />
          ) : null}
          <Resource
            value={sessionResource}
            onResolved={(session) => (
              <ArtistReviews data={data} session={session} />
            )}
          />
        </div>
      )}
    />
  );
});

export const head: DocumentHead = {
  title: "Album - Qwik Album Review",
};
