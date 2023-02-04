import { component$ } from "@builder.io/qwik";
import { Form, FormProps } from "@builder.io/qwik-city";
import type { Review } from "@prisma/client";

type Props = {
  review: Review;
  action: FormProps<unknown, { reviewId: string }>["action"];
};

export const ReviewRemoveForm = component$<Props>((props) => {
  return (
    <Form action={props.action}>
      <input type="hidden" name="reviewId" value={props.review.id} />
      <pre>{JSON.stringify(props.action.fail, null, 2)}</pre>
      <button class="btn btn-sm uppercase" type="submit">
        Remove
      </button>
    </Form>
  );
});
