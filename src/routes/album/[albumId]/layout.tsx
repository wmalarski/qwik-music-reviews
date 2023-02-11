import { component$, Slot } from "@builder.io/qwik";
import { action$, DocumentHead, loader$, zod$ } from "@builder.io/qwik-city";
import { z } from "zod";
import { getProtectedRequestContext } from "~/server/auth/context";
import { findAlbum } from "~/server/data/album";
import { deleteReview } from "~/server/data/review";
import { paths } from "~/utils/paths";
import { AlbumHero } from "./AlbumHero/AlbumHero";

export const protectedSessionLoader = loader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);
  return ctx.session;
});

export const albumLoader = loader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);
  return findAlbum({ ctx, id: event.params.albumId });
});

export const deleteReviewAction = action$(
  async (data, event) => {
    const ctx = await getProtectedRequestContext(event);

    const result = await deleteReview({ ctx, id: data.reviewId });

    if (result.count <= 0) {
      return { status: "error" as const };
    }

    event.redirect(302, paths.reviews);
    return { status: "success" as const };
  },
  zod$({
    reviewId: z.string(),
  })
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
