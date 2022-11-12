import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { AlbumGrid } from "~/modules/AlbumGrid/AlbumGrid";
import { AlbumHero } from "~/modules/AlbumHero/AlbumHero";
import { useAlbumContext } from "./context";

export default component$(() => {
  const albumResource = useAlbumContext();

  return (
    <Resource
      value={albumResource}
      onPending={() => <span>Pending</span>}
      onRejected={() => <span>Rejected</span>}
      onResolved={(data) => (
        <div>
          {data.album ? (
            <>
              <AlbumHero album={data.album} />
              <h2>Other albums</h2>
              <AlbumGrid
                collection={data.albums.map((album) => ({
                  ...album,
                  artist: data.album.artist,
                }))}
                currentPage={0}
                pageCount={1}
              />
            </>
          ) : null}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    />
  );
});

export const head: DocumentHead = {
  title: "Album - Qwik Album Review",
};
