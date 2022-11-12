import { component$ } from "@builder.io/qwik";
import type { Album, Artist } from "@prisma/client";
import { Stars } from "~/components/RouterHead/Stars/Stars";
import { formatAlbum } from "~/utils/format";
import { Covers, getCoversAttributes } from "~/utils/images";
import { paths } from "~/utils/paths";

export type AlbumGridItem = Album & {
  artist: Artist;
  avg: number;
  reviews: number;
};

type Props = {
  album: AlbumGridItem;
};

export const AlbumGridCard = component$((props: Props) => {
  const heading = formatAlbum({
    album: props.album,
    artist: props.album.artist,
  });

  return (
    <a href={paths.album(props.album.id)} class="w-64">
      <div class="transition-scale scale-95 duration-300 ease-in-out hover:scale-100">
        <picture>
          <img
            alt={heading}
            class="max-w-full border-4 border-base-300 object-cover aspect-square"
            {...getCoversAttributes((props.album.covers || {}) as Covers)}
          />
        </picture>
      </div>
      <span>{heading}</span>
      <Stars rating={props.album.avg} />
    </a>
  );
});
