import { component$ } from "@builder.io/qwik";
import type { Album, Artist, Review } from "@prisma/client";
import { Stars } from "~/components/Stars/Stars";
import { formatAlbum } from "~/utils/format";
import { getCoversAttributes } from "~/utils/images";
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
          {props.review.album.covers ? (
            <picture>
              <img
                alt={heading}
                class="max-w-full border-4 border-base-300 object-cover aspect-square"
                {...getCoversAttributes(JSON.parse(props.review.album.covers))}
              />
            </picture>
          ) : null}
        </div>
      </a>
      <div class="flex flex-col">
        <a href={paths.album(props.review.album.id)} class="w-64">
          {heading}
        </a>
        <Stars rating={props.review.rate} />
      </div>
    </div>
  );
});
