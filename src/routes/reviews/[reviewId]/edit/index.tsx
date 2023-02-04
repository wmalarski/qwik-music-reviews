import { component$, useTask$ } from "@builder.io/qwik";
import {
  action$,
  DocumentHead,
  useNavigate,
  zod$,
} from "@builder.io/qwik-city";
import { z } from "zod";
import { ReviewForm } from "~/modules/ReviewForm/ReviewForm";
import { getProtectedRequestContext } from "~/server/auth/context";
import { updateReview } from "~/server/data/review";
import { paths } from "~/utils/paths";
import { reviewLoader } from "../layout";

export const updateReviewAction = action$(
  async (data, event) => {
    const ctx = await getProtectedRequestContext(event);

    await updateReview({
      ctx,
      id: event.params.reviewId,
      rate: data.rate,
      text: data.text,
    });

    event.redirect(302, paths.reviews);

    return { status: "success" as const };
  },
  zod$({
    rate: z.coerce.number().min(0).max(10).optional(),
    text: z.string().optional(),
  })
);

export default component$(() => {
  const navigate = useNavigate();

  const reviewResource = reviewLoader.use();
  const updateReview = updateReviewAction.use();

  useTask$(({ track }) => {
    const status = track(() => updateReview.value?.status);
    if (status === "success") {
      navigate(paths.reviews);
    }
  });

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
