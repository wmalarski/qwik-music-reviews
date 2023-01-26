import { component$, Resource } from "@builder.io/qwik";
import { action$, DocumentHead, useLocation } from "@builder.io/qwik-city";
import { z } from "zod";
import { ReviewForm } from "~/modules/ReviewForm/ReviewForm";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";
import { useAlbumContext } from "../context";

export const createReviewAction = action$(
  endpointBuilder()
    .use(withTypedParams(z.object({ albumId: z.string().min(1) })))
    .use(withProtectedSession())
    .use(withTrpc())
    .action(async (form, event) => {
      const albumId = event.params.albumId;
      const rate = form.get("rate");
      const text = form.get("text");

      await event.trpc.review.createReview({
        albumId,
        rate: rate ? +rate : 0,
        text: text ? (text as string) : "",
      });

      throw event.redirect(302, paths.album(albumId));
    })
);

export default component$(() => {
  const location = useLocation();
  const albumResource = useAlbumContext();

  return (
    <Resource
      value={albumResource}
      onResolved={(data) => (
        <div class="p-8 flex flex-col gap-4">
          <h2 class="text-xl">Add review</h2>
          {data.album ? <ReviewForm action={location.pathname} /> : null}
        </div>
      )}
    />
  );
});

export const head: DocumentHead = {
  title: "Review Album - Qwik Album Review",
};
