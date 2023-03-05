import { component$ } from "@builder.io/qwik";
import {
  Form,
  globalAction$,
  useLocation,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { getProtectedRequestContext } from "~/server/auth/context";
import { updateAlbum } from "~/server/data/album";
import type { ActionInput } from "~/server/types";
import { paths } from "~/utils/paths";

export const updateAlbumAction = globalAction$(
  async (data, event) => {
    const ctx = await getProtectedRequestContext(event);

    await updateAlbum({ ctx, ...data });

    event.redirect(302, paths.album(data.id));
  },
  zod$({
    id: z.string(),
    title: z.string().optional(),
    year: z.coerce.number().min(0).max(2100).int().optional(),
  })
);

export type AlbumFormData = {
  title: string;
  year: number;
};

type Props = {
  initialValue: ActionInput<typeof updateAlbumAction>;
};

export const AlbumForm = component$<Props>((props) => {
  const location = useLocation();

  const action = updateAlbumAction();

  return (
    <Form class="flex flex-col gap-2" action={action}>
      <input type="hidden" name="id" value={location.params.albumId} />
      <div class="form-control w-full">
        <label for="title" class="label">
          <span class="label-text">Title</span>
        </label>
        <input
          class="input input-bordered w-full"
          name="title"
          id="title"
          placeholder="Title"
          type="text"
          value={action.formData?.get("text") || props.initialValue?.title}
        />
        <span class="label text-red-500">
          {action.value?.fieldErrors?.title?.[0]}
        </span>
      </div>

      <div class="form-control w-full">
        <label for="year" class="label">
          <span class="label-text">Year</span>
        </label>
        <input
          class="input input-bordered w-full"
          name="year"
          id="year"
          placeholder="Year"
          type="number"
          min={1900}
          max={2100}
          step={1}
          value={action.formData?.get("year") || props.initialValue?.year}
        />
        <span class="label text-red-500">
          {action.value?.fieldErrors?.year?.[0]}
        </span>
      </div>
      <pre>{JSON.stringify(action.value?.fieldErrors, null, 2)}</pre>
      <button type="submit">Save</button>
    </Form>
  );
});
