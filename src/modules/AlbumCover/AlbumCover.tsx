import { component$ } from "@builder.io/qwik";
import type { Album, Artist } from "@prisma/client";
import { formatAlbum } from "~/utils/format";
import { getCoversAttributes } from "~/utils/images";

type Props = {
  album: Album & { artist: Artist };
};

export const AlbumCover = component$<Props>((props) => {
  const heading = formatAlbum({
    album: props.album,
    artist: props.album.artist,
  });

  return (
    <>
      {props.album.covers ? (
        <picture>
          <img
            alt={heading}
            class="w-80 max-w-full border-4 border-base-300 object-cover aspect-square"
            {...getCoversAttributes(JSON.parse(props.album.covers))}
          />
        </picture>
      ) : null}
    </>
  );
});
