import { component$ } from "@builder.io/qwik";
import type { Review } from "@prisma/client";
import { Button } from "~/components/Button/Button";
import { paths } from "~/utils/paths";

type Props = {
  review: Review;
};

export const ReviewRemoveForm = component$<Props>((props) => {
  return (
    <form method="post" action={paths.reviewRemove(props.review.id)}>
      <Button class="btn btn-sm uppercase" type="submit">
        Remove
      </Button>
    </form>
  );
});
