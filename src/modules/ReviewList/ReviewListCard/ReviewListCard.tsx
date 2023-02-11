import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Album, Artist, Review } from "@prisma/client";
import { Stars } from "~/components/Stars/Stars";
import { AlbumCover } from "~/modules/AlbumCover/AlbumCover";
import { AlbumLinks } from "~/modules/AlbumLinks/AlbumLinks";
import { formatAlbum } from "~/utils/format";
import { paths } from "~/utils/paths";
import { useSessionContext } from "~/utils/SessionContext";
import { ReviewRemoveForm } from "./ReviewRemoveForm/ReviewRemoveForm";

export type ReviewListItem = Review & {
  album: Album & {
    artist: Artist;
  };
};

type Props = {
  review: ReviewListItem;
};

export const ReviewListCard = component$<Props>((props) => {
  const session = useSessionContext();

  const heading = formatAlbum({
    album: props.review.album,
    artist: props.review.album.artist,
  });

  return (
    <div class="flex flex-row">
      <Link href={paths.album(props.review.album.id)} class="w-64">
        <div class="transition-scale scale-95 duration-300 ease-in-out hover:scale-100">
          <AlbumCover album={props.review.album} />
        </div>
      </Link>
      <div class="flex flex-col">
        <Link href={paths.album(props.review.album.id)} class="w-64">
          {heading}
        </Link>
        <Stars rating={props.review.rate} />
        {session.value.user?.id === props.review.userId && (
          <>
            <Link class="link" href={paths.reviewEdit(props.review.id)}>
              Edit
            </Link>
            <ReviewRemoveForm review={props.review} />
          </>
        )}
        <AlbumLinks album={props.review.album} />
      </div>
    </div>
  );
});
