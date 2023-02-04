import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import type { Album, Artist } from "@prisma/client";
import { cva } from "class-variance-authority";
import type { Session } from "next-auth";
import { paths } from "~/utils/paths";

type Props = {
  album: Album & { artist: Artist };
  session: Session;
};

export const link = cva(
  "link no-underline hover:border-b-2 hover:border-gray-400 text-xl",
  {
    defaultVariants: {
      isActive: false,
    },
    variants: {
      isActive: {
        false: "",
        true: "border-b-2 border-white",
      },
    },
  }
);

export const AlbumNavigation = component$<Props>(({ album, session }) => {
  const location = useLocation();

  return (
    <nav class="border-b-2 pb-4 border-base-300">
      <ul class="w-full flex flex-row justify-center gap-8">
        <li>
          <Link
            class={link({
              isActive: paths.album(album.id) === location.pathname,
            })}
            href={paths.album(album.id)}
          >
            Details
          </Link>
        </li>
        {album.userId === session.user?.id ? (
          <li>
            <Link
              class={link({
                isActive: paths.albumEdit(album.id) === location.pathname,
              })}
              href={paths.albumEdit(album.id)}
            >
              Edit
            </Link>
          </li>
        ) : null}

        <li>
          <Link
            class={link({
              isActive: paths.albumReview(album.id) === location.pathname,
            })}
            href={paths.albumReview(album.id)}
          >
            Review
          </Link>
        </li>
      </ul>
    </nav>
  );
});
