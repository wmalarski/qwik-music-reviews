import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead } from "@builder.io/qwik-city";
import { ReviewForm } from "~/modules/ReviewForm/ReviewForm";
import { protectedAlbumProcedure } from "~/server/procedures";
import { createReview } from "~/server/review";
import { paths } from "~/utils/paths";
import { albumLoader } from "../layout";

export const createReviewAction = action$(
  protectedAlbumProcedure.action(async (form, event) => {
    const albumId = event.typedParams.albumId;
    const rate = form.get("rate");
    const text = form.get("text");

    await createReview({
      albumId,
      ctx: event.ctx,
      rate: rate ? +rate : 0,
      text: text ? (text as string) : "",
    });

    throw event.redirect(302, paths.album(albumId));
  })
);

export default component$(() => {
  const albumResource = albumLoader.use();
  const createReview = createReviewAction.use();

  return (
    <div class="p-8 flex flex-col gap-4">
      <h2 class="text-xl">Add review</h2>
      {albumResource.value ? <ReviewForm action={createReview} /> : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Review Album - Qwik Album Review",
};
