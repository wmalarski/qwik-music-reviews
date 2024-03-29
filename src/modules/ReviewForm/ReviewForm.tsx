import { component$ } from "@builder.io/qwik";
import { Form, globalAction$, z, zod$ } from "@builder.io/qwik-city";
import { getProtectedRequestContext } from "~/server/auth/context";
import { createReview, updateReview } from "~/server/data/review";
import type { ActionInput } from "~/server/types";
import { paths } from "~/utils/paths";

export const useCreateOrUpdateReviewAction = globalAction$(
  async (data, event) => {
    const ctx = await getProtectedRequestContext(event);

    if (data.id) {
      await updateReview({ ctx, id: data.id, ...data });
      event.redirect(302, paths.album(data.albumId));
      return;
    }

    await createReview({ ctx, ...data });
    event.redirect(302, paths.album(data.albumId));
  },
  zod$({
    albumId: z.string(),
    id: z.string().optional(),
    rate: z.coerce.number().min(0).max(10),
    text: z.string(),
  })
);

type Props = {
  albumId: string;
  initialValue?: ActionInput<typeof useCreateOrUpdateReviewAction>;
};

export const ReviewForm = component$<Props>((props) => {
  const action = useCreateOrUpdateReviewAction();

  return (
    <Form class="flex flex-col gap-2" action={action}>
      <input type="hidden" name="id" value={props.initialValue?.id} />
      <input type="hidden" name="albumId" value={props.albumId} />
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
          value={action.formData?.get("text") || props.initialValue?.text}
        />
        <span class="label text-red-500">
          {action.value?.fieldErrors?.text?.[0]}
        </span>
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
          value={action.formData?.get("rate") || props.initialValue?.rate}
        />
        <span class="label text-red-500">
          {action.value?.fieldErrors?.rate?.[0]}
        </span>
      </div>

      <pre>{JSON.stringify(action.value, null, 2)}</pre>
      <button type="submit" class="btn uppercase">
        Save
      </button>
    </Form>
  );
});
