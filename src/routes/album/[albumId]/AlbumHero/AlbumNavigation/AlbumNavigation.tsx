import { component$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import type { Album, Artist } from "@prisma/client";
import { cva } from "class-variance-authority";
import { paths } from "~/utils/paths";
import { useSessionContext } from "~/utils/SessionContext";

type Props = {
  album: Album & { artist: Artist };
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

export const AlbumNavigation = component$<Props>((props) => {
  const location = useLocation();

  const session = useSessionContext();

  return (
    <nav class="border-b-2 pb-4 border-base-300">
      <ul class="w-full flex flex-row justify-center gap-8">
        <li>
          <Link
            class={link({
              isActive: paths.album(props.album.id) === location.url.pathname,
            })}
            href={paths.album(props.album.id)}
          >
            Details
          </Link>
        </li>
        {props.album.userId === session.value.user?.id ? (
          <li>
            <Link
              class={link({
                isActive:
                  paths.albumEdit(props.album.id) === location.url.pathname,
              })}
              href={paths.albumEdit(props.album.id)}
            >
              Edit
            </Link>
          </li>
        ) : null}

        <li>
          <Link
            class={link({
              isActive:
                paths.albumReview(props.album.id) === location.url.pathname,
            })}
            href={paths.albumReview(props.album.id)}
          >
            Review
          </Link>
        </li>
      </ul>
    </nav>
  );
});
