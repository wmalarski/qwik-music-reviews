import { component$ } from "@builder.io/qwik";
import type { Album, Artist } from "@prisma/client";
import { Stars } from "~/components/Stars/Stars";
import { AlbumCover } from "~/modules/AlbumCover/AlbumCover";
import { AlbumLinks } from "~/modules/AlbumLinks/AlbumLinks";
import { formatAlbum } from "~/utils/format";
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
    <div class="w-64">
      <a href={paths.album(props.album.id)}>
        <div class="transition-scale scale-95 duration-300 ease-in-out hover:scale-100">
          <AlbumCover album={props.album} />
        </div>
        <span>{heading}</span>
      </a>
      <a href={paths.albumReview(props.album.id)}>
        <Stars rating={props.album.avg} />
      </a>
      <AlbumLinks album={props.album} />
    </div>
  );
});
