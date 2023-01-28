import { component$ } from "@builder.io/qwik";
import { Form, FormProps } from "@builder.io/qwik-city";

export type ReviewFormData = {
  text: string;
  rate: number;
};

type Props = {
  initialValue?: ReviewFormData;
  action: FormProps<unknown>["action"];
};

export const ReviewForm = component$<Props>((props) => {
  return (
    <Form class="flex flex-col gap-2" action={props.action}>
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
      <button type="submit" class="btn uppercase">
        Save
      </button>
    </Form>
  );
});
