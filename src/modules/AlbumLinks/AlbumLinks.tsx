import { component$ } from "@builder.io/qwik";
import type { Album, Artist } from "@prisma/client";
import { pathToGoogle, pathToYt } from "./AlbumLinks.utils";

type Props = {
  album: Album & { artist: Artist };
};

export const AlbumLinks = component$((props: Props) => {
  return (
    <div class="flex gap-2">
      <a
        href={pathToGoogle(props.album.title, props.album.artist.name)}
        class="link"
        target="_none"
      >
        Google
      </a>
      <a
        href={pathToYt(props.album.title, props.album.artist.name)}
        class="link"
        target="_none"
      >
        Youtube
      </a>
    </div>
  );
});
