import { component$, useTask$ } from "@builder.io/qwik";
import { action$, Form, useNavigate, z, zod$ } from "@builder.io/qwik-city";
import { getProtectedRequestContext } from "~/server/auth/context";
import { updateAlbum } from "~/server/data/album";
import { paths } from "~/utils/paths";

export const updateAlbumAction = action$(
  async (data, event) => {
    const ctx = await getProtectedRequestContext(event);
    const albumId = event.params.albumId;

    await updateAlbum({
      ctx,
      id: albumId,
      title: data.title,
      year: data.year,
    });

    event.redirect(302, paths.album(albumId));
  },
  zod$({
    title: z.string().optional(),
    year: z.coerce.number().min(0).max(2100).int().optional(),
  })
);

export type AlbumFormData = {
  title: string;
  year: number;
};

type Props = {
  albumId: string;
  initialValue: AlbumFormData;
};

export const AlbumForm = component$<Props>((props) => {
  const navigate = useNavigate();

  const action = updateAlbumAction.use();

  useTask$(({ track }) => {
    const status = track(() => action.value?.status);
    if (status === "success") {
      navigate(paths.album(props.albumId));
    }
  });

  return (
    <Form class="flex flex-col gap-2" action={action}>
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
      </div>
      <pre>{JSON.stringify(action.value?.fieldErrors, null, 2)}</pre>
      <button type="submit">Save</button>
    </Form>
  );
});
