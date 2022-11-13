import { component$, PropFunction } from "@builder.io/qwik";
import { Button } from "~/components/Button/Button";

export type ReviewFormData = {
  text: string;
  rate: number;
};

type Props = {
  initialValue?: ReviewFormData;
  isLoading: boolean;
  onSubmit$: PropFunction<(data: ReviewFormData) => void>;
};

export const ReviewForm = component$(
  ({ isLoading, initialValue, onSubmit$ }: Props) => {
    return (
      <form
        preventdefault:submit
        class="flex flex-col gap-2"
        onSubmit$={(event) => {
          const form = new FormData(event.target as HTMLFormElement);
          const text = (form.get("text") as string) || "";
          const rate = +(form.get("rate") || "0");
          onSubmit$({ rate, text });
        }}
      >
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
            value={initialValue?.text}
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
            value={initialValue?.rate}
          />
        </div>

        <Button isLoading={isLoading} type="submit">
          Save
        </Button>
      </form>
    );
  }
);
