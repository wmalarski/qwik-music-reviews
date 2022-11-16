import { component$ } from "@builder.io/qwik";
import type { Album, Artist } from "@prisma/client";
import { pathToBrainz, pathToGoogle, pathToYt } from "./AlbumLinks.utils";

type Props = {
  album: Album & { artist: Artist };
};

export const AlbumLinks = component$<Props>((props) => {
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
      {props.album.sid ? (
        <a href={pathToBrainz(props.album.sid)} class="link" target="_none">
          MusicBrainz
        </a>
      ) : null}
    </div>
  );
});
