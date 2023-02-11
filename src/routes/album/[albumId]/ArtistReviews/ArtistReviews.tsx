import { component$ } from "@builder.io/qwik";
import type { Session } from "next-auth";
import { ReviewList } from "~/modules/ReviewList/ReviewList";
import type { findAlbum } from "~/server/data/album";
import type { AsyncReturnValue } from "~/server/types";

type Props = {
  data: AsyncReturnValue<typeof findAlbum>;
  session: Session;
};

export const ArtistReviews = component$<Props>((props) => {
  const reviews = props.data.reviews.flatMap((review) => {
    const album = props.data.albums.find(
      (value) => value.id === review.albumId
    );
    return album && props.data.album
      ? [
          {
            ...review,
            album: { ...album, artist: props.data.album.artist },
          },
        ]
      : [];
  });

  return (
    <>
      {reviews.length > 0 ? (
        <div class="flex flex-col gap-4">
          <h2 class="py-4 px-8 text-2xl">Reviews</h2>
          <ReviewList
            collection={reviews}
            currentPage={0}
            pageCount={1}
            session={props.session}
          />
        </div>
      ) : null}
    </>
  );
});
