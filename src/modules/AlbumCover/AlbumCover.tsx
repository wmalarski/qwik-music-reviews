import { component$ } from "@builder.io/qwik";
import type { Album, Artist } from "@prisma/client";
import { formatAlbum } from "~/utils/format";
import { getCoversAttributes } from "~/utils/images";

type Props = {
  album: Album & { artist: Artist };
};

export const AlbumCover = component$((props: Props) => {
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
/*

          <picture>
            <img
              alt={heading}
              class="max-w-full border-4 border-base-300 object-cover aspect-square"

            <picture>
              <img
                alt={heading}
                class="max-w-full border-4 border-base-300 object-cover aspect-square"

            <div class="min-w-max">
              <picture>
                <img
                  alt={`${heading} cover`}
                  class="w-80"

            <div class="min-w-max">
              <picture>
                <img
                  alt={`${heading} cover`}
                  class="w-80"


*/
