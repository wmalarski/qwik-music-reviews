import { component$ } from "@builder.io/qwik";
import { action$, Form, z, zod$ } from "@builder.io/qwik-city";
import type { Review } from "@prisma/client";
import { getProtectedRequestContext } from "~/server/auth/context";
import { deleteReview } from "~/server/data/review";
import { paths } from "~/utils/paths";

export const deleteReviewAction = action$(
  async (data, event) => {
    const ctx = await getProtectedRequestContext(event);

    const result = await deleteReview({ ctx, ...data });

    if (result.count <= 0) {
      return event.fail(400, {
        formErrors: ["No review found"],
      });
    }

    event.redirect(302, paths.reviews);
  },
  zod$({
    id: z.string(),
  })
);

type Props = {
  review: Review;
};

export const ReviewRemoveForm = component$<Props>((props) => {
  const action = deleteReviewAction.use();

  return (
    <Form action={action}>
      <input type="hidden" name="id" value={props.review.id} />
      <pre>{JSON.stringify(action.value, null, 2)}</pre>
      <button class="btn btn-sm uppercase" type="submit">
        Remove
      </button>
    </Form>
  );
});
