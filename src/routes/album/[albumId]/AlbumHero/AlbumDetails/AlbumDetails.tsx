import { component$ } from "@builder.io/qwik";
import type { Album, Artist } from "@prisma/client";
import { AlbumCover } from "~/modules/AlbumCover/AlbumCover";

type Props = {
  album: Album & { artist: Artist };
};

export const AlbumDetails = component$((props: Props) => {
  return (
    <section class="flex justify-center p-8">
      <div class="flex max-w-5xl flex-row items-center gap-8">
        <div class="hidden flex-grow md:flex">
          <AlbumCover album={props.album} />
        </div>
        <div class="flex flex-col gap-6">
          <div>
            <h2 class="mb-4 text-3xl">{props.album.title}</h2>
          </div>
          <div class="grid grid-cols-[max-content_1fr] items-center gap-3 text-sm opacity-80 lg:grid-cols-[max-content_1fr_max-content_1fr]">
            <div>Artist</div>
            <div>{props.album.artist.name}</div>
            {props.album.year ? (
              <>
                <div>Released</div>
                <div>{props.album.year}</div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
});
