import { component$ } from "@builder.io/qwik";
import { Form, globalAction$, z, zod$ } from "@builder.io/qwik-city";
import type { Review } from "@prisma/client";
import { getProtectedRequestContext } from "~/server/auth/context";
import { deleteReview } from "~/server/data/review";

export const useDeleteReviewAction = globalAction$(
  async (data, event) => {
    const ctx = await getProtectedRequestContext(event);

    const result = await deleteReview({ ctx, ...data });

    if (result.count <= 0) {
      return event.fail(400, {
        formErrors: ["No review found"],
      });
    }
  },
  zod$({
    id: z.string(),
  })
);

type Props = {
  review: Review;
};

export const ReviewRemoveForm = component$<Props>((props) => {
  const action = useDeleteReviewAction();

  return (
    <Form action={action}>
      <input type="hidden" name="id" value={props.review.id} />
      <button class="btn btn-sm uppercase" type="submit">
        Remove
      </button>
    </Form>
  );
});
