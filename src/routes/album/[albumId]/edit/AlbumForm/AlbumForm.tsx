import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { Button } from "~/components/Button/Button";
import { updateAlbumAction } from "..";

export type AlbumFormData = {
  title: string;
  year: number;
};

type Props = {
  initialValue?: AlbumFormData;
  action: string;
};

export const AlbumForm = component$<Props>((props) => {
  const action = updateAlbumAction.use();

  return (
    <Form class="flex flex-col gap-2" method="post" action={action}>
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
          value={props.initialValue?.title}
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
          value={props.initialValue?.year}
        />
      </div>
      <Button type="submit">Save</Button>
    </Form>
  );
});
