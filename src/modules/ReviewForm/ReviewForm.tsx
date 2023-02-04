import { component$ } from "@builder.io/qwik";
import { Form, FormProps } from "@builder.io/qwik-city";

export type ReviewFormData = {
  text: string;
  rate: number;
};

type Props = {
  initialValue?: ReviewFormData;
  action: FormProps<unknown, { rate: number; text: string }>["action"];
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
          value={props.action.formData?.get("text") || props.initialValue?.text}
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
          value={props.action.formData?.get("rate") || props.initialValue?.rate}
        />
      </div>
      <pre>{JSON.stringify(props.action.fail, null, 2)}</pre>
      <button type="submit" class="btn uppercase">
        Save
      </button>
    </Form>
  );
});
