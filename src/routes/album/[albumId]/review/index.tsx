import { component$, useTask$ } from "@builder.io/qwik";
import { action$, DocumentHead, useNavigate } from "@builder.io/qwik-city";
import { z } from "zod";
import { ReviewForm } from "~/modules/ReviewForm/ReviewForm";
import { getProtectedRequestContext } from "~/server/auth/withSession";
import { createReview } from "~/server/data/review";
import { formEntries } from "~/utils/form";
import { paths } from "~/utils/paths";
import { albumLoader } from "../layout";

export const createReviewAction = action$(async (form, event) => {
  const ctx = await getProtectedRequestContext(event);
  const albumId = event.params.albumId;

  const parsed = z
    .object({
      rate: z.coerce.number().min(0).max(10),
      text: z.string().optional().default(""),
    })
    .safeParse(formEntries(form));

  if (!parsed.success) {
    return { message: parsed.error.message, status: "invalid" as const };
  }

  const review = await createReview({
    albumId,
    ctx,
    rate: parsed.data.rate,
    text: parsed.data.text,
  });

  event.redirect(302, paths.album(albumId));
  return { review, status: "success" as const };
});

export default component$(() => {
  const navigate = useNavigate();

  const albumResource = albumLoader.use();
  const createReview = createReviewAction.use();

  useTask$(({ track }) => {
    const status = track(() => createReview.value?.status);
    const albumId = createReview.value?.review?.albumId;
    if (status === "success" && albumId) {
      navigate(paths.album(albumId));
    }
  });

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
