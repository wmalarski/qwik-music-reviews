import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { deleteAlbumAction } from "../../../layout";

export const AlbumRemoveForm = component$(() => {
  const action = deleteAlbumAction.use();

  return (
    <Form action={action}>
      <button class="btn btn-sm uppercase" type="submit">
        Remove
      </button>
    </Form>
  );
});
