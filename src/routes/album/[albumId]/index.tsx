import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { AlbumGrid } from "~/modules/AlbumGrid/AlbumGrid";
import { ReviewList } from "~/modules/ReviewList/ReviewList";
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
              <h2 class="py-4 px-8 text-2xl">Other albums</h2>
              <AlbumGrid
                collection={data.albums.map((album) => ({
                  ...album,
                  artist: data.album.artist,
                }))}
                currentPage={0}
                pageCount={1}
              />
              <h2 class="py-4 px-8 text-2xl">Reviews</h2>
              <ReviewList
                collection={data.reviews.flatMap((review) => {
                  const album = data.albums.find(
                    (value) => value.id === review.albumId
                  );
                  return album
                    ? [
                        {
                          ...review,
                          album: { ...album, artist: data.album.artist },
                        },
                      ]
                    : [];
                })}
                currentPage={0}
                pageCount={1}
              />
            </>
          ) : null}
        </div>
      )}
    />
  );
});

export const head: DocumentHead = {
  title: "Album - Qwik Album Review",
};
