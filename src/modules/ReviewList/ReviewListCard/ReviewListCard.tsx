import { component$ } from "@builder.io/qwik";
import type { Album, Artist, Review } from "@prisma/client";
import { Stars } from "~/components/Stars/Stars";
import { AlbumCover } from "~/modules/AlbumCover/AlbumCover";
import { formatAlbum } from "~/utils/format";
import { paths } from "~/utils/paths";

export type ReviewListItem = Review & {
  album: Album & {
    artist: Artist;
  };
};

type Props = {
  review: ReviewListItem;
};

export const ReviewListCard = component$((props: Props) => {
  const heading = formatAlbum({
    album: props.review.album,
    artist: props.review.album.artist,
  });

  return (
    <div class="flex flex-row">
      <a href={paths.album(props.review.album.id)} class="w-64">
        <div class="transition-scale scale-95 duration-300 ease-in-out hover:scale-100">
          <AlbumCover album={props.review.album} />
        </div>
      </a>
      <div class="flex flex-col">
        <a href={paths.album(props.review.album.id)} class="w-64">
          {heading}
        </a>
        <Stars rating={props.review.rate} />
        <a class="link" href={paths.reviewEdit(props.review.id)}>
          Edit
        </a>
      </div>
    </div>
  );
});
