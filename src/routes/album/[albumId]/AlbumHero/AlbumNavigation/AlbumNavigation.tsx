import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import type { Album, Artist } from "@prisma/client";
import type { Session } from "next-auth";
import { paths } from "~/utils/paths";

type Props = {
  album: Album & { artist: Artist };
  session: Session;
};

export const AlbumNavigation = component$<Props>(({ album, session }) => {
  return (
    <nav>
      <ul class="w-full flex flex-row justify-center gap-8">
        <li>
          <a class="text-xl" href={paths.album(album.id)}>
            Details
          </a>
        </li>
        {album.userId === session.user?.id ? (
          <li>
            <a class="text-xl" href={paths.albumEdit(album.id)}>
              Edit
            </a>
          </li>
        ) : null}

        <li>
          <a class="text-xl" href={paths.albumReview(album.id)}>
            Review
          </a>
        </li>
      </ul>
    </nav>
  );
});

export const head: DocumentHead = {
  title: "Album - Qwik Album Review",
};
