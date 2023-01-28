import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
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

export const AlbumGridCard = component$<Props>((props) => {
  const heading = formatAlbum({
    album: props.album,
    artist: props.album.artist,
  });

  return (
    <div class="w-64">
      <Link href={paths.album(props.album.id)}>
        <div class="transition-scale scale-95 duration-300 ease-in-out hover:scale-100">
          <AlbumCover album={props.album} />
        </div>
        <span>{heading}</span>
      </Link>
      <Link href={paths.albumReview(props.album.id)}>
        <Stars rating={props.album.avg} />
      </Link>
      <AlbumLinks album={props.album} />
    </div>
  );
});
