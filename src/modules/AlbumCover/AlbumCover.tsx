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
            class="w-64 max-w-full bg-base-200 border-4 border-base-300 object-cover aspect-square"
            {...getCoversAttributes(JSON.parse(props.album.covers))}
          />
        </picture>
      ) : (
        <div class="w-64 h-64 border-4 border-base-300 bg-base-200" />
      )}
    </>
  );
});
