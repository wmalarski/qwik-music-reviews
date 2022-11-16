import { component$ } from "@builder.io/qwik";
import type { Album, Artist } from "@prisma/client";
import type { Session } from "next-auth";
import { AlbumDetails } from "./AlbumDetails/AlbumDetails";
import { AlbumNavigation } from "./AlbumNavigation/AlbumNavigation";

type Props = {
  album: Album & { artist: Artist };
  session: Session;
};

export const AlbumHero = component$<Props>((props) => {
  return (
    <div class="flex flex-col justify-center">
      <AlbumDetails album={props.album} />
      <AlbumNavigation album={props.album} session={props.session} />
    </div>
  );
});
