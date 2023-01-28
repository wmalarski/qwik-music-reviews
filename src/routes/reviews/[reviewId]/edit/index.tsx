import { component$, useTask$ } from "@builder.io/qwik";
import { action$, DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { z } from "zod";
import { ReviewForm } from "~/modules/ReviewForm/ReviewForm";
import { getProtectedRequestContext } from "~/server/auth/withSession";
import { updateReview } from "~/server/data/review";
import { formEntries } from "~/utils/form";
import { paths } from "~/utils/paths";
import { reviewLoader } from "../layout";

export const updateReviewAction = action$(async (form, event) => {
  const ctx = await getProtectedRequestContext(event);

  const parsed = z
    .object({
      rate: z.coerce.number().min(0).max(10).optional(),
      text: z.string().optional(),
    })
    .safeParse(formEntries(form));

  if (!parsed.success) {
    return { message: parsed.error.message, status: "invalid" as const };
  }

  await updateReview({
    ctx,
    id: event.params.reviewId,
    rate: parsed.data.rate,
    text: parsed.data.text,
  });

  event.redirect(302, paths.reviews);

  return { status: "success" as const };
});

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
