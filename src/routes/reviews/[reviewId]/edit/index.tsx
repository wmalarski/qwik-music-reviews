import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead } from "@builder.io/qwik-city";
import { z } from "zod";
import { ReviewForm } from "~/modules/ReviewForm/ReviewForm";
import { updateReview } from "~/server/data/review";
import { protectedReviewProcedure } from "~/server/procedures";
import { paths } from "~/utils/paths";
import { reviewLoader } from "../layout";

export const updateReviewAction = action$(
  protectedReviewProcedure.typedAction(
    z.object({
      rate: z.coerce.number().min(0).max(10).optional(),
      text: z.string().optional(),
    }),
    async (form, event) => {
      await updateReview({
        ctx: event.ctx,
        id: event.typedParams.reviewId,
        rate: form.rate,
        text: form.text,
      });

      throw event.redirect(302, paths.reviews);
    }
  )
);

export default component$(() => {
  const reviewResource = reviewLoader.use();
  const updateReview = updateReviewAction.use();

  return (
    <div class="p-8 flex flex-col gap-4">
      <h2 class="text-xl">Edit review</h2>
      {reviewResource.value ? (
        <ReviewForm action={updateReview} initialValue={reviewResource.value} />
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Edit Review - Qwik Album Review",
};
