import { component$ } from "@builder.io/qwik";
import { Form, FormProps } from "@builder.io/qwik-city";
import type { Review } from "@prisma/client";
import { Button } from "~/components/Button/Button";

type Props = {
  review: Review;
  action: FormProps<unknown>["action"];
};

export const ReviewRemoveForm = component$<Props>((props) => {
  return (
    <Form action={props.action}>
      <input type="hidden" name="reviewId" value={props.review.id} />
      <Button class="btn btn-sm uppercase" type="submit">
        Remove
      </Button>
    </Form>
  );
});
