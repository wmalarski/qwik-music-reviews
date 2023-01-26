import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead } from "@builder.io/qwik-city";
import { z } from "zod";
import { ReviewForm } from "~/modules/ReviewForm/ReviewForm";
import { withProtectedSession } from "~/server/auth/withSession";
import { updateReview } from "~/server/review";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";
import { reviewLoader } from "../layout";

export const updateReviewAction = action$(
  endpointBuilder()
    .use(withTypedParams(z.object({ reviewId: z.string().min(1) })))
    .use(withProtectedSession())
    .action(async (form, event) => {
      const rate = form.get("rate");
      const text = form.get("text");

      await updateReview({
        ctx: event.ctx,
        id: event.params.reviewId,
        rate: rate ? +rate : undefined,
        text: text ? (text as string) : undefined,
      });

      throw event.redirect(302, paths.reviews);
    })
);

export default component$(() => {
  const reviewResource = reviewLoader.use();

  return (
    <div class="p-8 flex flex-col gap-4">
      <h2 class="text-xl">Edit review</h2>
      {reviewResource.value ? (
        <ReviewForm
          action={paths.reviewEdit(reviewResource.value.id)}
          initialValue={reviewResource.value}
        />
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Edit Review - Qwik Album Review",
};
