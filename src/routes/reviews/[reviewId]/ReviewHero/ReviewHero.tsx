import { component$ } from "@builder.io/qwik";
import type { Album, Artist, Review } from "@prisma/client";
import { Stars } from "~/components/Stars/Stars";
import { formatAlbum } from "~/utils/format";
import { getCoversAttributes } from "~/utils/images";
import { paths } from "~/utils/paths";

type Props = {
  review: Review & { album: Album & { artist: Artist } };
};

export const ReviewHero = component$((props: Props) => {
  const heading = formatAlbum({
    album: props.review.album,
    artist: props.review.album.artist,
  });

  return (
    <section class="flex justify-center p-8">
      <div class="flex max-w-5xl flex-row items-center gap-8">
        <div class="hidden flex-grow md:flex">
          {props.review.album.covers ? (
            <div class="min-w-max">
              <picture>
                <img
                  alt={`${heading} cover`}
                  class="w-80"
                  {...getCoversAttributes(
                    JSON.parse(props.review.album.covers)
                  )}
                />
              </picture>
            </div>
          ) : null}
        </div>
        <div class="flex flex-col gap-6">
          <a href={paths.album(props.review.albumId)}>
            <h2 class="mb-4 text-3xl">{heading}</h2>
          </a>
          <div class="grid grid-cols-[max-content_1fr] items-center gap-3 text-sm opacity-80 lg:grid-cols-[max-content_1fr_max-content_1fr]">
            <div>Title</div>
            <div>{props.review.album.title}</div>
            <div>Artist</div>
            <div>{props.review.album.artist.name}</div>
            {props.review.album.year ? (
              <>
                <div>Released</div>
                <div>{props.review.album.year}</div>
              </>
            ) : null}
            <div>Text</div>
            <div>{props.review.text}</div>
            <div>Rate</div>
            <div>
              <Stars rating={props.review.rate} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
