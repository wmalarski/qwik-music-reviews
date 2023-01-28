import { component$, Slot } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { z } from "zod";
import { deleteAlbum, findAlbum } from "~/server/data/album";
import { deleteReview } from "~/server/data/review";
import {
  protectedAlbumProcedure,
  protectedProcedure,
} from "~/server/procedures";
import { paths } from "~/utils/paths";
import { AlbumHero } from "./AlbumHero/AlbumHero";

export const protectedSessionLoader = loader$(
  protectedProcedure.loader((event) => {
    return event.session;
  })
);

export const albumLoader = loader$(
  protectedAlbumProcedure.loader((event) => {
    return findAlbum({ ctx: event.ctx, id: event.typedParams.albumId });
  })
);

export const deleteAlbumAction = action$(
  protectedAlbumProcedure.action(async (_form, event) => {
    const albumId = event.typedParams.albumId;

    const result = await deleteAlbum({
      ctx: event.ctx,
      id: albumId,
    });

    if (result.count <= 0) {
      throw event.redirect(302, paths.album(albumId));
    }

    throw event.redirect(302, paths.home);
  })
);

export const deleteReviewAction = action$(
  protectedProcedure.typedAction(
    z.object({ reviewId: z.string() }),
    async (form, event) => {
      const result = await deleteReview({
        ctx: event.ctx,
        id: form.reviewId,
      });

      if (result.count <= 0) {
        return;
      }

      throw event.redirect(302, paths.reviews);
    }
  )
);

export default component$(() => {
  const album = albumLoader.use();
  const session = protectedSessionLoader.use();

  return (
    <div class="flex flex-col max-h-screen overflow-y-scroll">
      {album.value.album ? (
        <AlbumHero album={album.value.album} session={session.value} />
      ) : null}
      <Slot />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Album - Qwik Album Review",
};
