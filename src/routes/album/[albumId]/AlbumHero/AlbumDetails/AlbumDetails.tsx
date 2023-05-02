import { component$ } from "@builder.io/qwik";
import {
  Form,
  globalAction$,
  useLocation,
  z,
  zod$,
} from "@builder.io/qwik-city";
import type { Album, Artist } from "@prisma/client";
import { AlbumCover } from "~/modules/AlbumCover/AlbumCover";
import { AlbumLinks } from "~/modules/AlbumLinks/AlbumLinks";
import { getProtectedRequestContext } from "~/server/auth/context";
import { deleteAlbum } from "~/server/data/album";
import { useSessionContext } from "~/utils/SessionContext";
import { paths } from "~/utils/paths";

export const useDeleteAlbumAction = globalAction$(
  async (data, event) => {
    const ctx = await getProtectedRequestContext(event);

    const result = await deleteAlbum({ ctx, ...data });

    if (result.count <= 0) {
      return event.fail(400, { formErrors: ["Album not found"] });
    }

    event.redirect(302, paths.home);
  },
  zod$({
    id: z.string(),
  })
);

export const AlbumRemoveForm = component$(() => {
  const location = useLocation();

  const action = useDeleteAlbumAction();

  return (
    <Form action={action}>
      <input type="hidden" name="id" value={location.params.albumId} />
      <button class="btn btn-sm uppercase" type="submit">
        Remove
      </button>
    </Form>
  );
});

type Props = {
  album: Album & { artist: Artist };
};

export const AlbumDetails = component$<Props>((props) => {
  const session = useSessionContext();

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
          <AlbumLinks album={props.album} />
          {session.value.user?.id === props.album.userId && <AlbumRemoveForm />}
        </div>
      </div>
    </section>
  );
});
