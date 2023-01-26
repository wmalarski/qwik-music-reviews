import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { Button } from "~/components/Button/Button";
import { deleteAlbumAction } from "../../../layout";

export const AlbumRemoveForm = component$(() => {
  const action = deleteAlbumAction.use();

  return (
    <Form action={action}>
      <Button class="btn btn-sm uppercase" type="submit">
        Remove
      </Button>
    </Form>
  );
});
