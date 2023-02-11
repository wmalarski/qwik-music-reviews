import { component$ } from "@builder.io/qwik";
import type { Album, Artist } from "@prisma/client";
import { AlbumDetails } from "./AlbumDetails/AlbumDetails";
import { AlbumNavigation } from "./AlbumNavigation/AlbumNavigation";

type Props = {
  album: Album & { artist: Artist };
};

export const AlbumHero = component$<Props>((props) => {
  return (
    <div class="flex flex-col justify-center">
      <AlbumDetails album={props.album} />
      <AlbumNavigation album={props.album} />
    </div>
  );
});
