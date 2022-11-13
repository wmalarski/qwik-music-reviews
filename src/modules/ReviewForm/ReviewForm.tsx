import { component$, PropFunction } from "@builder.io/qwik";

export type ReviewFormData = {
  text: string;
};

type Props = {
  initialValue?: ReviewFormData;
  isLoading: boolean;
  onSubmit$: PropFunction<(data: ReviewFormData) => void>;
};

export const ReviewForm = component$(
  ({ onSubmit$, isLoading, initialValue }: Props) => {
    return (
      <form
        preventdefault:submit
        class="flex flex-col gap-2"
        onSubmit$={(event) => {
          const form = new FormData(event.target as HTMLFormElement);
          const text = (form.get("content") as string) || "";
          onSubmit$({ text });
        }}
      >
        <h2 class="text-xl">Add review</h2>

        <div class="form-control w-full">
          <label for="content" class="label">
            <span class="label-text">Text</span>
          </label>
          <input
            class="input input-bordered w-full"
            name="content"
            id="content"
            placeholder="Type here"
            type="text"
            value={initialValue?.text}
          />
        </div>

        <button
          class={{
            "btn btn-primary mt-2": true,
            loading: isLoading,
          }}
          type="submit"
        >
          Save
        </button>
      </form>
    );
  }
);
