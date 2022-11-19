import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { z } from "zod";
import { ReviewForm } from "~/modules/ReviewForm/ReviewForm";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";
import { useReviewContext } from "../context";

export const onPost = endpointBuilder()
  .use(withTypedParams(z.object({ reviewId: z.string().min(1) })))
  .use(withProtectedSession())
  .use(withTrpc())
  .resolver(async ({ request, trpc, params, response }) => {
    const formData = await request.formData();
    const rate = formData.get("rate");
    const text = formData.get("text");

    await trpc.review.updateReview({
      id: params.reviewId,
      rate: rate ? +rate : undefined,
      text: text ? (text as string) : undefined,
    });

    throw response.redirect(paths.reviews);
  });

export default component$(() => {
  const reviewResource = useReviewContext();

  return (
    <div class="p-8 flex flex-col gap-4">
      <h2 class="text-xl">Edit review</h2>
      <Resource
        value={reviewResource}
        onResolved={(data) => (
          <>
            {data ? (
              <ReviewForm
                action={paths.reviewEdit(data.id)}
                initialValue={data}
              />
            ) : null}
          </>
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Edit Review - Qwik Album Review",
};
