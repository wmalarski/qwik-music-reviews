import { component$ } from "@builder.io/qwik";
import { Button } from "~/components/Button/Button";

export type ReviewFormData = {
  text: string;
  rate: number;
};

type Props = {
  initialValue?: ReviewFormData;
  action: string;
};

export const ReviewForm = component$<Props>((props) => {
  return (
    <form class="flex flex-col gap-2" method="post" action={props.action}>
      <div class="form-control w-full">
        <label for="text" class="label">
          <span class="label-text">Text</span>
        </label>
        <input
          class="input input-bordered w-full"
          name="text"
          id="text"
          placeholder="Type here"
          type="text"
          value={props.initialValue?.text}
        />
      </div>

      <div class="form-control w-full">
        <label for="rate" class="label">
          <span class="label-text">Rate</span>
        </label>
        <input
          class="input input-bordered w-full"
          name="rate"
          id="rate"
          placeholder="Rate"
          type="number"
          min={0}
          max={10}
          step={0.1}
          value={props.initialValue?.rate}
        />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
});
