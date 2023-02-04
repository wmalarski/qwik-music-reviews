import { component$, useTask$ } from "@builder.io/qwik";
import { Form, useNavigate } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";
import { updateAlbumAction } from "..";

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
      <pre>{JSON.stringify(action.fail, null, 2)}</pre>
      <button type="submit">Save</button>
    </Form>
  );
});
