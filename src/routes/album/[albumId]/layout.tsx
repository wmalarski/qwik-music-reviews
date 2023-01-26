import { component$, Slot } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { z } from "zod";
import { protectedSessionLoader } from "~/routes/layout";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";
import { AlbumHero } from "./AlbumHero/AlbumHero";

export const albumLoader = loader$(
  endpointBuilder()
    .use(withTypedParams(z.object({ albumId: z.string().min(1) })))
    .use(withProtectedSession())
    .use(withTrpc())
    .loader((event) => {
      return event.trpc.album.findAlbum({ id: event.params.albumId });
    })
);

export const deleteAlbumAction = action$(
  endpointBuilder()
    .use(withTypedParams(z.object({ albumId: z.string().min(1) })))
    .use(withProtectedSession())
    .use(withTrpc())
    .action(async (_form, event) => {
      const albumId = event.params.albumId;

      const result = await event.trpc.album.deleteAlbum({
        id: albumId,
      });

      if (result.count <= 0) {
        throw event.redirect(302, paths.album(albumId));
      }

      throw event.redirect(302, paths.home);
    })
);

export const deleteReviewAction = action$(
  endpointBuilder()
    .use(withTypedParams(z.object({ reviewId: z.string().min(1) })))
    .use(withProtectedSession())
    .use(withTrpc())
    .action(async (form, event) => {
      const reviewId = form.get("reviewId") as string;

      const result = await event.trpc.review.deleteReview({
        id: reviewId,
      });

      if (result.count <= 0) {
        return;
      }

      throw event.redirect(302, paths.reviews);
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
